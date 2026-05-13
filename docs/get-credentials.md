---
id: get-credentials
title: Step 1 — Get Your Credentials
sidebar_label: 1. Get Credentials
sidebar_position: 2
description: Set up the two OIDC clients you need to integrate with the Germany App platform.
---

# Step 1 — Get Your Credentials

You'll create **two OIDC clients in the same realm** of the Germany App tenant:

| Client | Auth flow | Used for |
|---|---|---|
| **User UI** | Authorization Code + PKCE (S256) | End-user login from browser or native app |
| **Server-to-server** | `client_credentials` | Your backend calling Chat and Payments |

> **Why two?** Mixing user logins and service calls in one client is a footgun: you'd either expose a client secret to the browser or lose the ability to do server-to-server work. Two minimal clients is cleaner.

## What you need before you start

- Access to the **KOBIL Portal** for the Germany App tenant.
- The **realm name** (e.g. `germany-app`).
- The **IDP host** (e.g. `https://idp.germany-app.kobil.com`).

If you don't have these, request them from your onboarding contact before continuing.

## 1.1 — Open the KOBIL Portal

Sign in at the portal URL provided by your contact. Select your realm from the top-left dropdown.

## 1.2 — Create the User-UI client

1. **Clients → Create client**
2. **Client type:** OpenID Connect
3. **Client ID:** e.g. `partner-app-user`
4. **Client authentication:** ON
5. **Authentication flow:** check **Standard flow** only (uncheck Service Accounts and Direct Access Grants)
6. **Valid redirect URIs:** add both
   ```
   https://your.app/api/auth/user/callback
   http://localhost:3000/api/auth/user/callback
   ```
7. **Web origins:** `+` (use the redirect URIs)
8. Save
9. **Advanced → PKCE Code Challenge Method:** `S256`
10. **Credentials tab:** copy the secret

## 1.3 — Create the Server-to-Server client

1. **Clients → Create client**
2. **Client ID:** e.g. `partner-app-server`
3. **Client authentication:** ON
4. **Authentication flow:** uncheck Standard flow, check **Service accounts roles**
5. Save
6. **Credentials tab:** copy the secret

This client's `client_id` is what you'll send as `serviceUuid` (Chat) and `merchantId` (Payments).

## 1.4 — Verify it works

Discovery (no auth):

```bash
curl https://idp.<tenant>.kobil.com/auth/realms/<realm>/.well-known/openid-configuration
```

Server-to-server token:

```bash
curl -X POST https://idp.<tenant>.kobil.com/auth/realms/<realm>/protocol/openid-connect/token \
  -u 'partner-app-server:<server-secret>' \
  -d 'grant_type=client_credentials'
```

A successful response looks like:

```json
{ "access_token": "eyJ...", "expires_in": 300, "token_type": "Bearer" }
```

Cache that token for ~270 s in your backend.

## 1.5 — Save your `.env`

```bash
KOBIL_IDP_HOST=https://idp.<tenant>.kobil.com
KOBIL_REALM=<realm>
KOBIL_USER_CLIENT_ID=partner-app-user
KOBIL_USER_CLIENT_SECRET=<paste>
KOBIL_SERVER_CLIENT_ID=partner-app-server
KOBIL_SERVER_CLIENT_SECRET=<paste>
APP_BASE_URL=http://localhost:3000
```

Never commit `.env`. Add it to `.gitignore`.

## Common errors at this stage

| Symptom | Cause | Fix |
|---|---|---|
| 400 *Invalid redirect_uri* | URL not exactly registered (trailing slash, port, scheme) | Add the exact URL to **Valid redirect URIs** |
| 401 on token endpoint | Wrong `client_id` / `client_secret` or wrong realm | Re-copy secret from Credentials tab |
| 500 *displayWide* macro on auth | Custom Login Theme broken | Set Login Theme to empty (= realm default) |
| `client_credentials` returns 400 *unauthorized_client* | Service Accounts not enabled on server client | Toggle **Service accounts roles** ON |

## Next

Continue to [Step 2 — Add Login](/login).
