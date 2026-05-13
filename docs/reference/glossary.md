---
id: glossary
title: Glossary
sidebar_label: Glossary
sidebar_position: 2
description: KOBIL and Germany App terms that confuse newcomers.
---

# Glossary

| Term | What it is | When you need it |
|---|---|---|
| **Germany App** | The trusted superapp where citizens access services via verified mobile identity. | The product this guide is for. |
| **KOBIL Superapp Platform** | The runtime platform that powers the Germany App and other superapps. | Background context. |
| **mIdentity** | Mobile SDK + companion app on the user's device. Provides the biometric second factor. | Every user-facing flow. |
| **mPower** | Server-side messaging API (Chat). | When you send chat messages. |
| **mPay** | Merchant-side payments API. | When you process payments. |
| **Realm** | The Keycloak realm for your tenant. | OIDC setup, all server calls. |
| **OIDC `sub`** | Stable user UUID from the ID token. | Your DB key, Payments `userId`. |
| **Recipient ID** | Identifier used by a downstream service. **Different per service.** | Chat uses email; Payments uses `sub`. |
| **Server client** | The OIDC client with `client_credentials` enabled. | All backend-to-platform calls. |
| **User client** | The OIDC client with Authorization Code + PKCE. | The end-user login flow. |
| **merchantCallback** | URL the Payments platform POSTs the final transaction status to. | Source of truth for payments. |
| **Final status** | One of `finished`, `cancelled`, `closed`, `timeout`, `error`, `void`, `refund`. | Never overwrite once persisted. |
