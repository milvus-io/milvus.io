const locales = require("../src/consts/locales");
const fs = require("fs");
const { start } = require("repl");
const env = process.env.IS_PREVIEW;
const HTMLParser = require("node-html-parser");

// const env = 'preview';

// createPages: graphql query
const query = `
{
  allMarkdownRemark(
    filter: {
      fileAbsolutePath: { regex: "/(?:site|blog|communityArticles|bootcampArticles)/" }
    }
  ) {
    edges {
      node {
        headings {
          value
          depth
        }
        frontmatter {
          related_key
          summary
          date
          author
          tag
          title
          origin
          cover
          desc
          isPublish
          id
        }
        fileAbsolutePath
        html
      }
    }
  }
  allApIfile {
    nodes {
      abspath
      name
      doc
      version
      category
      docVersion
      labels
      isDirectory
      title
      order
    }
  }
  allFile(
    filter: {
      relativeDirectory: { regex: "/(?:menuStructure|home|community|bootcamp)/" }
      extension: { eq: "json" }
    }
  ) {
    edges {
      node {
        absolutePath
        childCommunity {
          menuList {
            id
            isMenu
            label1
            label2
            label3
            order
            title
          }
          banner {
            img {
              publicURL
            }
            alt
            href
          }
          mailingSection {
            title
            list {
              link
              title
            }
          }
          joinSection {
            list {
              img {
                publicURL
              }
              label
              link
            }
            title
          }
          contributorSection {
            title,
            list {
              avatar {
                publicURL
              }
              name
              company
              jobTitle
            }
          }
          partnerSection {
            list {
              alt
              img {
                publicURL
              }
            }
            title
          }
          recommendSection {
            ambassador {
              desc
              introBtn {
                label
                link
              }
              joinBtn {
                label
                link
              }
              title
              img {
                publicURL
              }
            }
            deploy {
              list {
                label
                link
              }
              title
            }
            develop {
              list {
                label
                link
              }
              title
            }
            start {
              list {
                label
                link
              }
              title
            }
            test {
              list {
                label
                link
              }
              title
            }
            title
          }
          resourceSection {
            list {
              desc
              iconType
              label
              link
              title
            }
            title
          }
          aboutSection {
            content
            title
            list {
              desc
              iconType
              title
            }
          }
        }
        childMenu {
          menuList {
            id
            isMenu
            label1
            label2
            label3
            order
            outLink
            title
          }
        }
        
        childBootcamp {
          menuList {
            isMenu
            id
            label1
            label2
            label3
            order
            title
          }
          description
          banner {
            img {
              publicURL
            }
            alt
          }
          section1 {
            title
            content {
              id
              link
              title
            }
          }
          section3 {
            content {
              desc
              iconType
              id
              link
              title
              liveDemo
            }
            title
          }
          section4 {
            content {
              desc
              id
              link
              title
              iconType
            }
            title
          }
          title
        }
      }
    }
  }
}
`;

const DOC_LANG_FOLDERS = ["/en/", "/zh-CN/"];

/*
 * utils to support generate html page from markdown or json dynamically
 */
const findVersion = (str) => {
  // version: v.1.0.0 | v0.x
  const regx = /versions\/master\/([v\dx\.]*)/;
  const match = str.match(regx);
  return match
    ? match[1]
      ? match[1]
      : env === "preview" && str.includes("preview")
      ? "preview"
      : match[1]
    : "";
};

const findLang = (path) => {
  return DOC_LANG_FOLDERS.reduce((pre, cur) => {
    if (path.includes(cur)) {
      pre = cur === "/en/" ? "en" : "cn";
    }
    return pre;
  }, "");
};

const checkIsblog = (path) => path.includes("blog");

const checkIsBenchmark = (path) => path.includes("benchmarks");

const getDefaultLang = () =>
  Object.keys(locales).find((lang) => locales[lang].default);

const getCommunityPath = (fileId, fileLang) => {
  const defaultLang = getDefaultLang();
  return fileLang === defaultLang
    ? `/community/${fileId}`
    : `${fileLang}/community/${fileId}`;
};

