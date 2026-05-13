// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  integrationSidebar: [
    'get-credentials',
    'login',
    'chat',
    'payments',
    'go-live',
    {
      type: 'category',
      label: 'Reference',
      link: { type: 'doc', id: 'reference/reference' },
      items: [
        'reference/errors',
        'reference/glossary',
      ],
    },
  ],
};

export default sidebars;
