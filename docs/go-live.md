---
id: go-live
title: Step 5 — Go Live
sidebar_label: 5. Go Live
sidebar_position: 6
description: Production checklist for shipping your Germany App integration.
---

# Step 5 — Go Live

Run through this before production traffic. Each item below has bitten at least one real launch.

## Identity / Login

- [ ] **Production redirect URIs** registered on the user-UI client.
- [ ] **Localhost / preview redirect URIs** removed from the production client. Use a separate dev client.
- [ ] **PKCE method = S256** on all user-facing clients.
- [ ] **Login Theme** verified on a real browser — no `displayWide` macro errors.
- [ ] Backend **token cache** with TTL ≤ 270 s.
- [ ] **401 retry path** invalidates cache and retries once, then bubbles up.
- [ ] **Both `sub` and `email`** persisted at login time.

## Chat

- [ ] Server client has **Service Accounts Enabled = ON**.
- [ ] Webhook URL is **publicly reachable, no auth header expected**.
- [ ] Webhook path is **whitelisted in `proxy.ts`** / auth middleware.
- [ ] Recipient identifier in the path is **email**, not OIDC `sub`.
- [ ] `serviceUuid` in the body **equals the token's `client_id`**.
- [ ] `messageType` uses **`processChatMessage`**, not `plainText`.
- [ ] Outbound calls happen inside **`after()`** (or equivalent) so serverless functions don't kill them.

## Payments

- [ ] `userId` in the body is the **OIDC `sub` UUID**.
- [ ] `merchantId` and `merchantServiceUUID` both equal the **server client_id**.
- [ ] `transactionTimeout ≤ 60`.
- [ ] `merchantCallback` is an **absolute URL** built from `APP_BASE_URL`, not relative.
- [ ] `merchantCallback` path is **whitelisted** and **does not require auth**.
- [ ] Persistence **never overwrites a final status** (`finished`, `cancelled`, `closed`, `timeout`, `error`, `void`, `refund`).
- [ ] `idempotencyId` unique per attempt.
- [ ] `amount` in **smallest currency unit** (cents).

## Hosting (Vercel-specific)

- [ ] `export const maxDuration = 60` on every route that calls Chat or Payments.
- [ ] `APP_BASE_URL` env var = the canonical production URL (not a preview deployment).
- [ ] Database connection pooling configured for serverless.
- [ ] No keep-alive ping every few minutes — most serverless DB tiers meter compute hours.

## Observability

- [ ] Logs include `transactionId` / `messageId` for correlation.
- [ ] 401 retries logged but not alerted.
- [ ] Payment callback failures (non-2xx from your endpoint) trigger an alert.
- [ ] Webhook / callback handlers are **idempotent** — the platform retries on failure.

## Security

- [ ] Client secrets never committed to the repo.
- [ ] `.env` and `.env.local` in `.gitignore`.
- [ ] Callback paths bypass auth but **validate payload shape** before persisting.
- [ ] HTTPS everywhere; HTTP redirect URIs only on `localhost`.
- [ ] Rate-limit your outbound to Chat / Payments so a runaway loop can't burn quotas.

## Pre-launch smoke test

Run end-to-end on production with a real test user:

1. Login via OIDC succeeds.
2. Outbound chat message arrives on the user's mIdentity device.
3. User reply arrives on your webhook.
4. Payment creation returns `200` with `status: "new"`.
5. User confirms in mIdentity; merchantCallback arrives within 60 s.
6. Final status persists as `SUCCESS` and is **not overwritten** by a later `/status` poll.

If all six pass, you're production-ready.

---

*Last verified: 2026-05-08.*
