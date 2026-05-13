---
id: glossary
title: Glossar
sidebar_label: Glossar
sidebar_position: 2
description: KOBIL- und Germany-App-Begriffe, die Einsteiger verwirren.
---

# Glossar

| Begriff | Was es ist | Wann du es brauchst |
|---|---|---|
| **Germany App** | Die vertrauenswürdige Superapp, in der Bürger:innen Dienste mit verifizierter mobiler Identität nutzen. | Das Produkt, für das dieser Guide ist. |
| **KOBIL Superapp-Plattform** | Die Runtime-Plattform hinter der Germany App und anderen Superapps. | Hintergrund. |
| **mIdentity** | Mobile-SDK + Companion-App auf dem Gerät. Liefert den biometrischen zweiten Faktor. | Jeder User-Flow. |
| **mPower** | Server-seitige Messaging-API (Chat). | Wenn du Chat-Nachrichten schickst. |
| **mPay** | Merchant-seitige Payments-API. | Wenn du Zahlungen verarbeitest. |
| **Realm** | Der Keycloak-Realm für deinen Tenant. | OIDC-Setup, alle Server-Calls. |
| **OIDC-`sub`** | Stabile User-UUID aus dem ID-Token. | Dein DB-Key, Payments-`userId`. |
| **Empfänger-ID** | Identifier, den ein nachgelagerter Service benutzt. **Pro Service unterschiedlich.** | Chat nutzt E-Mail; Payments nutzt `sub`. |
| **Server-Client** | OIDC-Client mit `client_credentials` aktiv. | Alle Backend-zu-Plattform-Calls. |
| **User-Client** | OIDC-Client mit Authorization Code + PKCE. | Endnutzer-Login. |
| **merchantCallback** | URL, an die die Payments-Plattform den finalen Status POSTet. | Wahrheit für Payments. |
| **Finaler Status** | Einer von `finished`, `cancelled`, `closed`, `timeout`, `error`, `void`, `refund`. | Niemals überschreiben, sobald persistiert. |