const getBootcampPath = (fileId, fileLang) => {
  const defaultLang = getDefaultLang();
  return fileLang === defaultLang
    ? `/bootcamp/${fileId}`
    : `${fileLang}/bootcamp/${fileId}`;
};

// we generate path by menu structure
const generatePath = (
  id,
  lang,
  version,
  isBlog,
  needLocal = true,
  isBenchmark
) => {
  const defaultLang = getDefaultLang();
  if (isBenchmark) {
    return lang === defaultLang ? `/docs/${id}` : `${lang}/docs/${id}`;
  }
  if (isBlog) {
    if (!needLocal) return `/blog/${id}`;
    return lang === defaultLang ? `/blog/${id}` : `/${lang}/blog/${id}`;
  }

  let localizedPath = "";
  if (version && version !== "master") {
    localizedPath =
      lang === defaultLang ? `/docs/${version}/` : `/${lang}/docs/${version}/`;
  } else {
    // for master branch version -> false
    localizedPath = lang === defaultLang ? `/docs/` : `/${lang}/docs/`;
  }

  return needLocal ? `${localizedPath}${id}` : `/${id}`;
};

const getVersionsWithHome = (homeData) => {
  return homeData.map((data) => data.version);
};

// generate default blog cover according to blog's date
const generateDefaultBlogCover = (date, coverList = []) => {
  const coverImgList = [
    "zilliz-cms.s3.us-west-2.amazonaws.com/pc_blog_2_9e3f35962c.jpg",
    "zilliz-cms.s3.us-west-2.amazonaws.com/pc_blog_8ed7696269.jpg",
  ].concat(coverList);
  const day = new Date(date).getDay();
  return day % 2 === 0 ? coverImgList[0] : coverImgList[1];
};

const getNewestVersionHomePath = (locale, path) => {
  const map = {
    en: `/docs`,
    cn: `/${locale}/docs`,
  };
  return map[locale];
};

const getNormalVersionHomePath = (version, locale, path) => {
  const map = {
    en: `/docs/${version}`,
    cn: `/${locale}/docs/${version}`,
  };
  return map[locale];
};

/**
 * generate all menus nodes from allFile
 * @param {array} edges allFile.edges from graphql query response
 * @returns {array} {nodes} for all menus in doc page
 */
const generateAllMenus = (edges) => {
  return edges
    .filter(({ node: { childMenu } }) => childMenu !== null)
    .map(({ node: { absolutePath, childMenu } }) => {
      let lang = absolutePath.includes("/en/") ? "en" : "cn";
      const isBlog = absolutePath.includes("blog");
      const version = findVersion(absolutePath) || "master";
      const menuStructureList = (childMenu && [...childMenu.menuList]) || [];
      const menuList = [...menuStructureList];
      return {
        lang,
        version,
        isBlog,
        menuList,
        absolutePath,
      };
    });
};

/**
 * generate home data nodes from allFile
 * @param {array} edges allFile.edges from graphql query response
 * @returns {array} {nodes} for home data in doc page
 */
const generateHomeData = (edges) => {
  return edges
    .filter(({ node: { childDocHome } }) => childDocHome !== null)
    .map(({ node: { absolutePath, childDocHome } }) => {
      const language = absolutePath.includes("/en") ? "en" : "cn";
      const version = findVersion(absolutePath) || "master";

      const data = childDocHome;
      return {
        language,
        data,
        version,
        path: absolutePath,
      };
    });
};

/**
 * remove useless md file blog without version
 * @param {*} edges allMarkdownRemark.edges from graphql query response
 * @returns {array} {nodes} for md file with version
 */
const filterMdWithVersion = (edges) => {
  return edges.filter(({ node: { fileAbsolutePath, frontmatter } }) => {
    /**
     * Filter correct md file by version.
     * Drop md file with no version or older than v1.0.0 (except v0.x).
     * @param {string} path File absolute path.
     * @returns {boolean} If this md should be dropped or not.
     */
    const filterVersion = (path) => {
      const mdVersion = findVersion(path);
      if (mdVersion?.startsWith("v0.") && !mdVersion?.startsWith("v0.x"))
        return false;
      return !!mdVersion;
    };
    return (
      (filterVersion(fileAbsolutePath) ||
        fileAbsolutePath.includes("/docs/versions/master/common") ||
        (fileAbsolutePath.includes("/docs/versions/master/preview/") &&
          env === "preview") ||
        fileAbsolutePath.includes("communityArticles") ||
        fileAbsolutePath.includes("bootcampArticles") ||
        fileAbsolutePath.includes("/docs/versions/benchmarks/")) &&
      frontmatter.id &&
      frontmatter.id !== "home.md"
    );
  });
};

