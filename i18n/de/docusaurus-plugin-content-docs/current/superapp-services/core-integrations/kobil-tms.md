---
id: kobil-tms
title: KOBIL TMS
sidebar_label: KOBIL TMS
sidebar_position: 5
description: Tenant-Management-System — Provisionierung von Realms, Clients, Themes und Nutzern. Wird hauptsächlich von KOBIL-Operations und Resellern genutzt.
---

# KOBIL TMS

> **Tenant-Management-System.** Provisioniert und verwaltet Realms, OIDC-Clients, gebrandete Login-Themes und Nutzer-Lifecycle. Die meisten Partner konsumieren nur das Ergebnis von TMS-Arbeit — sie rufen TMS nicht direkt auf.

:::info Inhaltlicher Platzhalter
Diese Seite ist **ein Stub und wartet auf Input vom KOBIL-TMS-Team**. Die Struktur unten ist das Gerüst, das wir füllen werden. Wenn du Partner bist und TMS heute integrieren willst, wende dich an deinen KOBIL Solutions Engineer.
:::

## Wann nutzt du das

- Du bist **Reseller** und provisionierst Sub-Tenants für deine eigenen Kunden.
- Du betreibst ein **Multi-Tenant-SaaS** auf KOBIL-Basis und brauchst programmatische Realm-Erstellung.
- Du gehörst zur **KOBIL-Operations** und betreust Kunden-Onboarding.

Wenn du Single-Tenant-Partner bist, brauchst du TMS nicht — dein Tenant ist bereits provisioniert.

## Konzepte

- **Tenant** — KOBIL-Kunde, mappt auf einen Keycloak-Realm.
- **Realm** — der isolierte Identity-Space. In Standard-Setups ein Realm pro Tenant.
- **Client** — OIDC-Client innerhalb eines Realms. Typisches Layout siehe [Credentials anlegen](../before-you-start/get-credentials).
- **Theme** — gebrandete Login-Seiten (Logo, Farben, Texte) pro Realm.

## Was TMS macht

(Wird mit dem TMS-Team befüllt.)

- Realm-Erstellung und Naming-Konventionen
- Default-Client-Templates
- Theme-Upload und Zuweisung
- Nutzer-Import / -Export
- Credential-Rotation-Flows

## API-Surface

(Wird befüllt. Die TMS-API ist aktuell nur intern dokumentiert; der öffentliche Subset wird hier veröffentlicht.)

## Wie du Zugang anfragst

Wende dich an deinen KOBIL Solutions Engineer. TMS-API-Keys werden out-of-band ausgestellt und sind auf die Realms beschränkt, die du administrierst.

---

*Diese Seite ist ein Stub. Letzte Aktualisierung: 2026-05-08.*
