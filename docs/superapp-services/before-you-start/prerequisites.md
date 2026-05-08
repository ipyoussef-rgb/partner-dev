---
id: prerequisites
title: Prerequisites & Test Tenant
sidebar_label: Prerequisites & Test Tenant
sidebar_position: 4
description: The list of things to ask your KOBIL contact for before integration begins.
---

# Prerequisites & Test Tenant

Before you write code, you need a **test tenant** from KOBIL. A test tenant is a Keycloak realm, an IDP host, and at least one mIdentity test user. Your KOBIL Solutions Engineering contact provisions it.

## What to ask KOBIL for

Send the following to your KOBIL contact (typically your Solutions Engineer):

| Item | Why you need it | Example |
|---|---|---|
| `idp_host` | Base URL for OIDC + mPower | `https://idp.mycity.kobil.com` |
| `pay_host` (if using payments) | Base URL for mPay | `https://pay.mycity.kobil.com` |
| `realm` name | The Keycloak realm; appears in every URL | `buergerapp` |
| Sample user | Email/username + a real device with mIdentity activated | `alice@example.com` + Alice's phone |
| mIdentity branding | App icon, colors, theme — for the user-installed app | (sent as design assets) |
| Webhook registration | If you use chat or pay, your callback URL needs to be registered | `https://your.app/api/chat-webhook` |

You will receive these out-of-band (typically via secure email or a shared password manager). **Do not commit any of them to a public repo.**

## What you set up yourself

Once you have the realm, you create your OIDC clients in the [KOBIL Portal](https://documentation.cloud.kobil.com/guides/category/portal/). See [Get Your Credentials](./get-credentials) for the step-by-step.

## A test device

To test the full flow you need a phone with the **mIdentity companion app installed and activated for the test user**. KOBIL provides:

- Either a branded mIdentity app you publish to a TestFlight / internal track,
- Or the generic mIdentity app from the App Store / Play Store, configured for the test realm.

Without an activated device the OIDC login completes but no service that requires a confirmation step (Pay, sensitive Chat) will return success.

## Local-development URLs

Keycloak validates Valid Redirect URIs **exactly** — trailing slashes and ports matter. Plan to register **both** your production URL and a localhost URL up front:

```
https://your.app/api/auth/user/callback
https://your.app/api/auth/admin/callback
http://localhost:3000/api/auth/user/callback
http://localhost:3000/api/auth/admin/callback
```

## Checklist

Before you proceed to the [Quickstart](../quickstart):

- [ ] You have an `idp_host` and a `realm` name.
- [ ] You can resolve `https://{idp_host}/auth/realms/{realm}/.well-known/openid-configuration` and get a JSON document back.
- [ ] You have at least one user account with an activated mIdentity device.
- [ ] You have a public HTTPS URL for webhooks (a Vercel preview deployment, an ngrok tunnel, or your dev server with a tunnel).

## Next

[Get Your Credentials](./get-credentials) — set up your OIDC clients in the Portal.