const filterMDwidthBlog = (edges) => {
  return edges.filter(({ node }) => {
    const isBlog = node.fileAbsolutePath.includes(
      "/blogs/versions/master/blog"
    );
    // only when the value of isPublish is false it will be filtered
    const isPublish = node.frontmatter.isPublish !== false;
    return isBlog && isPublish;
  });
};

// converte home.json to md, filter all files and it's corresponding version
const filterHomeMdWithVersion = (edges) => {
  const filterVersion = (path) => {
    const mdVersion = findVersion(path);
    if (mdVersion?.startsWith("v0.") && !mdVersion?.startsWith("v0.x"))
      return false;
    return !!mdVersion;
  };

  return edges.reduce((acc, cur) => {
    const {
      node: { fileAbsolutePath, frontmatter, html },
    } = cur;

    if (filterVersion(fileAbsolutePath) && frontmatter.id === "home.md") {
      const version = findVersion(fileAbsolutePath) || "master";
      const fileLang = findLang(fileAbsolutePath);
      acc.push({
        language: fileLang,
        html,
        path: fileAbsolutePath,
        version,
      });
    }
    return acc;
  }, []);
};

/**
 * filter out community menus from allMarkdownRemark
 * get community page data: articles md
 * @param {array} edges allMarkdownRemark.edges from graphql query response
 * @returns {array} {nodes} for community md file
 */
const filterCommunityMd = (edges) => {
  return edges.filter(
    ({ node: { fileAbsolutePath, frontmatter } }) =>
      fileAbsolutePath.includes("communityArticles") && frontmatter.id
  );
};

/**
 * filter out community menus from allFile
 * get community page data: menu
 * @param {*} edges allFile.edges from graphql query response
 * @returns {array} {nodes} for community menus
 */
const filterCommunityMenus = (edges) => {
  return edges
    .filter(
      ({ node: { childCommunity } }) =>
        childCommunity !== null && childCommunity.menuList !== null
    )
    .map(({ node: { absolutePath, childCommunity } }) => {
      const lang = absolutePath.includes("/en/") ? "en" : "cn";
      const menuList = childCommunity.menuList || [];
      return {
        lang,
        menuList,
      };
    });
};

/**
 * filter out community menus from allFile
 * get community page data: home
 * @param {*} edges allMarkdownRemark.edges from graphql query response
 * @returns  {array} {nodes} for community home
 */
const filterCommunityHome = (edges) => {
  return edges.filter(
    ({ node: { fileAbsolutePath, frontmatter } }) =>
      frontmatter.id && fileAbsolutePath.includes("communityHome")
  );
};

const filterBootcampMd = (edges) => {
  return edges.filter(
    ({ node: { fileAbsolutePath, frontmatter } }) =>
      fileAbsolutePath.includes("bootcampArticles") && frontmatter.id
  );
};

const filterBootcampMenus = (edges) => {
  return edges
    .filter(
      ({ node: { childBootcamp } }) =>
        childBootcamp !== null && childBootcamp.menuList !== null
    )
    .map(({ node: { absolutePath, childBootcamp } }) => {
      const lang = absolutePath.includes("/en/") ? "en" : "cn";
      const menuList = childBootcamp.menuList || [];
      return {
        lang,
        menuList,
      };
    });
};

const filterBootcampHome = (edges) => {
  return edges
    .filter(
      ({ node: { childBootcamp, absolutePath } }) =>
        childBootcamp !== null && absolutePath.includes("bootcampHome")
    )
    .map(({ node: { absolutePath, childBootcamp } }) => {
      const language = absolutePath.includes("/en") ? "en" : "cn";
      const data = childBootcamp;
      return {
        language,
        data,
        path: absolutePath,
      };
    });
};

