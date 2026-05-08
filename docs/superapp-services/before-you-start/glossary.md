---
id: glossary
title: Glossary
sidebar_label: Glossary
sidebar_position: 3
description: KOBIL product names disambiguated — mIdentity, mPower, mPay, mChat, SSP, realm, recipient ID.
---

# Glossary

KOBIL has several names that look interchangeable but aren't. Bookmark this page.

| Term | What it is | When you encounter it |
|---|---|---|
| **mIdentity** | Mobile SDK + companion app for device activation, biometric login, transaction signing | Every user login; every payment confirmation |
| **mPower** | Server-side API bundle (chat, notifications, push) hosted on the IDP host | When you call `/auth/realms/{realm}/mpower/v1/...` |
| **mPay** | Merchant API for payments and transaction signing, hosted on `pay.<tenant>.kobil.com` | When you call `/mpay-merchant/create/transaction*` |
| **mChat** | UI / front-end layer on top of mPower (only relevant if you use KOBIL's chat UI) | If you embed the KOBIL chat widget rather than calling mPower directly |
| **SSP** | Smart Security Platform — the marketing umbrella for the KOBIL stack | In sales decks and brochures |
| **TMS** | Tenant Management System — the KOBIL admin layer that provisions realms, clients, themes | When you set up a new tenant or rotate credentials |
| **KOBIL Portal** | Web admin UI (a Keycloak admin console with KOBIL extensions) | When you create OIDC clients, register webhooks, brand the login theme |
| **Realm** | A Keycloak realm, one per tenant — your isolated identity space | Every OIDC URL: `/auth/realms/{realm}/...` |
| **Tenant** | A KOBIL customer / project. Maps 1:1 to a realm in most setups | The `<tenant>` segment in `idp.<tenant>.kobil.com` |
| **Recipient ID** | The user identifier you send to a downstream service. **Different per service.** | Chat: email. Pay: OIDC `sub` UUID. Always check the service docs. |
| **Service UUID** | Equals the `client_id` of the OIDC client used for the service | mPower request body, mPay merchant fields |

## Recipient ID — the rule that bites everyone

Same user, different identifier per service:

| Service | Identifier you send |
|---|---|
| Internal user record (your DB) | OIDC `sub` UUID |
| **mPower chat** path `/users/{userId}/message` | **Email / username** |
| **mPay** body `userId` | **OIDC `sub` UUID** |

**Store both `sub` and `email` at login time.** If you only persist one, you'll be missing the other when the next service needs it.

:::warning Common 404
*"User does not exist"* from mPower means you sent the OIDC `sub` UUID where the email was expected. Switch to email.
:::

## Hosts you'll see

| Host pattern | What lives there |
|---|---|
| `idp.<tenant>.kobil.com` | OIDC endpoints + mPower (chat) |
| `pay.<tenant>.kobil.com` | mPay merchant API |
| `idp.cloud.kobil.com` | Central cloud IDP (used by some tenants instead of a per-tenant host) |
| `mercury.<tenant>.kobil.com` | **Legacy** chat host. Newer tenants serve mPower from `idp.*`. If you get 404/HTML on `mercury.*`, switch to `idp.*`. |

## Next

[Prerequisites & Test Tenant](./prerequisites) — what to ask your KOBIL contact for.
