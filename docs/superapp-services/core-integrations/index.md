---
id: core-integrations
title: Core Integrations
sidebar_label: 2. Core Integrations
sidebar_position: 3
description: The four building blocks every Super App is made of — Identity, Chat, Pay, TMS.
---

# Core Integrations

The four KOBIL services every Super App is built on.

## Decision tree — which one do you need?

```mermaid
flowchart TD
    Start{What do<br/>you need?}
    Start --> Login{Authenticate<br/>users?}
    Login -->|Yes| Identity[KOBIL Identity]
    Start --> Send{Send messages<br/>to users?}
    Send -->|Yes| Chat[KOBIL Chat]
    Start --> Money{Take signed<br/>payments?}
    Money -->|Yes| Pay[KOBIL Pay]
    Start --> Tenant{Provision<br/>new tenants?}
    Tenant -->|Yes| TMS[KOBIL TMS]
```

Most Super Apps need **Identity + Chat + Pay**. TMS is mainly used by the KOBIL operations team and by partners that resell to multiple sub-tenants.

## The four services

| Service | What it does | Auth | Host |
|---|---|---|---|
| [**KOBIL Identity**](./kobil-identity) | OIDC login with mIdentity-bound users | OIDC discovery | `idp.<tenant>.kobil.com` |
| [**KOBIL Chat**](./kobil-chat) | Server → user messaging via mPower, with reply webhook | `client_credentials` | `idp.<tenant>.kobil.com` |
| [**KOBIL Pay**](./kobil-pay) | Merchant transactions, signed by the user in mIdentity | `client_credentials` | `pay.<tenant>.kobil.com` |
| [**KOBIL TMS**](./kobil-tms) | Tenant + realm provisioning | TMS API key | (varies — ask Solutions Engineering) |

All four share the same **multi-client OIDC pattern** (one user-facing Authorization Code + PKCE client, one server-to-server `client_credentials` client). See [Get Your Credentials](../before-you-start/get-credentials) if you haven't set those up yet.
