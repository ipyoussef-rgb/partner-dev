---
id: get-credentials
title: Schritt 1 — Credentials holen
sidebar_label: 1. Credentials
sidebar_position: 2
description: Lege die zwei OIDC-Clients an, die du für die Integration in die Germany App brauchst.
---

# Schritt 1 — Credentials holen

Du legst **zwei OIDC-Clients im selben Realm** des Germany-App-Tenants an:

| Client | Auth-Flow | Wofür |
|---|---|---|
| **User-UI** | Authorization Code + PKCE (S256) | Endnutzer-Login aus Browser oder Native-App |
| **Server-zu-Server** | `client_credentials` | Dein Backend ruft Chat und Payments auf |

> **Warum zwei?** Login und Service-Calls in einem Client zu mischen ist ein Footgun: entweder du gibst ein Client-Secret an den Browser (kaputt) oder du verlierst die Möglichkeit, Server-Calls zu machen. Zwei minimale Clients sind sauberer.

## Voraussetzung

- Zugang zum **KOBIL Portal** für den Germany-App-Tenant.
- Der **Realm-Name** (z. B. `germany-app`).
- Der **IDP-Host** (z. B. `https://idp.germany-app.kobil.com`).

Falls noch nicht da, hol's dir vom Onboarding-Kontakt bevor du weitermachst.

## 1.1 — KOBIL Portal öffnen

Melde dich beim Portal an. Wähl den Realm im Dropdown oben links.

## 1.2 — User-UI-Client anlegen

1. **Clients → Create client**
2. **Client type:** OpenID Connect
3. **Client ID:** z. B. `partner-app-user`
4. **Client authentication:** AN
5. **Authentication flow:** nur **Standard flow** anhaken (Service Accounts und Direct Access Grants aus)
6. **Valid redirect URIs:** beide hinzufügen
   ```
   https://your.app/api/auth/user/callback
   http://localhost:3000/api/auth/user/callback
   ```
7. **Web origins:** `+` (nimmt die Redirect-URIs)
8. Speichern
9. **Advanced → PKCE Code Challenge Method:** `S256`
10. **Credentials-Tab:** Secret kopieren

## 1.3 — Server-zu-Server-Client anlegen

1. **Clients → Create client**
2. **Client ID:** z. B. `partner-app-server`
3. **Client authentication:** AN
4. **Authentication flow:** Standard flow aus, **Service accounts roles** an
5. Speichern
6. **Credentials-Tab:** Secret kopieren

Die `client_id` dieses Clients schickst du als `serviceUuid` (Chat) und `merchantId` (Payments).

## 1.4 — Prüfen, dass es geht

Discovery (ohne Auth):

```bash
curl https://idp.<tenant>.kobil.com/auth/realms/<realm>/.well-known/openid-configuration
```

Server-Token:

```bash
curl -X POST https://idp.<tenant>.kobil.com/auth/realms/<realm>/protocol/openid-connect/token \
  -u 'partner-app-server:<server-secret>' \
  -d 'grant_type=client_credentials'
```

Erfolgreiche Antwort:

```json
{ "access_token": "eyJ...", "expires_in": 300, "token_type": "Bearer" }
```

Cache den Token ~270 s im Backend.

## 1.5 — `.env` befüllen

```bash
KOBIL_IDP_HOST=https://idp.<tenant>.kobil.com
KOBIL_REALM=<realm>
KOBIL_USER_CLIENT_ID=partner-app-user
KOBIL_USER_CLIENT_SECRET=<einfügen>
KOBIL_SERVER_CLIENT_ID=partner-app-server
KOBIL_SERVER_CLIENT_SECRET=<einfügen>
APP_BASE_URL=http://localhost:3000
```

`.env` niemals committen. In `.gitignore`.

## Häufige Fehler

| Symptom | Ursache | Fix |
|---|---|---|
| 400 *Invalid redirect_uri* | URL nicht exakt registriert (Slash, Port, Schema) | Exakte URL als **Valid redirect URI** eintragen |
| 401 am Token-Endpoint | Falsche `client_id` / `client_secret` / Realm | Secret aus Credentials-Tab neu kopieren |
| 500 *displayWide*-Macro auf Auth | Login Theme kaputt | Login Theme auf leer (= Realm-Default) setzen |
| `client_credentials` gibt 400 *unauthorized_client* | Service Accounts nicht an | **Service accounts roles** AN |

## Weiter

Mit [Schritt 2 — Login einbauen](/login).
