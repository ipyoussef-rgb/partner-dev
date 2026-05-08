---
id: glossary
title: Glossar
sidebar_label: Glossar
sidebar_position: 3
description: KOBIL-Produktnamen sauber getrennt — mIdentity, mPower, mPay, mChat, SSP, Realm, Recipient-ID.
---

# Glossar

KOBIL hat mehrere Begriffe, die austauschbar wirken — sind sie aber nicht. Diese Seite ist zum Bookmarken.

| Begriff | Was es ist | Wann du ihm begegnest |
|---|---|---|
| **mIdentity** | Mobile-SDK + Companion-App für Geräteaktivierung, biometrischen Login, Transaktions-Signing | Bei jedem User-Login; bei jeder Zahlungs-Bestätigung |
| **mPower** | Server-seitiges API-Bundle (Chat, Notifications, Push) auf dem IDP-Host | Wenn du `/auth/realms/{realm}/mpower/v1/...` aufrufst |
| **mPay** | Merchant-API für Zahlungen und Transaktions-Signing, gehostet auf `pay.<tenant>.kobil.com` | Wenn du `/mpay-merchant/create/transaction*` aufrufst |
| **mChat** | UI-/Frontend-Schicht auf mPower (nur relevant, wenn du KOBILs Chat-UI nutzt) | Wenn du das KOBIL-Chat-Widget einbettest statt mPower direkt aufzurufen |
| **SSP** | Smart Security Platform — der Marketing-Schirm über dem KOBIL-Stack | In Sales-Decks und Broschüren |
| **TMS** | Tenant-Management-System — die KOBIL-Adminschicht für Realms, Clients, Themes | Wenn du einen neuen Tenant aufsetzt oder Credentials rotierst |
| **KOBIL Portal** | Web-Admin-UI (eine Keycloak-Admin-Console mit KOBIL-Erweiterungen) | Wenn du OIDC-Clients anlegst, Webhooks registrierst, das Login-Theme brandest |
| **Realm** | Ein Keycloak-Realm, einer pro Tenant — dein isolierter Identity-Space | In jeder OIDC-URL: `/auth/realms/{realm}/...` |
| **Tenant** | Ein KOBIL-Kunde / -Projekt. In den meisten Setups 1:1 auf einen Realm gemappt | Das `<tenant>` in `idp.<tenant>.kobil.com` |
| **Recipient-ID / Empfänger-Kennung** | Die Nutzer-ID, die du an einen Downstream-Service schickst. **Pro Service unterschiedlich.** | Chat: E-Mail. Pay: OIDC `sub` UUID. Immer in der Service-Doku nachsehen. |
| **Service-UUID** | Entspricht der `client_id` des OIDC-Clients, der für den Service genutzt wird | mPower-Request-Body, mPay-Merchant-Felder |

## Recipient-ID — die Regel, die alle einmal trifft

Gleicher Nutzer, andere Kennung pro Service:

| Service | Kennung, die du sendest |
|---|---|
| Interner User-Datensatz (deine DB) | OIDC `sub` UUID |
| **mPower Chat** Pfad `/users/{userId}/message` | **E-Mail / Username** |
| **mPay** Body `userId` | **OIDC `sub` UUID** |

**Speichere bei Login sowohl `sub` als auch `email`.** Wer nur eines ablegt, hat beim nächsten Service das falsche.

:::warning Häufiger 404
*"User does not exist"* von mPower bedeutet: du hast die OIDC `sub` UUID dort gesendet, wo die E-Mail erwartet wird. Auf E-Mail wechseln.
:::

## Hosts, denen du begegnest

| Host-Pattern | Was dort liegt |
|---|---|
| `idp.<tenant>.kobil.com` | OIDC-Endpoints + mPower (Chat) |
| `pay.<tenant>.kobil.com` | mPay-Merchant-API |
| `idp.cloud.kobil.com` | Zentraler Cloud-IDP (manche Tenants statt eigenem Host) |
| `mercury.<tenant>.kobil.com` | **Legacy**-Chat-Host. Neuere Tenants liefern mPower über `idp.*` aus. Bei 404/HTML auf `mercury.*` → auf `idp.*` umschalten. |

## Weiter

[Voraussetzungen & Test-Tenant](./prerequisites) — was du bei deinem KOBIL-Kontakt anfragst.
