# Germany App — Partner Integration

Documentation for partners integrating their service into the **Germany App**, powered by the KOBIL Superapp Platform. Bilingual (English default, German).

Built with [Docusaurus 3](https://docusaurus.io).

## Local development

```bash
npm install
npm run start            # English (default), http://localhost:3000
npm run start:de         # German,             http://localhost:3000/de
```

```bash
npm run build            # Static build under /build
npm run serve            # Serve the build locally
```

## Content

All partner-facing content lives under `docs/`. Each step page is a single Markdown file:

```
docs/
├── get-credentials.md
├── login.md
├── chat.md
├── payments.md
├── go-live.md
└── reference/
    ├── errors.md
    └── glossary.md
```

The German translations mirror the same structure under `i18n/de/docusaurus-plugin-content-docs/current/`. When you change an English page, update its German counterpart in the same commit.

To regenerate i18n keys for navbar / footer / homepage strings after editing them:

```bash
npm run write-translations -- --locale de
```