/**
 * get community page data: articles md, menu and home json
 * @param {array} allMarkdownRemark allMarkdownRemark.edges from graphql query response
 * @param {array} allFile allFile.edges from graphql query response
 * @returns {object} { communityMd, communityMenu, communityHome }
 */
const handleCommunityData = (allMarkdownRemark, allFile) => {
  const communityMd = filterCommunityMd(allMarkdownRemark);
  const communityMenu = filterCommunityMenus(allFile);
  const communityHome = filterCommunityHome(allMarkdownRemark);
  return { communityMd, communityMenu, communityHome };
};

const handleBootcampData = (allMarkdownRemark, allFile) => {
  const bootcampHome = filterBootcampHome(allFile);
  const bootcampMenu = filterBootcampMenus(allFile);
  const bootcampMd = filterBootcampMd(allMarkdownRemark);
  return { bootcampHome, bootcampMenu, bootcampMd };
};

/**
 * generate global search file
 * `${rootDirName}/src/search.json`
 * @param {*} markdown md nodes
 * @param {*} newestVersion latest doc version
 * @param {*} rootDirName root path for search.json location
 */
const initGlobalSearch = (markdown, newestVersion, rootDirName) => {
  const flatten = (arr) =>
    arr
      .map(({ node: { frontmatter, fileAbsolutePath, headings } }) => {
        const fileLang = findLang(fileAbsolutePath);
        const version = findVersion(fileAbsolutePath) || "master";
        const headingVals = headings.map((v) => v.value);
        const isBlog = checkIsblog(fileAbsolutePath);
        const isBenchmark = checkIsBenchmark(fileAbsolutePath);
        const keywords = frontmatter.keywords
          ? frontmatter.keywords.split(",")
          : [];
        if (keywords.length) {
          console.log(keywords);
        }
        return {
          ...frontmatter,
          fileLang,
          version,
          path: generatePath(
            frontmatter.id,
            fileLang,
            version,
            isBlog,
            false,
            isBenchmark
          ),
          // the value we need compare with search query
          values: [...headingVals, frontmatter.id, ...keywords],
        };
      })
      .filter((data) => data.version === newestVersion);

  const fileData = flatten(markdown);
  fs.writeFile(
    `${rootDirName}/src/search.json`,
    JSON.stringify(fileData),
    (err) => {
      if (err) throw err;
      console.log("It's saved!");
    }
  );
};

/**
 * create community pages
 * @param {function} createPage gatsby createPage action
 * @param {object} metadata nodes, template and menu
 */
const generateCommunityPages = (
  createPage,
  { nodes: communityMd, template: communityTemplate, menu: communityMenu }
) => {
  communityMd.forEach(({ node }) => {
    const {
      fileAbsolutePath,
      html,
      frontmatter: { id: fileId },
    } = node;

    const fileLang = findLang(fileAbsolutePath);
    const path = getCommunityPath(fileId, fileLang);
    const editPath = fileAbsolutePath.split(
      fileLang === "en" ? "/en/" : "/zh-CN/"
    )[1];

    createPage({
      path,
      component: communityTemplate,
      context: {
        locale: fileLang,
        fileAbsolutePath,
        html,
        headings: node.headings.filter((v) => v.depth < 4 && v.depth > 1),
        menuList: communityMenu,
        homeData: null,
        activePost: fileId,
        editPath,
        isCommunity: true,
      },
    });
  });
};

const generateBootcampPages = (
  createPage,
  { nodes: bootcampMd, template: bootcampTemplate, menu: bootcampMenu }
) => {
  bootcampMd.forEach(({ node }) => {
    const {
      fileAbsolutePath,
      html,
      frontmatter: { id: fileId },
    } = node;

    const fileLang = findLang(fileAbsolutePath);
    const path = getBootcampPath(fileId, fileLang);

    createPage({
      path,
      component: bootcampTemplate,
      context: {
        locale: fileLang,
        fileAbsolutePath,
        html,
        headings: node.headings.filter((v) => v.depth < 4 && v.depth > 1),
        menuList: bootcampMenu,
        bootcampData: null,
        activePost: fileId,
      },
    });
  });
};

