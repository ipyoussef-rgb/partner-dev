---
id: quickstart
title: "Quickstart: Hello SuperApp"
sidebar_label: 1. Quickstart
sidebar_position: 2
description: Von Null bis zu funktionierendem Login + Chat-Nachricht + Zahlung in 60 Minuten. Next.js + Vercel als Referenz-Stack.
---

# Quickstart: Hello SuperApp

> In **60 Minuten** hast du eine Next.js-App, die einen Nutzer über KOBIL Identity einloggt, ihm eine Chat-Nachricht über mPower schickt und eine Zahlung über mPay erstellt — alles auf einem kostenlosen Vercel + Neon-Stack.

Das Referenz-Repo für diesen Guide ist **[ipyoussef-rgb/terbuch](https://github.com/ipyoussef-rgb/terbuch)**. Klonen oder die Patterns in dein eigenes Projekt übernehmen.

## Voraussetzungen

[Bevor du startest](./before-you-start/) sollte abgeschlossen sein. Du brauchst:

- `idp_host`, `realm` von deinem KOBIL-Kontakt
- User-UI-OIDC-Client (`client_id` + `client_secret`)
- Server-zu-Server-OIDC-Client (`client_id` + `client_secret`)
- Test-Nutzer mit aktiviertem mIdentity-Gerät
- Node 20+, pnpm, kostenloser Vercel-Account

## Schritt 1 — Klonen und konfigurieren (5 Min)

```bash
git clone https://github.com/ipyoussef-rgb/terbuch.git my-superapp
cd my-superapp
pnpm install
cp .env.example .env
```

`.env` befüllen:

```ini
KOBIL_IDP_ISSUER=https://idp.<tenant>.kobil.com/auth/realms/<realm>
KOBIL_REALM=<realm>

# User-UI-Client (Authorization Code + PKCE)
KOBIL_USER_CLIENT_ID=your-app-user
KOBIL_USER_CLIENT_SECRET=...

# Server-zu-Server-Client (client_credentials)
KOBIL_SERVER_CLIENT_ID=your-app-server
KOBIL_SERVER_CLIENT_SECRET=...

# Service-Hosts
KOBIL_MPOWER_BASE=https://idp.<tenant>.kobil.com/auth/realms/<realm>/mpower/v1
KOBIL_PAY_BASE=https://pay.<tenant>.kobil.com

# Deine App
APP_BASE_URL=http://localhost:3000
AUTH_SECRET=$(openssl rand -hex 32)
DATABASE_URL=postgres://...   # Neon free-tier
```

## Schritt 2 — OIDC-Login verifizieren (10 Min)

```bash
pnpm dev
```

`http://localhost:3000` öffnen. **Login** klicken. Du wirst auf die KOBIL-Login-Seite umgeleitet; mIdentity-Bestätigung auf dem Test-Gerät durchführen. Du landest authentifiziert zurück in der App.

Bei *Invalid redirect_uri* nochmal **Schritt 2** in [Credentials anlegen](./before-you-start/get-credentials) prüfen.

## Schritt 3 — Erste Chat-Nachricht senden (10 Min)

Nach dem Login speichert die App sowohl `sub` (UUID) als auch `email` aus dem OIDC-Userinfo. Für Chat verwendest du die E-Mail:

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

Auslösen:

```bash
curl -X POST http://localhost:3000/api/admin/send-chat \
  -H 'Content-Type: application/json' \
  -d '{"recipientEmail":"alice@example.com","text":"Hallo aus meiner Super App"}'
```

Erwartet: `{ "ok": true }` und eine Notification auf Alices mIdentity-Gerät.

:::warning Häufige Fehler
- **404 *User does not exist*** — du hast die OIDC `sub` UUID gesendet. Auf E-Mail wechseln.
- **401** — Token-Cache veraltet; invalidieren und neu versuchen.
- **`messageType: "plainText"` abgelehnt** — `processChatMessage` verwenden.
:::

## Schritt 4 — Erste Zahlung erstellen (15 Min)

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
      userId: userSub,                              // OIDC sub UUID, nicht E-Mail
      merchantId: process.env.KOBIL_SERVER_CLIENT_ID,
      merchantServiceUUID: process.env.KOBIL_SERVER_CLIENT_ID,
      merchantName: "My Super App",
      merchantCallback: `${process.env.APP_BASE_URL}/api/payment-callback`,
      transactionTimeout: 60,                       // Hard-Limit
      amount: amountCents,
      tenantId: process.env.KOBIL_REALM,
      currency: "EUR",
      paymentContent: [[{ key: "Test purchase", value: `${amountCents / 100} EUR` }]],
    }),
  });

  return Response.json(await res.json(), { status: res.status });
}
```

Auslösen:

```bash
curl -X POST http://localhost:3000/api/admin/create-payment \
  -H 'Content-Type: application/json' \
  -d '{"userSub":"<oidc-sub-uuid>","amountCents":1999}'
```

Zahlung in der mIdentity-App des Nutzers bestätigen. Der finale Status kommt auf deinem `merchantCallback` an.

## Schritt 5 — Payment-Callback empfangen (10 Min)

```ts
// app/api/payment-callback/route.ts
export const maxDuration = 60;

export async function POST(req: Request) {
  const body = await req.json();
  // body: { transactionId, status, transactionStatus, message, ... }
  console.log("[pay callback]", body);

  // Kanonischen finalen Status persistieren. Nie mit späteren "inquiring status" überschreiben.
  await persistTransactionStatus(body.transactionId, body.transactionStatus ?? body.status);

  return Response.json({ ok: true });
}
```

:::danger Persistenz-Regel
**Niemals einen bekannten finalen Status** (`finished`, `cancelled`, `closed`, `timeout`, `error`, `void`, `refund`) **mit einem späteren `"inquiring status"` aus einem `/status`-Poll überschreiben.** Der merchantCallback ist die Source of Truth.
:::

## Schritt 6 — Callback-URL öffentlich machen (10 Min)

Lokal: `localhost:3000` per ngrok-Tunnel exponieren und `APP_BASE_URL` auf die öffentliche URL setzen. Für Prod: nach Vercel deployen:

```bash
vercel --prod
```

Im Vercel-Dashboard dieselben Env-Vars setzen. **`APP_BASE_URL=https://your.app`** setzen, damit Pay die kanonische URL sieht (nicht eine Preview).

:::warning Callback-Pfade whitelisten
Sowohl der Chat-Webhook als auch der Pay-merchantCallback müssen **öffentlich erreichbar sein, ohne Auth-Header**. Wenn du eine `proxy.ts` mit Auth hast, allowliste `/api/payment-callback` und `/api/chat-webhook`.
:::

## Geschafft

Du hast jetzt:

- ✓ OIDC-Login mit mIdentity
- ✓ Server-seitiges Token-Caching (`client_credentials`)
- ✓ Outbound-Chat-Nachricht via mPower
- ✓ Inbound-Chat-Webhook-Handling
- ✓ Outbound-Zahlung via mPay
- ✓ Inbound-Payment-Callback-Handling

## Nächste Schritte

- Tieferer Einstieg: [Core Integrations](./core-integrations/) für jeden Service.
- [Production-Checkliste](./reference/production-checklist) vor Go-Live durchgehen.
- Wenn etwas fehlschlägt: [Fehlercodes & Troubleshooting](./reference/error-codes) listet Symptome und Fixes.

---

*Zuletzt verifiziert: 2026-05-08 gegen Tenant `mycity.kobil.com`.*
