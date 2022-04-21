// gatsby page query
// https://www.gatsbyjs.com/docs/how-to/querying-data/page-query/

module.exports = `
{
  allMarkdownRemark(
    filter: {
      fileAbsolutePath: { regex: "/(?:site|blog|communityArticles)/" }
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
          group
          recommend
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
      relativeDirectory: { regex: "/(?:menuStructure|community)/" }
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
      }
    }
  }
}
`;
