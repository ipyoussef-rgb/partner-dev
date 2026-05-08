---
id: kobil-tms
title: KOBIL TMS
sidebar_label: KOBIL TMS
sidebar_position: 5
description: Tenant Management System — provisioning realms, clients, themes and users. Mostly used by KOBIL operations and resellers.
---

# KOBIL TMS

> **Tenant Management System.** Provisions and manages realms, OIDC clients, branded login themes, and user lifecycle. Most partners only consume the result of TMS work — they don't call TMS directly.

:::info Content placeholder
This page is **a stub awaiting input from the KOBIL TMS team**. The content below is the structure we'll fill in. If you're a partner trying to integrate TMS today, contact your KOBIL Solutions Engineer.
:::

## When to use this

- You are a **reseller** provisioning sub-tenants for your own customers.
- You operate a **multi-tenant SaaS** on top of KOBIL and need programmatic realm creation.
- You are part of **KOBIL operations** running customer onboarding.

If you're a single-tenant partner, you do not need TMS — your tenant is already provisioned.

## Concepts

- **Tenant** — a KOBIL customer, mapping to a Keycloak realm.
- **Realm** — the isolated identity space. One realm per tenant in standard setups.
- **Client** — an OIDC client inside a realm. See [Get Your Credentials](../before-you-start/get-credentials) for the typical client layout.
- **Theme** — branded login pages (logo, colors, copy) per realm.

## What TMS does

(To be filled in with the TMS team.)

- Realm creation and naming conventions
- Default client templates
- Theme upload and assignment
- User import / export
- Credential rotation flows

## API surface

(To be filled in. The TMS API is currently documented in internal-only material; we'll publish the public-facing subset here.)

## How to request access

Contact your KOBIL Solutions Engineer. TMS API keys are issued out-of-band and are scoped to the realms you administer.

---

*This page is a stub. Last updated: 2026-05-08.*
