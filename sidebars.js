// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  superappSidebar: [
    {
      type: 'doc',
      id: 'superapp-services/superapp-services',
      label: 'Super App Services',
    },
    {
      type: 'category',
      label: '0. Before You Start',
      link: { type: 'doc', id: 'superapp-services/before-you-start/before-you-start' },
      items: [
        'superapp-services/before-you-start/what-is-a-superapp',
        'superapp-services/before-you-start/glossary',
        'superapp-services/before-you-start/prerequisites',
        'superapp-services/before-you-start/get-credentials',
      ],
    },
    {
      type: 'doc',
      id: 'superapp-services/quickstart',
      label: '1. Quickstart',
    },
    {
      type: 'category',
      label: '2. Core Integrations',
      link: { type: 'doc', id: 'superapp-services/core-integrations/core-integrations' },
      items: [
        'superapp-services/core-integrations/kobil-identity',
        'superapp-services/core-integrations/kobil-chat',
        'superapp-services/core-integrations/kobil-pay',
        'superapp-services/core-integrations/kobil-tms',
      ],
    },
    {
      type: 'category',
      label: '3. MiniApp Services',
      link: { type: 'doc', id: 'superapp-services/miniapp-services/miniapp-services' },
      items: [],
    },
    {
      type: 'category',
      label: '4. Chat Services',
      link: { type: 'doc', id: 'superapp-services/chat-services/chat-services' },
      items: [],
    },
    {
      type: 'category',
      label: '5. App-to-App Services',
      link: { type: 'doc', id: 'superapp-services/app-to-app/app-to-app' },
      items: [],
    },
    {
      type: 'category',
      label: 'Reference',
      link: { type: 'doc', id: 'superapp-services/reference/reference' },
      items: [
        'superapp-services/reference/architecture-diagrams',
        'superapp-services/reference/error-codes',
        'superapp-services/reference/production-checklist',
      ],
    },
  ],
};

export default sidebars;
