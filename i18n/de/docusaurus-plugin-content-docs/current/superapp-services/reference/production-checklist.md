---
id: production-checklist
title: Production-Checkliste
sidebar_label: Production-Checkliste
sidebar_position: 3
description: Was vor Umstellung einer KOBIL-Integration auf Produktiv-Traffic verifiziert sein muss.
---

# Production-Checkliste

Vor dem Go-Live durchgehen. Die Liste ist nach Bereich gruppiert; jeder Punkt ist etwas, das wir in mindestens einem Produktiv-Launch beißen gesehen haben.

## Identity / OIDC

- [ ] **Produktions-Redirect-URIs** im User-UI-Client registriert.
- [ ] **Localhost / Preview-Redirect-URIs** aus dem Produktions-Client entfernt (separate Clients für Dev und Prod ist sauberer).
- [ ] **PKCE-Methode = S256** auf allen User-facing-Clients.
- [ ] **Login Theme** im echten Browser geprüft — keine `displayWide`-Macro-Errors.
- [ ] **Token-Cache** im Backend mit TTL ≤ 270 s.
- [ ] **401-Retry-Pfad** invalidiert Cache, versucht einmal neu, dann bubbelt der Fehler hoch.
- [ ] **Sowohl `sub` als auch `email`** bei Login persistiert.

## Chat / mPower

- [ ] Chat-App-OIDC-Client hat **Service Accounts Enabled = ON**.
- [ ] Webhook-URL **öffentlich erreichbar, kein Auth-Header**.
- [ ] Webhook-Pfad **in `proxy.ts` / Auth-Middleware allowlistet**.
- [ ] Empfänger-Kennung im Pfad ist **E-Mail**, nicht OIDC `sub` UUID.
- [ ] `serviceUuid` im Body **= `client_id` des Tokens**.
- [ ] `messageType` nutzt **`processChatMessage`**, nicht `plainText`.
- [ ] Outbound-Calls innerhalb von **`after()`** (oder Äquivalent), damit Serverless-Functions sie nicht abreißen.

## Pay / mPay

- [ ] `userId` im Request-Body ist die **OIDC `sub` UUID**.
- [ ] `merchantId` und `merchantServiceUUID` beide = **Pay-`client_id`**.
- [ ] `transactionTimeout ≤ 60`.
- [ ] `merchantCallback` ist **absolute URL** aus `APP_BASE_URL` gebaut, kein relativer Pfad.
- [ ] `merchantCallback`-Pfad **in `proxy.ts` allowlistet** und **ohne Auth-Header**.
- [ ] Persistenz-Schicht **überschreibt nie einen finalen Status** mit Nicht-Final (die sieben finalen Status: `finished`, `cancelled`, `closed`, `timeout`, `error`, `void`, `refund`).
- [ ] `idempotencyId` pro Versuch eindeutig.
- [ ] `amount` in **kleinster Währungseinheit** (Cent).

## Hosting-Plattform (Vercel-spezifisch)

- [ ] `export const maxDuration = 60` auf jeder Route, die mPower oder mPay aufruft.
- [ ] `APP_BASE_URL`-Env-Var auf kanonische Produktions-URL gesetzt (keine Preview).
- [ ] Datenbank- (Neon / Postgres) Connection-Pooling für Serverless konfiguriert.
- [ ] Kein externer Keep-Alive-Ping alle paar Minuten — Neon-Free-Tier-Compute-Stunden sind begrenzt.
- [ ] Vercel-Cron nur für Cleanup, nicht als Heartbeat.

## Observability

- [ ] Logs enthalten `transactionId` / `messageId` für Korrelation.
- [ ] 401-Retries werden geloggt, aber nicht alarmiert.
- [ ] Pay-Callback-Failures (Non-2xx-Antwort von deinem Endpoint) lösen Alarm aus.
- [ ] Webhook-Failures werden auf KOBIL-Seite mit Backoff retried — Handler **idempotent** machen.

## Security

- [ ] Client-Secrets niemals im Repo committed.
- [ ] `.env` und `.env.local` in `.gitignore`.
- [ ] Webhook- / Callback-Pfade umgehen Auth, validieren aber Payload-Form vor dem Persistieren.
- [ ] HTTPS überall erzwungen; HTTP-Redirect-URIs nur auf `localhost`.
- [ ] Eigenes Outbound zu mPower / mPay rate-limiten, damit eine Schleife keine Quotas verbrennt.

## Pre-Launch-Smoketest

End-to-End auf der Produktionsumgebung mit echtem Test-Nutzer:

1. OIDC-Login klappt.
2. Outbound-Chat-Nachricht kommt am mIdentity-Gerät an.
3. Nutzer-Antwort kommt am Webhook an.
4. Payment-Create liefert `200` mit `status: "new"`.
5. Nutzer bestätigt in mIdentity; merchantCallback kommt innerhalb 60 s an.
6. Finaler Status wird als `SUCCESS` (oder anderer Final-Wert) persistiert und **nicht** durch nachfolgenden `/status`-Poll überschrieben.

Wenn alle sechs durchgehen, bist du produktionsreif.

---

*Zuletzt verifiziert: 2026-05-08.*
