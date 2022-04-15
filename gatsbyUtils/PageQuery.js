// gatsby page query
// https://www.gatsbyjs.com/docs/how-to/querying-data/page-query/

module.exports = `
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