/**
 * create community home
 * @param {function} createPage gatsby createPage action
 * @param {object} metadata nodes, template and menu
 */
const generateCommunityHome = (
  createPage,
  { nodes: communityHome, template: communityTemplate, menu: communityMenu }
) => {
  communityHome.forEach(({ node }) => {
    const {
      fileAbsolutePath,
      frontmatter: { id: fileId },
      html,
    } = node;
    const fileLang = findLang(fileAbsolutePath);
    createPage({
      path: fileLang === "en" ? "/community" : `/${fileLang}/community`,
      component: communityTemplate,
      context: {
        locale: fileLang,
        fileAbsolutePath,
        html,
        headings: [],
        menuList: communityMenu,
        activePost: fileId,
        editPath: null,
        isCommunity: true,
      },
    });
  });
};

const generateBootcampHome = (
  createPage,
  { nodes: bootcampHome, template: bootcampTemplate, menu: bootcampMenu }
) => {
  bootcampHome.forEach(({ language, data, path }) => {
    createPage({
      path: language === "en" ? "/bootcamp" : `/${language}/bootcamp`,
      component: bootcampTemplate,
      context: {
        bootcampData: data,
        locale: language,
        old: "home",
        fileAbsolutePath: path,
        newHtml: null,
        menuList: bootcampMenu,
        isVersionWithHome: false,
        activePost: "bootcamp",
      },
    });
  });
};

/**
 * Generate a prettier title from menu's category or name.
 * @param { object } param0 { category, name, isDirectory = false, labels = [] }
 * @returns A prettier title.
 */
const generateTitle = ({
  title,
  category,
  name,
  isDirectory = false,
  labels = [],
}) => {
  /**
   * Capitalize string.
   * "home" => "Hone"
   * "exception/index" => "Index"
   * @param {string} s String will be capitalized.
   * @returns {string} Capitalized string.
   */
  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    const result = s.split("/").pop();
    const resultList = result
      .split(" ")
      .map((i) => i.charAt(0).toUpperCase() + i.slice(1));
    return resultList.join(" ");
  };
  if (title) return capitalize(title);
  const titleMapping = {
    pymilvus: "Python",
    "pymilvus-orm": "Python (ORM)",
    go: "Go",
    java: "Java",
    node: "Node",
  };
  const [, label2 = ""] = labels;
  // Return name if the menu is a 3rd level menu(such as: API => java => exception)
  // Return category name if the menu is a 1st or 2nd level menu(such as: API, API => java)
  let prettierCategory = label2
    ? capitalize(name)
    : titleMapping[category] || capitalize(category);
  // return prettier category name if directory
  if (isDirectory) return prettierCategory;
  switch (category) {
    // return prettier category name if single page
    // case 'pymilvus':
    case "go":
      return prettierCategory;
    case "node":
      return capitalize(name.split(".htm")[0]?.split(".")?.pop());
    // return 3rd level items prettier name
    default:
      return capitalize(name.split(".htm")[0]);
  }
};

/**
 * generate full api menus for doc template and api doc template
 * left menus are composed with home, api menus and all other menus
 * @param {array} nodes api menus nodes from allApIfile.nodes
 * @returns {array} filtered and formatted api menus
 */
