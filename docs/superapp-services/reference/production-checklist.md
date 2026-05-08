---
id: production-checklist
title: Production Checklist
sidebar_label: Production Checklist
sidebar_position: 3
description: What to verify before flipping a KOBIL integration to production traffic.
---

# Production Checklist

Run through this before go-live. The list below is grouped by area; each item is something we've seen bite at least one production launch.

## Identity / OIDC

- [ ] **Production redirect URIs** registered in the user-UI client.
- [ ] **Localhost / preview redirect URIs** removed from the production client (separate clients for dev and prod is cleaner).
- [ ] **PKCE method = S256** on all user-facing clients.
- [ ] **Login Theme** verified on a real browser — no `displayWide` macro errors.
- [ ] **Token cache** in your backend with TTL ≤ 270 s.
- [ ] **401 retry path** invalidates cache and retries once, then bubbles up.
- [ ] **Both `sub` and `email`** persisted at login time.

## Chat / mPower

- [ ] Chat-app OIDC client has **Service Accounts Enabled = ON**.
- [ ] Webhook URL is **publicly reachable, no auth header**.
- [ ] Webhook path is **whitelisted in `proxy.ts`** / auth middleware.
- [ ] Recipient identifier in the path is **email**, not OIDC `sub` UUID.
- [ ] `serviceUuid` in the body **equals the token's `client_id`**.
- [ ] `messageType` uses **`processChatMessage`**, not `plainText`.
- [ ] Outbound calls happen inside **`after()`** (or equivalent) so serverless functions don't kill them.

## Pay / mPay

- [ ] `userId` in the request body is the **OIDC `sub` UUID**.
- [ ] `merchantId` and `merchantServiceUUID` both equal the **Pay client_id**.
- [ ] `transactionTimeout ≤ 60`.
- [ ] `merchantCallback` is an **absolute URL** built from `APP_BASE_URL`, not a relative path.
- [ ] `merchantCallback` path is **whitelisted in `proxy.ts`** and **does not require auth**.
- [ ] Persistence layer **never overwrites a final status** with a non-final value (the seven final statuses: `finished`, `cancelled`, `closed`, `timeout`, `error`, `void`, `refund`).
- [ ] `idempotencyId` is unique per attempt.
- [ ] `amount` is in **smallest currency unit** (cents).

## Hosting platform (Vercel-specific)

- [ ] `export const maxDuration = 60` on every route that calls mPower or mPay.
- [ ] `APP_BASE_URL` env var set to the canonical production URL (not a preview deployment).
- [ ] Database (Neon / Postgres) connection pooling configured for serverless.
- [ ] No external keep-alive ping every few minutes — Neon free tier compute hours are limited.
- [ ] Vercel cron used for cleanup tasks only, not as a heartbeat.

## Observability

- [ ] Logs include `transactionId` / `messageId` for correlation.
- [ ] 401 retries are logged but not alerted.
- [ ] Pay callback failures (non-2xx response from your endpoint) trigger an alert.
- [ ] Webhook failures retry with backoff on KOBIL's side — make your handler **idempotent**.

## Security

- [ ] Client secrets never committed to the repo.
- [ ] `.env` and `.env.local` in `.gitignore`.
- [ ] Webhook / callback paths bypass auth but still validate payload shape before persisting.
- [ ] HTTPS enforced everywhere; HTTP redirect URIs only on `localhost`.
- [ ] Rate limit your own outbound to mPower / mPay so a runaway loop doesn't burn through quotas.

## Pre-launch smoke test

Run end-to-end on the production environment with a real test user:

1. Login via OIDC succeeds.
2. Outbound chat message arrives on the user's mIdentity device.
3. User reply arrives on your webhook.
4. Payment creation returns `200` with `status: "new"`.
5. User confirms in mIdentity; merchantCallback arrives within 60 s.
6. Final status persists as `SUCCESS` (or whatever final value) and is **not overwritten** by a subsequent `/status` poll.

If all six pass, you're production-ready.

---

*Last verified: 2026-05-08.*
