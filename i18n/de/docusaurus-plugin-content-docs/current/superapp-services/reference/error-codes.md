---
id: error-codes
title: Fehlercodes & Troubleshooting
sidebar_label: Fehlercodes
sidebar_position: 2
description: Alle 4xx- und 5xx-KOBIL-Antworten, sortiert nach Status-Code, mit dem Fix für jede.
---

# Fehlercodes & Troubleshooting

Sortiert nach HTTP-Status-Code. Wenn dein Fehler hier nicht steht, [Issue öffnen oder Support kontaktieren](mailto:contactus@kobil.com).

## 400 Bad Request

| Service | Body | Ursache | Fix |
|---|---|---|---|
| Identity | *Invalid redirect_uri* | Redirect-URI nicht exakt registriert | Genaue URL (mit/ohne Trailing-Slash, mit Port) bei **Valid Redirect URIs** ergänzen |
| Identity | *unauthorized_client* (client_credentials) | Service Accounts nicht aktiviert | **Service accounts roles** auf dem Server-Client ON |
| Pay | `["transactionTimeout should be maximum 60"]` | `transactionTimeout > 60` | Auf 60 deckeln |
| Chat | `messageType: "plainText"` abgelehnt | Falsches Type-Literal | `processChatMessage` verwenden |

## 401 Unauthorized

| Service | Ursache | Fix |
|---|---|---|
| Beliebig | Token abgelaufen (Cache veraltet) | Token-Cache invalidieren, einmal neu versuchen |
| Chat | `serviceUuid` ≠ Token-`client_id` | `serviceUuid` auf gleiche `client_id` wie Token setzen |
| Pay-Callback | Deine Auth-Middleware fängt den Callback ab | Callback-Pfad in `proxy.ts` allowlisten |
| Token-Endpoint | Falsche `client_id` / `client_secret` oder falscher Realm | Im Credentials-Tab neu kopieren; Realm prüfen |

## 403 Forbidden

| Service | Symptom | Ursache | Fix |
|---|---|---|---|
| Chat | HTML-Body | Falscher Host (`pay.*` für Chat oder umgekehrt) | `idp.*` für Chat, `pay.*` für Pay |
| Identity | Custom Login Theme defekt | `displayWide`-Macro-Error → 500, manchmal 403 als Folge | Login Theme auf leer setzen (= Realm-Default) |

## 404 Not Found

| Service | Body | Ursache | Fix |
|---|---|---|---|
| Chat | *User does not exist* | OIDC `sub` UUID statt E-Mail gesendet | E-Mail / Username im Pfad verwenden |
| Chat | HTML 404 | Legacy `mercury.*`-Host | Auf `idp.*` umstellen für aktuelle Cloud-Tenants |
| Pay | *user not found* | Falsche `userId` (E-Mail statt OIDC-sub) | OIDC `sub` UUID nutzen |

## 500 Internal Server Error

| Service | Symptom | Ursache | Fix |
|---|---|---|---|
| Identity | Auth-Endpoint mit `displayWide`-Macro-Error | Custom Login Theme defekt | Login Theme am Client auf leer setzen |

## Verhaltens-Probleme (ohne Fehler-Response)

| Symptom | Ursache | Fix |
|---|---|---|
| Pay-Status für immer PENDING | `merchantCallback`-URL relativ oder unerreichbar | Absolute URL via `APP_BASE_URL` |
| Pay-Status mit `UNKNOWN` / `inquiring status` überschrieben | Naive Persistenz des `/status`-Acks | [Persistenz-Regel](../core-integrations/kobil-pay#status-persistenz-regel) anwenden |
| Reservation 200 aber kein Chat empfangen | `void promise` von Serverless gekillt vor Function-Return | `import { after } from "next/server"` für Outbound nutzen |
| Login-Seite 500 mit `displayWide`-Macro | Client hat Custom Login Theme | Login Theme auf leer setzen |

## Wie eskalieren

Wenn die Antwort hier nicht passt:

1. **Vollständigen Request und Response** mitschneiden (Header + Body, Secrets redaktieren).
2. **Tenant**, **Realm** und **Endpoint** notieren.
3. Mit Timestamp an deinen KOBIL Solutions Engineer schicken.

Die KOBIL-Identity-Schicht ist Keycloak — die meisten Fehler dort matchen die [Keycloak-Doku](https://www.keycloak.org/documentation), mit den KOBIL-spezifischen Erweiterungen, die auf den jeweiligen Service-Seiten beschrieben sind.