const generateApiMenus = (nodes) => {
  /**
   * Calculate the order of menu item. 0 is default.
   * @param {object} param0 Data to calculate item order.
   * @returns {number} Order.(-1 is first of all, then 0, 1, 2 ...)
   */
  const calculateOrder = ({ category, name = "", order }) => {
    // java > package-tree.html & package-summary.html should be first.
    if (category === "java" && name.includes("package-")) return -1;
    return order;
  };
  return nodes.reduce(
    (prev, item) => {
      const {
        name,
        category,
        version,
        docVersion,
        labels,
        isDirectory,
        title,
        order,
      } = item;
      const [label1 = "api_reference", label2 = "", label3 = ""] = labels;
      const menuItem = {
        // Use "_" instead of "-" in both api menu's id and api page's name.
        // Due to a search algorithm use the word splited by "-".
        // https://github.com/milvus-io/www.milvus.io/blob/4e60f5f08e8e2b3ed02a352c4cc6ea28488b8d33/src/components/menu/index.jsx#L9
        // https://github.com/milvus-io/www.milvus.io/blob/ef727f7abcfe95c93df139a7f332ddf03eae962d/src/components/docLayout/index.jsx#L116
        // "id" should be same with "name" in generateApiReferencePages
        id: isDirectory
          ? name.replace("-", "_")
          : `${category.replace("-", "_")}_${name.replace("-", "_")}`,
        title: generateTitle({ title, name, category, isDirectory, labels }),
        lang: null,
        label1,
        label2,
        label3,
        order: calculateOrder({ category, name, order }),
        isMenu: isDirectory,
        outLink: null,
        isApiReference: true,
        url: `/api-reference/${category}/${version}/${name}`,
        category,
        apiVersion: version,
        docVersion,
      };
      return [...prev, menuItem];
    },
    // initial item is the first level menu: api_reference
    [
      {
        id: "api_reference",
        title: "API Reference",
        lang: null,
        label1: "",
        label2: "",
        label3: "",
        order: -1,
        isMenu: true,
        outLink: null,
        i18n: {
          title: { en: "API Reference", cn: "API 参考" },
        },
      },
    ]
  );
};

/**
 * create api reference pages
 * @param {function} createPage gatsby createPage action
 * @param {object} metadata nodes, template, allMenus, allApiMenus, versions and newestVersion
 */
const generateApiReferencePages = (
  createPage,
  {
    nodes,
    template: apiDocTemplate,
    allMenus,
    allApiMenus,
    versions,
    newestVersion,
    versionsWithHome,
  }
) => {
  nodes.forEach(
    ({ abspath, doc, name, version, category, docVersion, isDirectory }) => {
      // Should ignore if the node is a directory.
      if (isDirectory) return;
      // Create default language page.
      createPage({
        path: `/api-reference/${category}/${version}/${name}`,
        component: apiDocTemplate,
        context: {
          locale: "en",
          abspath,
          doc,
          // Use "_" instead of "-" in both api menu's id and api page's name.
          // Due to a search algorithm use the word splited by "-".
          // https://github.com/milvus-io/www.milvus.io/blob/4e60f5f08e8e2b3ed02a352c4cc6ea28488b8d33/src/components/menu/index.jsx#L9
          // https://github.com/milvus-io/www.milvus.io/blob/ef727f7abcfe95c93df139a7f332ddf03eae962d/src/components/docLayout/index.jsx#L116
          // "name" should be same with "id" in generateApiMenus
          name: `${category.replace("-", "_")}_${name.replace("-", "_")}`,
          allApiMenus,
          allMenus,
          version,
          docVersion,
          docVersions: Array.from(versions),
          category,
          newestVersion,
          isVersionWithHome: versionsWithHome.includes(docVersion?.[0]),
        },
      });
      // Temporarily create cn page.
      createPage({
        path: `/cn/api-reference/${category}/${version}/${name}`,
        component: apiDocTemplate,
        context: {
          locale: "cn",
          abspath,
          doc,
          name: `${category.replace("-", "_")}_${name.replace("-", "_")}`,
          allApiMenus,
          allMenus,
          version,
          docVersion,
          docVersions: Array.from(versions),
          category,
          newestVersion,
          isVersionWithHome: versionsWithHome.includes(docVersion?.[0]),
        },
      });
    }
  );
};

