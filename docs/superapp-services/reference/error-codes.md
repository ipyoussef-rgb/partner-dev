---
id: error-codes
title: Error Codes & Troubleshooting
sidebar_label: Error Codes
sidebar_position: 2
description: All the 4xx and 5xx KOBIL responses you'll hit, sorted by status code, with the fix for each.
---

# Error Codes & Troubleshooting

Sorted by HTTP status code. If you don't see your error here, [open an issue or contact support](mailto:contactus@kobil.com).

## 400 Bad Request

| Service | Body | Cause | Fix |
|---|---|---|---|
| Identity | *Invalid redirect_uri* | Redirect URI not registered exactly | Add the exact URL (with/without trailing slash, with port) to **Valid Redirect URIs** |
| Identity | *unauthorized_client* (client_credentials) | Service Accounts not enabled | Toggle **Service accounts roles** ON on the server client |
| Pay | `["transactionTimeout should be maximum 60"]` | `transactionTimeout > 60` | Cap at 60 |
| Chat | `messageType: "plainText"` rejected | Wrong type literal | Use `processChatMessage` |

## 401 Unauthorized

| Service | Cause | Fix |
|---|---|---|
| Any | Token expired (cache stale) | Invalidate token cache, retry once |
| Chat | `serviceUuid` ≠ token `client_id` | Set `serviceUuid` to the same `client_id` as the token |
| Pay callback | Your auth middleware intercepting the callback | Whitelist callback path in `proxy.ts` |
| Token endpoint | Wrong `client_id`/`client_secret` or wrong realm | Re-copy from Credentials tab; verify realm |

## 403 Forbidden

| Service | Symptom | Cause | Fix |
|---|---|---|---|
| Chat | HTML body | Wrong host (used `pay.*` for chat or vice versa) | Use `idp.*` for chat, `pay.*` for payments |
| Identity | Custom Login Theme broken | `displayWide` macro error → 500, sometimes 403 cascade | Set Login Theme to empty (= realm default) |

## 404 Not Found

| Service | Body | Cause | Fix |
|---|---|---|---|
| Chat | *User does not exist* | Sent OIDC `sub` UUID instead of email | Use email/username in the path |
| Chat | HTML 404 | Legacy `mercury.*` host | Switch to `idp.*` for current Cloud tenants |
| Pay | *user not found* | Wrong `userId` (email instead of OIDC sub) | Use OIDC `sub` UUID |

## 500 Internal Server Error

| Service | Symptom | Cause | Fix |
|---|---|---|---|
| Identity | Auth endpoint with `displayWide` macro error | Custom Login Theme broken | Set Login Theme on the client to empty |

## Behavioral issues (no error response)

| Symptom | Cause | Fix |
|---|---|---|
| Pay status forever PENDING | `merchantCallback` URL is relative or unreachable | Use absolute URL with explicit `APP_BASE_URL` |
| Pay status overwritten with `UNKNOWN` / `inquiring status` | Naive persistence of `/status` ack | Apply [persistence rule](../core-integrations/kobil-pay#status-persistence-rule) |
| Reservation 200 but no chat received | `void promise` killed before serverless function returned | Use `import { after } from "next/server"` for outbound work |
| Login page 500 with `displayWide` macro | Client has custom Login Theme | Set Login Theme to empty on the client |

## How to escalate

If the response doesn't match anything here:

1. Capture the **full request and response** (headers + body, redact secrets).
2. Note the **tenant**, **realm**, and **endpoint** you're hitting.
3. Send to your KOBIL Solutions Engineer with the timestamp.

The KOBIL Identity layer is Keycloak — most errors there match the [Keycloak documentation](https://www.keycloak.org/documentation), with KOBIL-specific extensions noted on each service page.
