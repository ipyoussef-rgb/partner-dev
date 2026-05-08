// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'KOBIL Partner Dev',
  tagline: 'Build your Super App on KOBIL — partner integration guide',
  favicon: 'img/favicon.svg',

  url: 'https://partner-dev.vercel.app',
  baseUrl: '/',

  organizationName: 'ipyoussef-rgb',
  projectName: 'partner-dev',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    localeConfigs: {
      en: { label: 'English', direction: 'ltr', htmlLang: 'en-US' },
      de: { label: 'Deutsch', direction: 'ltr', htmlLang: 'de-DE' },
    },
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/ipyoussef-rgb/partner-dev/edit/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/social-card.png',
      colorMode: {
        defaultMode: 'light',
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'KOBIL Partner Dev',
        logo: {
          alt: 'KOBIL',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'superappSidebar',
            position: 'left',
            label: 'Super App Services',
          },
          {
            href: 'https://documentation.cloud.kobil.com',
            label: 'Official docs',
            position: 'right',
          },
          {
            href: 'https://github.com/ipyoussef-rgb/partner-dev',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              { label: 'Super App Services', to: '/superapp-services' },
              { label: 'Quickstart', to: '/superapp-services/quickstart' },
              { label: 'Production checklist', to: '/superapp-services/reference/production-checklist' },
            ],
          },
          {
            title: 'KOBIL',
            items: [
              { label: 'Official documentation', href: 'https://documentation.cloud.kobil.com' },
              { label: 'KOBIL website', href: 'https://kobil.com' },
            ],
          },
          {
            title: 'More',
            items: [
              { label: 'Sample app (terbuch)', href: 'https://github.com/ipyoussef-rgb/terbuch' },
              { label: 'This site on GitHub', href: 'https://github.com/ipyoussef-rgb/partner-dev' },
            ],
          },
        ],
        copyright: `Built ${new Date().getFullYear()} for partner integration. Verified content sourced from internal references — see "Last verified" footers.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'json', 'jsonc', 'ini', 'typescript'],
      },
      mermaid: {
        theme: { light: 'neutral', dark: 'dark' },
      },
    }),
};

export default config;
