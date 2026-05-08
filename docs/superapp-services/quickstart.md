---
id: quickstart
title: "Quickstart: Hello SuperApp"
sidebar_label: 1. Quickstart
sidebar_position: 2
description: From zero to working login + chat message + payment in 60 minutes. Next.js + Vercel reference stack.
---

# Quickstart: Hello SuperApp

> In **60 minutes**, you'll have a Next.js app that logs a user in via KOBIL Identity, sends them a chat message via mPower, and creates a payment via mPay — all on a free Vercel + Neon stack.

The reference repo for this guide is **[ipyoussef-rgb/terbuch](https://github.com/ipyoussef-rgb/terbuch)**. Clone it or copy the patterns into your own project.

## Prerequisites

You should have completed [Before You Start](./before-you-start/) and have:

- `idp_host`, `realm` from your KOBIL contact
- A user-UI OIDC client (`client_id` + `client_secret`)
- A server-to-server OIDC client (`client_id` + `client_secret`)
- A test user with an activated mIdentity device
- Node 20+, pnpm, a free Vercel account

## Step 1 — Clone and configure (5 min)

```bash
git clone https://github.com/ipyoussef-rgb/terbuch.git my-superapp
cd my-superapp
pnpm install
cp .env.example .env
```

Fill in `.env`:

```ini
KOBIL_IDP_ISSUER=https://idp.<tenant>.kobil.com/auth/realms/<realm>
KOBIL_REALM=<realm>

# User UI client (Authorization Code + PKCE)
KOBIL_USER_CLIENT_ID=your-app-user
KOBIL_USER_CLIENT_SECRET=...

# Server-to-server client (client_credentials)
KOBIL_SERVER_CLIENT_ID=your-app-server
KOBIL_SERVER_CLIENT_SECRET=...

# Service hosts
KOBIL_MPOWER_BASE=https://idp.<tenant>.kobil.com/auth/realms/<realm>/mpower/v1
KOBIL_PAY_BASE=https://pay.<tenant>.kobil.com

# Your app
APP_BASE_URL=http://localhost:3000
AUTH_SECRET=$(openssl rand -hex 32)
DATABASE_URL=postgres://...   # Neon free-tier
```

## Step 2 — Verify OIDC login (10 min)

```bash
pnpm dev
```

Open `http://localhost:3000`. Click **Login**. You should be redirected to the KOBIL login page; complete the mIdentity confirmation on your test device. You land back on the app, authenticated.

If you see *Invalid redirect_uri*, double-check **Step 2** of [Get Your Credentials](./before-you-start/get-credentials).

## Step 3 — Send your first chat message (10 min)

Once logged in, the app stores both `sub` (UUID) and `email` from the OIDC userinfo. Use the email for chat:

```ts
// app/api/admin/send-chat/route.ts
import { getServerToken } from "@/lib/kobil-token";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { recipientEmail, text } = await req.json();
  const token = await getServerToken();

  const res = await fetch(
    `${process.env.KOBIL_MPOWER_BASE}/users/${encodeURIComponent(recipientEmail)}/message`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serviceUuid: process.env.KOBIL_SERVER_CLIENT_ID,
        version: 3,
        messageType: "processChatMessage",
        messageContent: { messageText: text },
      }),
    }
  );

  if (!res.ok) {
    return Response.json({ error: await res.text() }, { status: res.status });
  }
  return Response.json({ ok: true });
}
```

Trigger it:

```bash
curl -X POST http://localhost:3000/api/admin/send-chat \
  -H 'Content-Type: application/json' \
  -d '{"recipientEmail":"alice@example.com","text":"Hello from my Super App"}'
```

Expected: `{ "ok": true }` and a notification on Alice's mIdentity device.

:::warning Common errors
- **404 *User does not exist*** — you sent the OIDC `sub` UUID. Switch to email.
- **401** — token cache stale; invalidate and retry.
- **`messageType: "plainText"` rejected** — use `processChatMessage`.
:::

## Step 4 — Create your first payment (15 min)

```ts
// app/api/admin/create-payment/route.ts
import { randomUUID } from "node:crypto";
import { getServerToken } from "@/lib/kobil-token";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { userSub, amountCents } = await req.json();
  const token = await getServerToken();

  const res = await fetch(`${process.env.KOBIL_PAY_BASE}/mpay-merchant/create/transaction`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: 1,
      idempotencyId: randomUUID(),
      userId: userSub,                              // OIDC sub UUID, not email
      merchantId: process.env.KOBIL_SERVER_CLIENT_ID,
      merchantServiceUUID: process.env.KOBIL_SERVER_CLIENT_ID,
      merchantName: "My Super App",
      merchantCallback: `${process.env.APP_BASE_URL}/api/payment-callback`,
      transactionTimeout: 60,                       // hard max
      amount: amountCents,
      tenantId: process.env.KOBIL_REALM,
      currency: "EUR",
      paymentContent: [[{ key: "Test purchase", value: `${amountCents / 100} EUR` }]],
    }),
  });

  return Response.json(await res.json(), { status: res.status });
}
```

Trigger:

```bash
curl -X POST http://localhost:3000/api/admin/create-payment \
  -H 'Content-Type: application/json' \
  -d '{"userSub":"<oidc-sub-uuid>","amountCents":1999}'
```

Approve the payment on the user's mIdentity device. The final status arrives on your `merchantCallback`.

## Step 5 — Receive the payment callback (10 min)

```ts
// app/api/payment-callback/route.ts
export const maxDuration = 60;

export async function POST(req: Request) {
  const body = await req.json();
  // body: { transactionId, status, transactionStatus, message, ... }
  console.log("[pay callback]", body);

  // Persist canonical final status. Never overwrite a final status with later "inquiring status".
  await persistTransactionStatus(body.transactionId, body.transactionStatus ?? body.status);

  return Response.json({ ok: true });
}
```

:::danger Persistence rule
**Never overwrite a known-final status** (`finished`, `cancelled`, `closed`, `timeout`, `error`, `void`, `refund`) with a later `"inquiring status"` from a `/status` poll. The merchantCallback is the source of truth.
:::

## Step 6 — Make the callback URL public (10 min)

For local dev, expose `localhost:3000` via an ngrok-style tunnel and set `APP_BASE_URL` to the public URL. For prod, deploy to Vercel:

```bash
vercel --prod
```

Set the same env vars in the Vercel dashboard. **Add `APP_BASE_URL=https://your.app`** so the callback URL Pay sees is canonical, not a preview deployment.

:::warning Whitelist callback paths
Both the chat webhook and the pay merchantCallback must be **publicly reachable with no auth header**. If you have an auth `proxy.ts`, allowlist `/api/payment-callback` and `/api/chat-webhook`.
:::

## You did it

You now have:

- ✓ OIDC login with mIdentity
- ✓ Server-side token caching (`client_credentials`)
- ✓ Outbound chat message via mPower
- ✓ Inbound chat webhook handling
- ✓ Outbound payment creation via mPay
- ✓ Inbound payment callback handling

## Next steps

- Drill into [Core Integrations](./core-integrations/) for each service.
- Run through the [Production checklist](./reference/production-checklist) before go-live.
- If anything fails, [Error codes & troubleshooting](./reference/error-codes) lists the symptoms and fixes.

---

*Last verified: 2026-05-08 against tenant `mycity.kobil.com`.*
