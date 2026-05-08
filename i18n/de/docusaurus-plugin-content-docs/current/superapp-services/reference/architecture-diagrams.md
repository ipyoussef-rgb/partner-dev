---
id: architecture-diagrams
title: Architektur-Diagramme
sidebar_label: Architektur-Diagramme
sidebar_position: 1
description: Copy-Paste-Mermaid-Sequenzen für jeden KOBIL-Flow — Login, Chat, Payment, MiniApp-Launch.
---

# Architektur-Diagramme

Alle Diagramme nutzen Mermaid und rendern nativ in Docusaurus. Kopier sie in deine eigenen Design-Docs.

## Plattform-Überblick

```mermaid
flowchart LR
    subgraph User["Endgerät"]
        Browser[Browser / Native App]
        mIdentity[KOBIL mIdentity App]
    end

    subgraph Partner["Partner-Backend"]
        App[Deine App]
    end

    subgraph KOBIL["KOBIL Cloud"]
        IDP[KOBIL Identity / OIDC]
        mPower[mPower Chat]
        mPay[mPay Merchant]
        TMS[TMS]
    end

    Browser -->|OIDC-Login| App
    App -->|Auth Code + PKCE| IDP
    IDP <-.->|Push-Challenge| mIdentity
    App -->|client_credentials| IDP
    App -->|Chat senden| mPower
    App -->|Transaktion erstellen| mPay
    mPower -.->|Webhook| App
    mPay -.->|merchantCallback| App
```

## OIDC-Login

```mermaid
sequenceDiagram
    autonumber
    participant U as User-Browser
    participant A as Deine App
    participant IDP as KOBIL IDP
    participant M as mIdentity-App

    U->>A: "Login" klicken
    A->>IDP: Redirect /auth?client_id&PKCE
    IDP->>U: Login-Screen
    U->>IDP: Username
    IDP->>M: Push-Challenge
    M->>U: Biometrie-Prompt
    U->>M: Bestätigen
    M->>IDP: Signierte Assertion
    IDP->>A: Redirect mit Code
    A->>IDP: POST /token
    IDP->>A: id_token + access_token
```

## Chat: Senden + Antwort

```mermaid
sequenceDiagram
    autonumber
    participant A as Dein Backend
    participant IDP as KOBIL IDP / mPower
    participant M as mIdentity-App
    participant W as Dein Webhook

    A->>IDP: POST /token (client_credentials)
    IDP->>A: Bearer-Token
    A->>IDP: POST /mpower/v1/users/{email}/message
    IDP->>M: Push aufs Gerät
    M->>M: Nutzer liest / antwortet
    M-->>IDP: Reply
    IDP-->>W: POST Webhook-Payload
    W->>A: Reply verarbeiten
```

## Pay: Erstellen + Signieren + Callback

```mermaid
sequenceDiagram
    autonumber
    participant A as Dein Backend
    participant P as mPay
    participant M as mIdentity-App
    participant CB as merchantCallback

    A->>P: POST /create/transaction
    P-->>A: 200 ack { transactionId, status: "new" }
    P->>M: Signing-Challenge
    M->>M: Nutzer bestätigt
    M-->>P: Signiertes Ergebnis
    P->>CB: POST { transactionStatus: "finished" }
    CB->>A: Kanonischen finalen Status persistieren

    Note over A,CB: Optionaler /status-Poll<br/>liefert "inquiring status" — niemals final überschreiben
```

## MiniApp-Launch

```mermaid
sequenceDiagram
    participant Container as KOBIL-Container
    participant MiniApp as Deine MiniApp
    participant Backend as Dein Backend

    Container->>MiniApp: Launch mit Session-Kontext
    MiniApp->>Backend: API-Call mit geerbter Session
    Backend->>Backend: Session prüfen, antworten
    Backend->>MiniApp: Daten
    MiniApp->>Container: UI rendern
```
