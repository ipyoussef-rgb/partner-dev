---
id: go-live
title: Schritt 5 — Go Live
sidebar_label: 5. Go Live
sidebar_position: 6
description: Produktions-Checkliste für deine Germany-App-Integration.
---

# Schritt 5 — Go Live

Geh das durch, bevor du Produktions-Traffic anschaltest. Jeder Punkt hat in mindestens einem echten Launch wehgetan.

## Identity / Login

- [ ] **Produktive Redirect-URIs** am User-UI-Client registriert.
- [ ] **Localhost- / Preview-URIs** aus dem Produktiv-Client entfernt. Separater Dev-Client.
- [ ] **PKCE-Methode = S256** auf allen User-Clients.
- [ ] **Login Theme** in echtem Browser geprüft — kein `displayWide`-Macro-Fehler.
- [ ] Backend-**Token-Cache** mit TTL ≤ 270 s.
- [ ] **401-Retry-Pfad** invalidiert Cache, einmaliger Retry, dann hochreichen.
- [ ] **Beide `sub` UND `email`** beim Login persistiert.

## Chat

- [ ] Server-Client hat **Service Accounts Enabled = AN**.
- [ ] Webhook-URL ist **öffentlich, ohne Auth-Header**.
- [ ] Webhook-Pfad in `proxy.ts` / Auth-Middleware **whitelisted**.
- [ ] Empfänger im Pfad ist **E-Mail**, nicht OIDC-`sub`.
- [ ] `serviceUuid` im Body **= Token-`client_id`**.
- [ ] `messageType` benutzt **`processChatMessage`**, nicht `plainText`.
- [ ] Outbound-Calls laufen in **`after()`** (oder Äquivalent), damit Serverless-Functions sie nicht abwürgen.

## Payments

- [ ] `userId` im Body ist die **OIDC-`sub` UUID**.
- [ ] `merchantId` und `merchantServiceUUID` beide = **server `client_id`**.
- [ ] `transactionTimeout ≤ 60`.
- [ ] `merchantCallback` ist **absolute URL** aus `APP_BASE_URL`, nicht relativ.
- [ ] `merchantCallback`-Pfad **whitelisted**, **ohne Auth**.
- [ ] Persistenz **überschreibt nie einen finalen Status** (`finished`, `cancelled`, `closed`, `timeout`, `error`, `void`, `refund`).
- [ ] `idempotencyId` pro Versuch eindeutig.
- [ ] `amount` in **kleinster Währungseinheit** (Cents).

## Hosting (Vercel-spezifisch)

- [ ] `export const maxDuration = 60` auf jeder Route, die Chat oder Payments aufruft.
- [ ] `APP_BASE_URL` env var = die kanonische Prod-URL (nicht Preview-Deployment).
- [ ] DB-Connection-Pooling für Serverless konfiguriert.
- [ ] Kein Keep-Alive-Ping alle paar Minuten — Serverless-DB-Tiers messen Compute-Stunden.

## Observability

- [ ] Logs enthalten `transactionId` / `messageId` für Korrelation.
- [ ] 401-Retries geloggt, nicht alarmiert.
- [ ] Payment-Callback-Failures (Non-2xx von dir) triggern Alarm.
- [ ] Webhook- / Callback-Handler sind **idempotent** — die Plattform retried bei Fehler.

## Sicherheit

- [ ] Client-Secrets nie im Repo committed.
- [ ] `.env` und `.env.local` in `.gitignore`.
- [ ] Callback-Pfade bypassen Auth, **validieren aber das Payload-Schema** vor dem Persistieren.
- [ ] HTTPS überall; HTTP-Redirect-URIs nur auf `localhost`.
- [ ] Outbound zu Chat / Payments rate-limited, damit eine Endlosschleife keine Quotas verbrennt.

## Pre-Launch-Smoketest

End-to-end auf Produktion mit echtem Test-User:

1. Login via OIDC funktioniert.
2. Outbound-Chat-Message kommt auf mIdentity-Gerät an.
3. User-Antwort kommt am Webhook an.
4. Payment-Create gibt `200` mit `status: "new"`.
5. User bestätigt in mIdentity; merchantCallback kommt in ≤ 60 s.
6. Finaler Status persistiert als `SUCCESS` und wird **nicht überschrieben** von einem späteren `/status`-Poll.

Alle sechs OK → produktionsreif.

---

*Zuletzt verifiziert: 08.05.2026.*
