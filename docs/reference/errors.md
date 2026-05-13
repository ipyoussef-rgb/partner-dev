---
id: errors
title: Error Codes & Troubleshooting
sidebar_label: Error codes
sidebar_position: 1
description: Every 4xx and 5xx you'll hit while integrating with the Germany App, with the fix for each.
---

# Error Codes & Troubleshooting

Sorted by HTTP status code. If you don't see your error here, contact your Solutions Engineering contact.

## 400 Bad Request

| Area | Body | Cause | Fix |
|---|---|---|---|
| Login | *Invalid redirect_uri* | Redirect URI not registered exactly | Add the exact URL to **Valid Redirect URIs** |
| Login | *unauthorized_client* (client_credentials) | Service Accounts not enabled | Toggle **Service accounts roles** ON on the server client |
| Payments | `["transactionTimeout should be maximum 60"]` | `transactionTimeout > 60` | Cap at 60 |
| Chat | `messageType: "plainText"` rejected | Wrong type literal | Use `processChatMessage` |

## 401 Unauthorized

| Area | Cause | Fix |
|---|---|---|
| Any | Token expired (cache stale) | Invalidate cache, retry once |
| Chat | `serviceUuid` ≠ token `client_id` | Set `serviceUuid` to the same `client_id` |
| Payment callback | Your auth middleware intercepting | Whitelist callback path |
| Token endpoint | Wrong `client_id`/`client_secret` or wrong realm | Re-copy from Credentials tab |

## 403 Forbidden

| Area | Symptom | Cause | Fix |
|---|---|---|---|
| Chat | HTML body | Wrong host (used `pay.*` instead of `idp.*`) | Use `idp.*` for Chat |
| Login | Custom Login Theme broken | `displayWide` macro error cascade | Set Login Theme to empty |

## 404 Not Found

| Area | Body | Cause | Fix |
|---|---|---|---|
| Chat | *User does not exist* | Sent OIDC `sub` UUID instead of email | Use email/username in the path |
| Chat | HTML 404 | Legacy `mercury.*` host | Switch to `idp.*` |
| Payments | *user not found* | Wrong `userId` (email instead of OIDC sub) | Use OIDC `sub` UUID |

## 500 Internal Server Error

| Area | Symptom | Cause | Fix |
|---|---|---|---|
| Login | Auth endpoint with `displayWide` macro error | Custom Login Theme broken | Set Login Theme on the client to empty |

## Behavioral issues (no error response)

| Symptom | Cause | Fix |
|---|---|---|
| Payment status forever PENDING | `merchantCallback` URL is relative or unreachable | Absolute URL with explicit `APP_BASE_URL` |
| Payment status overwritten with `UNKNOWN` / `inquiring status` | Naive persistence of `/status` ack | See the [persistence rule](/payments#46--never-overwrite-a-final-status) |
| Action returns 200 but no chat received | `void promise` killed when serverless function returned | Use `import { after } from "next/server"` for outbound work |
| Login page 500 with `displayWide` macro | Client has custom Login Theme | Set Login Theme to empty on the client |
