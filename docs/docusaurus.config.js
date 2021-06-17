module.exports = {
  title: 'Oak',
  tagline: 'A page builder for the future of the internet',
  url: 'https://oak.poool.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'null',
  organizationName: 'p3ol',
  projectName: 'oak',
  themeConfig: {
    navbar: {
      title: '',
      logo: {
        alt: 'Oak Page Builder',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/examples',
          position: 'left',
          label: 'Examples',
        },
        {
          type: 'search',
          position: 'right',
        },
        {
          href: 'https://github.com/p3ol/oak',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      // links: [
      //   {
      //     title: 'Docs',
      //     items: [
      //       {
      //         label: 'Introduction',
      //         to: '/docs/intro',
      //       },
      //     ],
      //   },
      //   {
      //     title: 'More',
      //     items: [
      //       {
      //         label: 'GitHub',
      //         href: 'https://github.com/p3ol/oak',
      //       },
      //     ],
      //   },
      // ],
      copyright: `Copyright © ${new Date().getFullYear()} Poool`,
    },
    // prism: {
    //   theme: require('prism-react-renderer/themes/github'),
    // },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
