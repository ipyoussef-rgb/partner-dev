---
id: get-credentials
title: Credentials anlegen
sidebar_label: Credentials anlegen
sidebar_position: 5
description: Die zwei OIDC-Clients aufsetzen, die du für eine typische Super-App-Integration brauchst — User-facing (PKCE) und Server-zu-Server (client_credentials).
---

# Credentials anlegen

Eine typische KOBIL-Integration nutzt **zwei OIDC-Clients im selben Realm**:

| Client | Auth-Flow | Wozu |
|---|---|---|
| **User UI** | Authorization Code + PKCE (S256) | End-User-Login aus Browser oder Native App |
| **Server-zu-Server** | `client_credentials` | Backend-Calls zu mPower (Chat) und mPay |

Größere Setups ergänzen einen **separaten Admin-UI-Client** mit eigener Redirect-URI für Sachbearbeiter. Pattern bleibt gleich.

## Warum zwei Clients

User-Logins und Service-Calls in einem Client zu mischen ist ein Footgun: entweder du gibst ein Client-Secret an den Browser raus (kaputt), oder du verlierst die Möglichkeit zu Server-zu-Server-Aufrufen (mPower und mPay verlangen `client_credentials`). Trennung kostet nichts und hält jeden Client minimal.

## Schritt 1 — KOBIL Portal öffnen

Melde dich im KOBIL Portal an (URL bekommst du von deinem Kontakt). Sieht aus wie eine Keycloak-Admin-Console mit KOBIL-Erweiterungen. Wähle deinen Realm im Dropdown oben links.

## Schritt 2 — User-UI-Client anlegen

1. **Clients → Create client**.
2. **Client type:** OpenID Connect.
3. **Client ID:** z. B. `your-app-user`.
4. Next.
5. **Client authentication:** ON.
6. **Authentication flow:** **Standard flow** (Authorization Code) anhaken. Service Accounts und Direct Access Grants ausschalten.
7. Next.
8. **Valid redirect URIs:** **alle** eintragen:
   ```
   https://your.app/api/auth/user/callback
   http://localhost:3000/api/auth/user/callback
   ```
9. **Web origins:** `+` (übernimmt die Redirect-URIs).
10. Save.
11. **Advanced → Proof Key for Code Exchange (PKCE) Code Challenge Method:** `S256`.
12. **Credentials-Tab:** Client-Secret kopieren.

## Schritt 3 — Server-zu-Server-Client anlegen

1. **Clients → Create client**.
2. **Client ID:** z. B. `your-app-server`.
3. Next.
4. **Client authentication:** ON.
5. **Authentication flow:** Standard flow ausschalten. **Service accounts roles** anhaken.
6. Save.
7. **Credentials-Tab:** Client-Secret kopieren.

Die `client_id` dieses Clients ist das, was du als `serviceUuid` (Chat) und `merchantId` / `merchantServiceUUID` (Pay) sendest.

## Schritt 4 — Beide Clients verifizieren

Discovery-Dokument (ohne Auth):

```bash
curl https://idp.<tenant>.kobil.com/auth/realms/<realm>/.well-known/openid-configuration
```

User-UI-Authorize-URL (im Browser einfügen; KOBIL-Login-Screen erwartet):

```
https://idp.<tenant>.kobil.com/auth/realms/<realm>/protocol/openid-connect/auth
  ?client_id=your-app-user
  &redirect_uri=http://localhost:3000/api/auth/user/callback
  &response_type=code
  &scope=openid+profile+email
  &code_challenge=<random>
  &code_challenge_method=S256
```

Server-zu-Server-Token:

```bash
curl -X POST https://idp.<tenant>.kobil.com/auth/realms/<realm>/protocol/openid-connect/token \
  -u 'your-app-server:<server-client-secret>' \
  -d 'grant_type=client_credentials'
```

Erfolgreich = JSON `{ "access_token": "...", "expires_in": 300, ... }`. Ca. 270 s cachen.

## Häufige Fehler in dieser Phase

| Symptom | Ursache | Fix |
|---|---|---|
| 400 *Invalid redirect_uri* | URL nicht exakt registriert (Slash, Port, Schema) | Genaue URL bei **Valid redirect URIs** ergänzen |
| 401 am Token-Endpoint | Falsche `client_id`/`client_secret` oder falscher Realm | Im Credentials-Tab prüfen; Secret neu kopieren |
| 500 am Auth-Endpoint mit `displayWide`-Macro-Error | Custom Login Theme defekt | Login Theme auf leer setzen (= Realm-Default) |
| `client_credentials` → 400 *unauthorized_client* | Service Accounts nicht aktiviert | **Service accounts roles** ON, speichern |

:::tip Werte jetzt sichern
Lege beide `client_id`/`client_secret`-Paare und `idp_host`/`realm` in deine lokale `.env`. Niemals committen. Du brauchst sie im [Quickstart](../quickstart).
:::

## Weiter

Du hast jetzt alles für den Code-Start. Weiter mit dem [Quickstart](../quickstart).
