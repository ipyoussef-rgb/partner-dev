---
id: get-credentials
title: Get Your Credentials
sidebar_label: Get Your Credentials
sidebar_position: 5
description: Set up the two OIDC clients you need for a typical Super App integration — user-facing (PKCE) and server-to-server (client_credentials).
---

# Get Your Credentials

A typical KOBIL integration uses **two OIDC clients in the same realm**:

| Client | Auth flow | Used for |
|---|---|---|
| **User UI** | Authorization Code + PKCE (S256) | End-user login from a browser or native app |
| **Server-to-server** | `client_credentials` | Backend calls to mPower (chat) and mPay |

Larger setups add a **separate Admin UI client** with its own redirect URI for back-office staff. The pattern is the same.

## Why two clients

Mixing user logins and service calls in one client is a footgun: you'd either expose a client secret to the browser (broken) or lose the ability to do server-to-server work (mPower and mPay both require `client_credentials`). Separating them costs nothing and keeps each client minimal.

## Step 1 — Open the KOBIL Portal

Sign in at the KOBIL Portal URL provided by your contact. It looks like a Keycloak admin console with KOBIL extensions. Select your realm from the top-left dropdown.

## Step 2 — Create the User UI client

1. **Clients → Create client**.
2. **Client type:** OpenID Connect.
3. **Client ID:** something like `your-app-user`.
4. Next.
5. **Client authentication:** ON.
6. **Authentication flow:** check **Standard flow** (Authorization Code). Uncheck Service Accounts and Direct Access Grants.
7. Next.
8. **Valid redirect URIs:** add **all** of:
   ```
   https://your.app/api/auth/user/callback
   http://localhost:3000/api/auth/user/callback
   ```
9. **Web origins:** `+` (use the redirect URIs).
10. Save.
11. **Advanced → Proof Key for Code Exchange (PKCE) Code Challenge Method:** `S256`.
12. **Credentials tab:** copy the client secret.

## Step 3 — Create the Server-to-Server client

1. **Clients → Create client**.
2. **Client ID:** something like `your-app-server`.
3. Next.
4. **Client authentication:** ON.
5. **Authentication flow:** uncheck Standard flow. Check **Service accounts roles**.
6. Save.
7. **Credentials tab:** copy the client secret.

This client's `client_id` is what you'll send as `serviceUuid` (chat) and `merchantId`/`merchantServiceUUID` (pay).

## Step 4 — Verify both clients

Discovery document (no auth required):

```bash
curl https://idp.<tenant>.kobil.com/auth/realms/<realm>/.well-known/openid-configuration
```

User-UI authorize URL (paste in a browser; expect KOBIL login screen):

```
https://idp.<tenant>.kobil.com/auth/realms/<realm>/protocol/openid-connect/auth
  ?client_id=your-app-user
  &redirect_uri=http://localhost:3000/api/auth/user/callback
  &response_type=code
  &scope=openid+profile+email
  &code_challenge=<random>
  &code_challenge_method=S256
```

Server-to-server token:

```bash
curl -X POST https://idp.<tenant>.kobil.com/auth/realms/<realm>/protocol/openid-connect/token \
  -u 'your-app-server:<server-client-secret>' \
  -d 'grant_type=client_credentials'
```

A successful response is a JSON `{ "access_token": "...", "expires_in": 300, ... }`. Cache it for ~270 s.

## Common errors at this stage

| Symptom | Cause | Fix |
|---|---|---|
| 400 *Invalid redirect_uri* | URL not exactly registered (trailing slash, port, scheme) | Add the exact URL to **Valid redirect URIs** |
| 401 on token endpoint | Wrong `client_id`/`client_secret` or wrong realm | Verify against the Credentials tab; re-copy secret |
| 500 on auth endpoint with `displayWide` macro error | Custom Login Theme broken | Set Login Theme to empty (= realm default) on the client |
| `client_credentials` returns 400 *unauthorized_client* | Service Accounts not enabled on the server client | Toggle **Service accounts roles** ON, save |

:::tip Save the values now
Put both `client_id` / `client_secret` pairs and the `idp_host` / `realm` into your local `.env`. Never commit them. You'll need them in the [Quickstart](../quickstart).
:::

## Next

You now have everything to start coding. Continue with the [Quickstart](../quickstart) for an end-to-end working app.
