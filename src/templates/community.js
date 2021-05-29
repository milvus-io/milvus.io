import React from 'react';
// import { graphql } from 'gatsby';
// import SEO from '../components/seo';

export default function CommunityTemplate({
  // data,
  pageContext, // this prop will be injected by the GraphQL query below.
}) {
  console.log('page content', pageContext);
  // let { locale, newHtml, fileAbsolutePath } = pageContext;

  // if (!data.allFile.edges[0]) {
  //   return null;
  // }

  // const idRegex = /id=".*?"/g;
  // if (locale === 'cn') {
  //   if (newHtml) {
  //     newHtml = newHtml.replace(idRegex, match =>
  //       // eslint-disable-next-line
  //       match.replace(/[？|、|，]/g, '')
  //     );
  //   }
  // }

  // const title = 'Community';

  return (
    <>
      {/* <SEO title={title} lang={locale} /> */}
      {/* <section dangerouslySetInnerHTML={{ __html: newHtml }}></section> */}
      community template
    </>
  );
}

// export const communityQuery = graphql`
//   query CommunityQuery {
//     markdownRemark {
//       frontmatter {
//         id
//         title
//       }
//     }
//   }
// `;