const generateDocHomeWidthMd = (
  createPage,
  {
    nodes: homeMd,
    blogs: blogMD,
    template: docTemplate,
    allMenus,
    allApiMenus,
    versions,
    newestVersion,
    versionInfo,
  }
) => {
  // generate newest blog
  const list = blogMD.map(({ node }) => {
    const fileAbsolutePath = node.fileAbsolutePath;
    const fileLang = findLang(fileAbsolutePath);

    let [date, tag = "", title, desc, id, cover] = [
      node.frontmatter.date,
      node.frontmatter.tag,
      node.frontmatter.title,
      node.frontmatter.desc,
      node.frontmatter.id,
      node.frontmatter.cover,
    ];

    return {
      date,
      tags: tag ? tag.split(",") : [],
      desc: desc || "",
      title,
      id,
      cover: cover || generateDefaultBlogCover(date),
      fileLang,
      fileAbsolutePath,
    };
  });

  const getTwoNewestBlog = (lang) => {
    return list
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter((i) => i.fileLang === lang)
      .slice(0, 2);
  };

  const formatDocHomeHtml = (html, homePath, version) => {
    const regex = /\<a (\S*)\>/g;
    let newHtml = html.replace(regex, (link) => {
      const [start, originPath, end] = link.split('"');
      const formatPath =
        originPath.charAt(0) === "#" ||
        originPath.charAt(0) === "/" ||
        originPath.includes("http")
          ? originPath
          : `${homePath}/${originPath}`;
      return [start, formatPath, end].join('"');
    });
    return newHtml;
  };

  homeMd.forEach(({ language, html, path, version }) => {
    const isBlog = checkIsblog(path);
    const editPath = path.split(language === "en" ? "/en/" : "/zh-CN/")[1];

    if (version === newestVersion) {
      const homePath = getNewestVersionHomePath(language);
      createPage({
        path: homePath,
        component: docTemplate,
        context: {
          homeData: formatDocHomeHtml(html, homePath, version),
          locale: language,
          versions: Array.from(versions),
          newestVersion,
          version: newestVersion,
          old: "home",
          fileAbsolutePath: path,
          isBlog,
          editPath,
          allMenus,
          newHtml: null,
          allApiMenus,
          isVersionWithHome: true,
          newestBlog: getTwoNewestBlog(language),
          homePath,
        },
      });
    }

    const homePath = getNormalVersionHomePath(version, language);
    createPage({
      path: homePath,
      component: docTemplate,
      context: {
        homeData: formatDocHomeHtml(html, homePath, version),
        locale: language,
        versions: Array.from(versions),
        newestVersion,
        version,
        old: "home",
        fileAbsolutePath: path,
        isBlog,
        editPath,
        allMenus,
        newHtml: null,
        allApiMenus,
        isVersionWithHome: true,
        newestBlog: getTwoNewestBlog(language),
        homePath,
      },
    });
  });
};

/**
 * create doc pages from markdown nodes
 * @param {function} createPage gatsby createPage action
 * @param {object} metadata nodes, template, allMenus, allApiMenus, versions and newestVersion
 */
const generateAllDocPages = (
  createPage,
  {
    nodes: legalMd,
    template: docTemplate,
    newestVersion,
    versions,
    versionsWithHome,
    allMenus,
    allApiMenus,
  }
) => {
  legalMd.forEach(({ node }) => {
    const fileAbsolutePath = node.fileAbsolutePath;
    const isBlog = checkIsblog(fileAbsolutePath);
    const fileId = node.frontmatter?.id;
    const relatedKey = node.frontmatter.related_key;
    const summary = node.frontmatter.summary || "";
    let version = findVersion(fileAbsolutePath) || "master";

    const fileLang = findLang(fileAbsolutePath);
    const editPath = fileAbsolutePath.split(
      fileLang === "en" ? "/en/" : "/zh-CN/"
    )[1];
    const isBenchmark = checkIsBenchmark(fileAbsolutePath);
    const localizedPath = generatePath(
      fileId,
      fileLang,
      version,
      isBlog,
      true,
      isBenchmark
    );

    const newHtml = node.html;

    // the newest doc version is master so we need to make route without version.
    // for easy link to the newest doc
    if (version === newestVersion) {
      const masterPath = isBenchmark
        ? `/docs/$${fileId}`
        : generatePath(fileId, fileLang, isBlog ? false : "master", isBlog);
      createPage({
        path: masterPath,
        component: docTemplate,
        context: {
          locale: fileLang,
          version: newestVersion, // get master version
          versions: Array.from(versions),
          newestVersion,
          old: fileId,
          headings: node.headings.filter((v) => v.depth < 4 && v.depth >= 1),
          fileAbsolutePath,
          localizedPath,
          isBlog,
          editPath,
          allMenus,
          newHtml,
          homeData: null,
          isVersionWithHome: versionsWithHome.includes(newestVersion),
          allApiMenus,
          relatedKey,
          summary,
        }, // additional data can be passed via context
      });
    }

    // normal pages
    createPage({
      path: localizedPath,
      component: docTemplate,
      context: {
        locale: fileLang,
        version: isBenchmark ? newestVersion : version,
        versions: Array.from(versions),
        old: fileId,
        headings: node.headings.filter((v) => v.depth < 4 && v.depth >= 1),
        fileAbsolutePath,
        localizedPath,
        newestVersion,
        isBlog,
        editPath,
        allMenus,
        isBenchmark,
        newHtml,
        homeData: null,
        isVersionWithHome: versionsWithHome.includes(version),
        allApiMenus,
        relatedKey,
        summary,
      }, // additional data can be passed via context
    });
  });
};

