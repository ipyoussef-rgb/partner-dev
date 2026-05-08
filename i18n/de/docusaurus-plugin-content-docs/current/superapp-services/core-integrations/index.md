---
id: core-integrations
title: Core Integrations
sidebar_label: 2. Core Integrations
sidebar_position: 3
description: Die vier Bausteine, aus denen jede Super App besteht — Identity, Chat, Pay, TMS.
---

# Core Integrations

Die vier KOBIL-Services, auf denen jede Super App aufbaut.

## Entscheidungsbaum — was brauchst du?

```mermaid
flowchart TD
    Start{Was brauchst<br/>du?}
    Start --> Login{Nutzer<br/>authentifizieren?}
    Login -->|Ja| Identity[KOBIL Identity]
    Start --> Send{Nachrichten an<br/>Nutzer schicken?}
    Send -->|Ja| Chat[KOBIL Chat]
    Start --> Money{Signierte<br/>Zahlungen?}
    Money -->|Ja| Pay[KOBIL Pay]
    Start --> Tenant{Neue Tenants<br/>provisionieren?}
    Tenant -->|Ja| TMS[KOBIL TMS]
```

Die meisten Super Apps brauchen **Identity + Chat + Pay**. TMS wird hauptsächlich vom KOBIL-Operations-Team und von Partnern genutzt, die an mehrere Sub-Tenants weiterverkaufen.

## Die vier Services

| Service | Wofür | Auth | Host |
|---|---|---|---|
| [**KOBIL Identity**](./kobil-identity) | OIDC-Login mit mIdentity-gebundenen Nutzern | OIDC-Discovery | `idp.<tenant>.kobil.com` |
| [**KOBIL Chat**](./kobil-chat) | Server → Nutzer-Messaging via mPower, mit Reply-Webhook | `client_credentials` | `idp.<tenant>.kobil.com` |
| [**KOBIL Pay**](./kobil-pay) | Merchant-Transaktionen, vom Nutzer in mIdentity signiert | `client_credentials` | `pay.<tenant>.kobil.com` |
| [**KOBIL TMS**](./kobil-tms) | Tenant- + Realm-Provisionierung | TMS-API-Key | (variiert — Solutions Engineering fragen) |

Alle vier teilen sich das **Multi-Client-OIDC-Pattern** (ein User-facing Authorization Code + PKCE-Client, ein Server-zu-Server `client_credentials`-Client). Siehe [Credentials anlegen](../before-you-start/get-credentials), falls noch nicht geschehen.
