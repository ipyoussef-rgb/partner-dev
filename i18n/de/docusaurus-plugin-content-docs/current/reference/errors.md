---
id: errors
title: Fehlercodes & Troubleshooting
sidebar_label: Fehlercodes
sidebar_position: 1
description: Jeder 4xx und 5xx, den du bei der Germany-App-Integration triffst — mit Fix.
---

# Fehlercodes & Troubleshooting

Sortiert nach HTTP-Status. Steht dein Fehler nicht hier, melde dich bei deinem Solutions-Engineering-Kontakt.

## 400 Bad Request

| Bereich | Body | Ursache | Fix |
|---|---|---|---|
| Login | *Invalid redirect_uri* | URI nicht exakt registriert | Exakte URL als **Valid Redirect URI** eintragen |
| Login | *unauthorized_client* (client_credentials) | Service Accounts nicht an | **Service accounts roles** AN am Server-Client |
| Payments | `["transactionTimeout should be maximum 60"]` | `transactionTimeout > 60` | Auf 60 deckeln |
| Chat | `messageType: "plainText"` abgelehnt | Falsches Literal | `processChatMessage` |

## 401 Unauthorized

| Bereich | Ursache | Fix |
|---|---|---|
| Beliebig | Token abgelaufen (Cache veraltet) | Cache invalidieren, einmal retry |
| Chat | `serviceUuid` ≠ Token-`client_id` | Gleichsetzen |
| Payment-Callback | Deine Auth-Middleware fängt ihn ab | Callback-Pfad whitelisten |
| Token-Endpoint | Falsche `client_id`/`secret` oder Realm | Secret neu kopieren |

## 403 Forbidden

| Bereich | Symptom | Ursache | Fix |
|---|---|---|---|
| Chat | HTML-Body | Falscher Host (`pay.*` statt `idp.*`) | `idp.*` für Chat |
| Login | Login Theme kaputt | `displayWide`-Macro-Cascade | Theme auf leer setzen |

## 404 Not Found

| Bereich | Body | Ursache | Fix |
|---|---|---|---|
| Chat | *User does not exist* | OIDC-`sub` statt E-Mail | E-Mail / Username im Pfad |
| Chat | HTML 404 | Legacy `mercury.*`-Host | Auf `idp.*` umstellen |
| Payments | *user not found* | Falsche `userId` (E-Mail statt sub) | OIDC-`sub` UUID benutzen |

## 500 Internal Server Error

| Bereich | Symptom | Ursache | Fix |
|---|---|---|---|
| Login | Auth-Endpoint mit `displayWide`-Macro | Login Theme kaputt | Theme auf leer setzen |

## Verhaltensprobleme (kein Fehler-Response)

| Symptom | Ursache | Fix |
|---|---|---|
| Payment-Status ewig PENDING | `merchantCallback` relativ oder unerreichbar | Absolute URL mit `APP_BASE_URL` |
| Payment-Status auf `UNKNOWN` / `inquiring status` überschrieben | Naives Persistieren des `/status`-Acks | [Persistenz-Regel](/payments#46--finalen-status-niemals-überschreiben) anwenden |
| Aktion liefert 200, aber kein Chat angekommen | `void promise` abgewürgt, als Serverless-Function zurückkam | `import { after } from "next/server"` für Outbound |
| Login-Seite 500 mit `displayWide`-Macro | Client hat Custom Login Theme | Theme auf leer setzen |
