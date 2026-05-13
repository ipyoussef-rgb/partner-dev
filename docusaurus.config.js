// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Germany App – Partner Integration',
  tagline: 'Integrate your service into the Germany App',
  favicon: 'img/favicon.svg',

  url: 'https://partner-dev.vercel.app',
  baseUrl: '/',

  organizationName: 'ipyoussef',
  projectName: 'partner-dev',

  onBrokenLinks: 'warn',

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
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
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
        title: 'Germany App – Partner Integration',
        logo: {
          alt: 'Germany App',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'integrationSidebar',
            position: 'left',
            label: 'Integration Guide',
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
            title: 'Integration',
            items: [
              { label: 'Overview', to: '/' },
              { label: 'Step 1 – Get Credentials', to: '/get-credentials' },
              { label: 'Step 5 – Go Live', to: '/go-live' },
            ],
          },
        ],
        copyright: `Germany App Partner Integration · ${new Date().getFullYear()} · Powered by KOBIL Superapp Platform`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'json', 'ini', 'typescript'],
      },
      mermaid: {
        theme: { light: 'neutral', dark: 'dark' },
      },
    }),
};

export default config;
