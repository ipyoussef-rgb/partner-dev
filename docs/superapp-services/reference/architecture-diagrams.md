---
id: architecture-diagrams
title: Architecture Diagrams
sidebar_label: Architecture Diagrams
sidebar_position: 1
description: Copy-paste Mermaid sequences for every KOBIL flow — login, chat, payment, MiniApp launch.
---

# Architecture Diagrams

All diagrams use Mermaid and render natively in Docusaurus. Copy them into your own design docs.

## Platform overview

```mermaid
flowchart LR
    subgraph User["End user device"]
        Browser[Browser / Native app]
        mIdentity[KOBIL mIdentity App]
    end

    subgraph Partner["Partner backend"]
        App[Your App]
    end

    subgraph KOBIL["KOBIL Cloud"]
        IDP[KOBIL Identity / OIDC]
        mPower[mPower Chat]
        mPay[mPay Merchant]
        TMS[TMS]
    end

    Browser -->|OIDC login| App
    App -->|Auth Code + PKCE| IDP
    IDP <-.->|push challenge| mIdentity
    App -->|client_credentials| IDP
    App -->|Send chat| mPower
    App -->|Create transaction| mPay
    mPower -.->|Webhook| App
    mPay -.->|merchantCallback| App
```

## OIDC login

```mermaid
sequenceDiagram
    autonumber
    participant U as User browser
    participant A as Your app
    participant IDP as KOBIL IDP
    participant M as mIdentity app

    U->>A: Click "Login"
    A->>IDP: Redirect /auth?client_id&PKCE
    IDP->>U: Login screen
    U->>IDP: Username
    IDP->>M: Push challenge
    M->>U: Biometric prompt
    U->>M: Confirm
    M->>IDP: Signed assertion
    IDP->>A: Redirect with code
    A->>IDP: POST /token
    IDP->>A: id_token + access_token
```

## Chat: send + reply

```mermaid
sequenceDiagram
    autonumber
    participant A as Your backend
    participant IDP as KOBIL IDP / mPower
    participant M as mIdentity app
    participant W as Your webhook

    A->>IDP: POST /token (client_credentials)
    IDP->>A: Bearer token
    A->>IDP: POST /mpower/v1/users/{email}/message
    IDP->>M: Push to device
    M->>M: User reads / replies
    M-->>IDP: Reply
    IDP-->>W: POST webhook payload
    W->>A: Process reply
```

## Pay: create + sign + callback

```mermaid
sequenceDiagram
    autonumber
    participant A as Your backend
    participant P as mPay
    participant M as mIdentity app
    participant CB as merchantCallback

    A->>P: POST /create/transaction
    P-->>A: 200 ack { transactionId, status: "new" }
    P->>M: Signing challenge
    M->>M: User confirms
    M-->>P: Signed result
    P->>CB: POST { transactionStatus: "finished" }
    CB->>A: Persist canonical final status

    Note over A,CB: Optional /status poll<br/>returns "inquiring status" — never overwrite final
```

## MiniApp launch

```mermaid
sequenceDiagram
    participant Container as KOBIL container
    participant MiniApp as Your MiniApp
    participant Backend as Your backend

    Container->>MiniApp: Launch with session context
    MiniApp->>Backend: API call w/ inherited session
    Backend->>Backend: Verify session, respond
    Backend->>MiniApp: Data
    MiniApp->>Container: Render UI
```
