const { findLang, generatePath } = require('./utils');

// check is blog
const checkIsblog = path => path.includes('blog');

// generate default blog cover according to blog's date
const generateDefaultBlogCover = (date, coverList = []) => {
  const coverImgList = [
    'zilliz-cms.s3.us-west-2.amazonaws.com/pc_blog_2_9e3f35962c.jpg',
    'zilliz-cms.s3.us-west-2.amazonaws.com/pc_blog_8ed7696269.jpg',
  ].concat(coverList);
  const day = new Date(date).getDay();
  return day % 2 === 0 ? coverImgList[0] : coverImgList[1];
};

const filterMDwidthBlog = edges => {
  return edges.filter(({ node }) => {
    const isBlog = node.fileAbsolutePath.includes(
      '/blogs/versions/master/blog'
    );
    // only when the value of isPublish is false it will be filtered
    const isPublish = node.frontmatter.isPublish !== false;
    return isBlog && isPublish;
  });
};

const filterAndSortBlogs = (list, lang) => {
  return list
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter(i => i.fileLang === lang);
};

const generateBlogArticlePage = (
  createPage,
  {
    nodes: blogMD,
    template: blogTemplate,
    listTemplate: blogListTemplate,
    versions,
  }
) => {
  const generateTags = tag => {
    if (!tag) return [];
    return tag.split(',').map(i => i && i.trim() && i.trim().toLowerCase());
  };
  // get blogs list data, create blogs list page
  const list = blogMD.map(({ node }) => {
    const fileAbsolutePath = node.fileAbsolutePath;
    const fileLang = findLang(fileAbsolutePath);

    const [date, tag = '', title, desc, id, cover, isRecommend = false] = [
      node.frontmatter.date,
      node.frontmatter.tag,
      node.frontmatter.title,
      node.frontmatter.desc,
      node.frontmatter.id,
      node.frontmatter.cover,
      node.frontmatter.recommend,
    ];

    return {
      date,
      tags: generateTags(tag),
      desc: desc || '',
      title,
      id,
      cover: cover || generateDefaultBlogCover(date),
      fileLang,
      isRecommend,
    };
  });

  const allBlogsList = {
    cn: filterAndSortBlogs(list, 'cn'),
    en: filterAndSortBlogs(list, 'en'),
  };
  for (const key in allBlogsList) {
    createPage({
      path: key === 'cn' ? `/${key}/blog` : `/blog`,
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
    const localizedPath = generatePath(fileId, fileLang, null, isBlog, true);
    const newHtml = node.html;
    const [date, tag = '', origin, author, title, id, desc, cover] = [
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
      ownerNodeId: node.id,
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
        allVersion: versions,
        headings: node.headings.filter(v => v.depth < 4 && v.depth >= 1),
      },
    });
  });
};

module.exports = {
  checkIsblog,
  generateDefaultBlogCover,
  generateBlogArticlePage,
  filterMDwidthBlog,
};