const generateBlogArticlePage = (
  createPage,
  { nodes: blogMD, template: blogTemplate, listTemplate: blogListTemplate }
) => {
  const generateTags = (tag) => {
    if (!tag) return [];
    return tag.split(",").map((i) => i && i.trim() && i.trim().toLowerCase());
  };
  // get blogs list data, create blogs list page
  const list = blogMD.map(({ node }) => {
    const fileAbsolutePath = node.fileAbsolutePath;
    const fileLang = findLang(fileAbsolutePath);

    let [date, tag = "", title, desc, id, cover] = [
      node.frontmatter.date,
      node.frontmatter.tag,
      node.frontmatter.title,
      node.frontmatter.desc,
      node.frontmatter.id,
      node.frontmatter.cover,
    ];

    return {
      date,
      tags: generateTags(tag),
      desc: desc || "",
      title,
      id,
      cover: cover || generateDefaultBlogCover(date),
      fileLang,
    };
  });

  const filterAndSortBlogs = (list, lang) => {
    return list
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter((i) => i.fileLang === lang);
  };
  const allBlogsList = {
    cn: filterAndSortBlogs(list, "cn"),
    en: filterAndSortBlogs(list, "en"),
  };
  for (let key in allBlogsList) {
    createPage({
      path: key === "cn" ? `/${key}/blog` : `/blog`,
      component: blogListTemplate,
      context: {
        locale: key,
        blogList: allBlogsList[key],
      },
    });
  }

  // create blog detail page
  blogMD.forEach(({ node }) => {
    const fileAbsolutePath = node.fileAbsolutePath;
    const isBlog = checkIsblog(fileAbsolutePath);
    const fileId = node.frontmatter.id;
    const fileLang = findLang(fileAbsolutePath);
    const isBenchmark = checkIsBenchmark(fileAbsolutePath);
    const localizedPath = generatePath(
      fileId,
      fileLang,
      null,
      isBlog,
      true,
      isBenchmark
    );
    const newHtml = node.html;
    let [date, tag = "", origin, author, title, id, desc, cover] = [
      node.frontmatter.date,
      node.frontmatter.tag,
      node.frontmatter.origin,
      node.frontmatter.author,
      node.frontmatter.title,
      node.frontmatter.id,
      node.frontmatter.desc,
      node.frontmatter.cover,
    ];

    createPage({
      path: localizedPath,
      component: blogTemplate,
      context: {
        cover,
        locale: fileLang,
        fileAbsolutePath,
        localizedPath,
        newHtml,
        date,
        tags: generateTags(tag),
        origin,
        author,
        title,
        blogList: allBlogsList[fileLang],
        id,
        desc,
      },
    });
  });
};

module.exports = {
  query,
  findLang,
  getVersionsWithHome,
  generateAllMenus,
  generateHomeData,
  filterMdWithVersion,
  handleCommunityData,
  initGlobalSearch,
  generateCommunityPages,
  generateCommunityHome,
  generateApiMenus,
  generateApiReferencePages,
  generateBootcampPages,
  generateBootcampHome,
  handleBootcampData,
  generateAllDocPages,
  generateBlogArticlePage,
  filterMDwidthBlog,
  filterHomeMdWithVersion,
  generateDocHomeWidthMd,
};
