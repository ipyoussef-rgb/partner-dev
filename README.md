# KOBIL Partner Dev

Documentation site for partners integrating **KOBIL Super App Services** — Identity, Chat (mPower), Pay (mPay), MiniApps, App-to-App. Bilingual: **English (default)** and **German**.

Built with [Docusaurus 3](https://docusaurus.io). Deployable on Vercel out of the box.

## What's inside

- A complete partner-onboarding doc that takes a developer from zero credentials to a working integration in 60 minutes (`/superapp-services/quickstart`).
- Verified endpoints, body schemas, and gotcha tables for KOBIL Identity, Chat (mPower) and Pay (mPay).
- Mermaid sequence diagrams for every flow.
- Error-code lookup and a production checklist.
- Full German mirror under `/de/`.

## Local development

```bash
npm install
npm run start            # English (default), http://localhost:3000
npm run start:de         # German, http://localhost:3000/de
```

```bash
npm run build            # Static build under /build
npm run serve            # Serve the build locally
```

## Deploy to Vercel

The repo is Vercel-ready. Two ways:

### Option A — One-click via dashboard

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import the GitHub repo `ipyoussef-rgb/partner-dev`.
3. Vercel detects Docusaurus automatically. Click **Deploy**.

### Option B — CLI

```bash
npm i -g vercel
vercel             # follow prompts (link to project)
vercel --prod      # production deploy
```

The `vercel.json` in the repo pins `buildCommand`, `outputDirectory` and `cleanUrls`, so no Vercel-side configuration is needed.

## Editing content

All docs are Markdown under `docs/`. The German translations mirror the structure under `i18n/de/docusaurus-plugin-content-docs/current/`. When you change an English page, update its German counterpart in the same commit — Docusaurus falls back to English when a translation is missing, but search relevance suffers.

To regenerate i18n keys for navbar / footer / homepage strings after editing them:

```bash
npm run write-translations -- --locale de
```

## Structure

```
docs/superapp-services/
├── index.md                          Landing
├── before-you-start/                 Glossary, prerequisites, credentials
├── quickstart.md                     60-min E2E
├── core-integrations/                Identity, Chat, Pay, TMS
├── miniapp-services/
├── chat-services/
├── app-to-app/
└── reference/                        Diagrams, errors, production checklist

i18n/de/
├── code.json                         Homepage strings
├── docusaurus-plugin-content-docs/
│   └── current/superapp-services/    German mirror of all docs
└── docusaurus-theme-classic/         Navbar + footer translations

src/
├── css/custom.css                    Theme tweaks
└── pages/index.js                    Homepage
```

## Verified content

The Identity, Chat and Pay detail pages encode content verified end-to-end against tenant `mycity.kobil.com` on **2026-05-08**. Each page carries a *Last verified* footer — bump it when you re-test against an endpoint.

## Open content stubs

Three sections are placeholders awaiting team input:

- **KOBIL TMS** — needs API surface from the TMS team.
- **MiniApp Services detail pages** — need walkthrough + manifest schema reference.
- **App2App with User Info** — needs signature format and SDK reference from the mIdentity team.

The stubs explain what's needed and link to Solutions Engineering.
