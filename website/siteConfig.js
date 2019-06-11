/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [
  {
    caption: 'Google',
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/image.jpg'.
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Chrome_icon_%28September_2014%29.svg/128px-Google_Chrome_icon_%28September_2014%29.svg.png',
    infoLink: 'https://www.google.io',
    pinned: true,
  },
  {
    caption: 'Github',
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/image.jpg'.
    image: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png',
    infoLink: 'https://www.github.com',
    pinned: true,
  },
];

const siteConfig = {
  title: 'Milvus', // Title for your website.
  tagline: 'A Distributed High Performance Vector Database System',
  url: 'https://www.milvus.io', // Your website URL
  baseUrl: '/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'milvus',
  organizationName: 'zilliz',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'doc1', label: 'Docs'},
    {page: 'help', label: 'Help'},
    {blog: true, label: 'Blog'},
  ],

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: '',
  footerIcon: '',
  favicon: 'img/favicon.ico',

  /* Colors for website */
  colors: {
    primaryColor: '#59B5ED',
    secondaryColor: '#59B5E1',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} ZillZ`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [
    'https://buttons.github.io/buttons.js',
    '/js/clipboard.min.js',
    '/js/code-block-buttons.js',
  ],
  stylesheets: ['/css/code-block-buttons.css'],
  
  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/undraw_online.svg',
  twitterImage: 'img/undraw_tweetstorm.svg',
  

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',

  blogSidebarCount: '10'
};

module.exports = siteConfig;
