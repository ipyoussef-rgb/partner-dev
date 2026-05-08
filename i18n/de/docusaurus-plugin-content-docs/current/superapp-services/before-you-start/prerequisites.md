---
id: prerequisites
title: Voraussetzungen & Test-Tenant
sidebar_label: Voraussetzungen & Test-Tenant
sidebar_position: 4
description: Die Liste der Dinge, die du bei deinem KOBIL-Kontakt anfragst, bevor die Integration beginnt.
---

# Voraussetzungen & Test-Tenant

Bevor du Code schreibst, brauchst du einen **Test-Tenant** von KOBIL. Ein Test-Tenant ist ein Keycloak-Realm, ein IDP-Host und mindestens ein mIdentity-Test-Nutzer. Dein KOBIL-Solutions-Engineering-Kontakt richtet ihn ein.

## Was du bei KOBIL anfragst

Schicke folgendes an deinen KOBIL-Kontakt (in der Regel deinen Solutions Engineer):

| Item | Wozu | Beispiel |
|---|---|---|
| `idp_host` | Basis-URL für OIDC + mPower | `https://idp.mycity.kobil.com` |
| `pay_host` (falls Payments) | Basis-URL für mPay | `https://pay.mycity.kobil.com` |
| `realm`-Name | Der Keycloak-Realm; kommt in jeder URL vor | `buergerapp` |
| Test-Nutzer | E-Mail/Username + ein echtes Gerät mit aktivierter mIdentity | `alice@example.com` + Alices Handy |
| mIdentity-Branding | App-Icon, Farben, Theme — für die installierte App | (als Design-Assets) |
| Webhook-Registrierung | Bei Chat oder Pay muss deine Callback-URL registriert sein | `https://your.app/api/chat-webhook` |

Du erhältst diese out-of-band (typisch sicher per E-Mail oder geteilten Passwort-Manager). **Nichts davon in ein öffentliches Repo committen.**

## Was du selber einrichtest

Sobald du den Realm hast, legst du deine OIDC-Clients im [KOBIL Portal](https://documentation.cloud.kobil.com/guides/category/portal/) an. Klick-für-Klick siehe [Credentials anlegen](./get-credentials).

## Ein Test-Gerät

Um den ganzen Flow zu testen brauchst du ein Handy, auf dem die **mIdentity-Companion-App installiert und für den Test-Nutzer aktiviert** ist. KOBIL liefert entweder:

- eine gebrandete mIdentity-App, die du über TestFlight / Internal Track verteilst,
- oder die generische mIdentity-App aus App Store / Play Store, konfiguriert für den Test-Realm.

Ohne aktiviertes Gerät schließt der OIDC-Login zwar ab, aber kein Service mit Bestätigungsschritt (Pay, sensitiver Chat) kommt zum Erfolg.

## URLs für Local Development

Keycloak validiert Valid Redirect URIs **exakt** — Trailing Slash und Port zählen. Plane gleich am Anfang ein, sowohl Produktions- als auch Localhost-URLs zu registrieren:

```
https://your.app/api/auth/user/callback
https://your.app/api/auth/admin/callback
http://localhost:3000/api/auth/user/callback
http://localhost:3000/api/auth/admin/callback
```

## Checkliste

Bevor du zum [Quickstart](../quickstart) weitergehst:

- [ ] Du hast einen `idp_host` und einen `realm`-Namen.
- [ ] `https://{idp_host}/auth/realms/{realm}/.well-known/openid-configuration` liefert ein JSON-Dokument zurück.
- [ ] Du hast mindestens einen Nutzer mit aktiviertem mIdentity-Gerät.
- [ ] Du hast eine öffentliche HTTPS-URL für Webhooks (Vercel-Preview-Deployment, ngrok-Tunnel, oder dein Dev-Server mit Tunnel).

## Weiter

[Credentials anlegen](./get-credentials) — OIDC-Clients im Portal einrichten.
