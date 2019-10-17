function escapeHtml(str) {
  if (/[&<>"]/.test(str)) {
    return str.replace(/[&<>"]/g, {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;"
    });
  }
  return str;
}

function taskLists(md) {
  // md.renderer
  md.renderer.rules.list_item_open = function(tokens, idx /*, options, env */) {
    let nextToken = tokens[idx+2];
    let hasTask = false;
    if (nextToken) {
      let content = nextToken.content;
      hasTask = content.startsWith("[ ]") || content.startsWith("[x]");
    }
    return `<li ${hasTask ? 'class="contains-task"' : ''}>`;
  };

  md.renderer.rules.text = function(tokens, idx /*, options, env */) {
    const token = tokens[idx];
    let content = token.content;
    const isTask = content.startsWith("[ ]") || content.startsWith("[x]");
    token.isTask = isTask;
    if (token.isTask) {
      content = content.replace("[ ]", `<input type="checkbox" disabled />`);
      content = content.replace(
        "[x]",
        `<input type="checkbox" checked disabled />`
      );

      return content;
    }
    return escapeHtml(content);
  };
}

// List of projects/orgs using your project for the users page.
const users = [
  {
    caption: "Google",
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/image.jpg'.
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Chrome_icon_%28September_2014%29.svg/128px-Google_Chrome_icon_%28September_2014%29.svg.png",
    infoLink: "https://www.google.io",
    pinned: true
  },
  {
    caption: "Github",
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/image.jpg'.
    image:
      "https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png",
    infoLink: "https://www.github.com",
    pinned: true
  }
];

const siteConfig = {
  title: "Milvus", // Title for your website.
  tagline: "A Distributed High Performance Vector Database System",
  url: "https://www.milvus.io", // Your website URL
  baseUrl: "/", // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: "milvus",
  organizationName: "zilliz",
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: "aboutmilvus/overview", label: "About Milvus" },
    { doc: "userguide/install_milvus", label: "Docs" },
    { blog: true, label: "Blog" },
    { doc: "reference/README", label: "Try" }
  ],

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: "new-images/logo-horizontal-white.svg",
  footerIcon: "",
  favicon: "new-images/favicon.png",

  /* Colors for website */
  colors: {
    primaryColor: "#33b6f2",
    secondaryColor: "#59B5E1"
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
  copyright: `Copyright © ${new Date().getFullYear()} Zilliz`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: "atom-one-dark"
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [
    "/js/clipboard.min.js",
    "/js/loaded.js",
    "https://buttons.github.io/buttons.js"
  ],
  stylesheets: [
    "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css",
    "https://cdn.bootcss.com/font-awesome/5.10.2/css/all.min.css",
    "https://use.typekit.net/odf7gmc.css"
  ],

  // On page navigation for the current documentation page.
  onPageNav: "separate",
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: "img/undraw_online.svg",
  twitterImage: "img/undraw_tweetstorm.svg",
  // gaTrackingId: 'UA-142992812-1',
  gaGtag: true,

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
  docsSideNavCollapsible: true,

  blogSidebarCount: "10",
  editUrl: "https://github.com/milvus-io/docs/blob/master/",

  algolia: {
    apiKey: "674bb92b22068b6dd9fd050faac8c92c",
    indexName: "milvus",
    algoliaOptions: {} // Optional, if provided by Algolia
  },

  markdownPlugins: [taskLists]
};

module.exports = siteConfig;
