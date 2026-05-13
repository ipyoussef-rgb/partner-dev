---
id: login
title: Schritt 2 — Login einbauen
sidebar_label: 2. Login
sidebar_position: 3
description: Verbinde dein App-Login mit dem Germany-App-IDP. Der User authentifiziert sich biometrisch in der mIdentity-App.
keywords: [login, oidc, identity, keycloak, mIdentity]
---

# Schritt 2 — Login einbauen

> **Standard-OIDC gegen den Germany-App-IDP, mit biometrischer Bestätigung auf dem Gerät des Users.** Jede andere Integration baut darauf auf.

## Wie es fließt

```mermaid
sequenceDiagram
    autonumber
    participant U as User-Browser
    participant A as Deine App
    participant IDP as Germany App IDP
    participant M as mIdentity-App
    U->>A: "Login" klicken
    A->>IDP: Redirect /auth?client_id&PKCE
    IDP->>U: Login-Maske
    U->>IDP: Username
    IDP->>M: Push-Challenge
    M->>U: Biometrie-Prompt
    U->>M: Bestätigen
    M->>IDP: Signierte Assertion
    IDP->>A: Redirect mit Auth-Code
    A->>IDP: POST /token
    IDP->>A: id_token + access_token
    A->>U: Session setzen, eingeloggt
```

## 2.1 — Die Endpoints

```
{idp_host}/auth/realms/{realm}/.well-known/openid-configuration
{idp_host}/auth/realms/{realm}/protocol/openid-connect/auth
{idp_host}/auth/realms/{realm}/protocol/openid-connect/token
{idp_host}/auth/realms/{realm}/protocol/openid-connect/userinfo
{idp_host}/auth/realms/{realm}/protocol/openid-connect/logout
```

`{idp_host}` kommt aus [Schritt 1](/get-credentials).

## 2.2 — Im Code

Jeder Standard-OIDC-Client funktioniert. Mit `openid-client` in Node:

```ts
import { Issuer } from "openid-client";

const issuer = await Issuer.discover(
  `${process.env.KOBIL_IDP_HOST}/auth/realms/${process.env.KOBIL_REALM}`
);
const client = new issuer.Client({
  client_id: process.env.KOBIL_USER_CLIENT_ID,
  client_secret: process.env.KOBIL_USER_CLIENT_SECRET,
  redirect_uris: [`${process.env.APP_BASE_URL}/api/auth/user/callback`],
  response_types: ["code"],
  token_endpoint_auth_method: "client_secret_post",
});
```

Beim Redirect: PKCE-Authorize, Callback tauscht den Code gegen Tokens, Session-Cookie setzen.

## 2.3 — `sub` UND `email` speichern

Derselbe User hat **unterschiedliche Identifier pro Service**:

| Verwendet in | Identifier |
|---|---|
| Deine DB (kanonischer Key) | OIDC `sub` UUID |
| Chat-Pfad `/users/{userId}/message` | **E-Mail / Username** |
| Payments-Body `userId` | **OIDC `sub` UUID** |

**Beide beim Login speichern.** Das ist die Nr.-1-Ursache für *"User does not exist"*-404er weiter unten.

```ts
await db.users.upsert({
  where: { sub: claims.sub },
  create: { sub: claims.sub, email: claims.email, ... },
  update: { email: claims.email },
});
```

## 2.4 — Claims kommen flach ODER verschachtelt

Manche Attribute (Telefon, Adresse, Geburtsdatum) kommen als Top-Level-Keys oder verschachtelt unter `attributes.{key}[0]`. Defensiver Reader:

```ts
function read(raw: Record<string, unknown>, ...names: string[]): string | undefined {
  const attrs = (raw.attributes ?? {}) as Record<string, unknown>;
  for (const name of names) {
    for (const v of [raw[name], attrs[name]]) {
      if (typeof v === "string" && v.length > 0) return v;
      if (Array.isArray(v) && typeof v[0] === "string" && v[0].length > 0) return v[0];
    }
  }
  return undefined;
}

const phone     = read(claims, "phone", "phone_number");
const birthdate = read(claims, "bod", "birthdate");
const street    = read(claims, "street", "street_address");
```

## 2.5 — Verifizieren

1. App starten, **Login** klicken.
2. Test-Username eingeben.
3. Biometrie-Prompt in der mIdentity-App des Test-Users bestätigen.
4. Du landest mit Session zurück in der App.
5. Logs prüfen: `sub` UND `email` gespeichert.

## Häufige Fehler

| Symptom | Ursache | Fix |
|---|---|---|
| 400 *Invalid redirect_uri* | URL nicht exakt registriert | Exakte URL eintragen (Port, Schema, Slash) |
| 500 *displayWide*-Macro | Login Theme kaputt | Theme auf leer setzen |
| 401 am Token-Endpoint | Falsches Secret oder Realm | Secret neu kopieren |
| Userinfo ohne Custom-Claims | Mapper nicht gesetzt | Client Scopes → Mappers ergänzen |

## Weiter

- [Schritt 3 — Chat einbauen](/chat)
- [Schritt 4 — Payments einbauen](/payments)
