/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

function SEO({
  description,
  lang,
  meta,
  title,
  titleTemplate = '',
  link,
  script,
}) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  );

  const metaDescription = description || site.siteMetadata.description;
  const _titleTemplate = titleTemplate || `%s ${site.siteMetadata.title}`;

  return (
    <Helmet
      htmlAttributes={{
        lang: lang === 'cn' ? 'zh-cn' : lang,
      }}
      title={title}
      titleTemplate={_titleTemplate}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          name: `image`,
          property: 'og:image',
          content: 'https://assets.zilliz.com/meta_image_milvus_d6510e10e0.png',
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(meta)}
      link={[].concat(link || {})}
      script={script}
    >
      <script
        src="https://tag.clearbitscripts.com/v1/pk_9b83069276f2350591e46955085ee5a8/tags.js"
        referrerpolicy="strict-origin-when-cross-origin"
      ></script>
      <script
        src="//js.hsforms.net/forms/embed/v2.js"
        type="text/javascript"
        charset="utf-8"
      ></script>
      <script
        async
        src="https://widget.kapa.ai/kapa-widget.bundle.js"
        data-website-id="d6d677b7-21a8-41fb-9990-b43e8c8e744f"
        data-project-name="Milvus"
        data-project-color="#1493cc"
        data-project-logo="https://miro.medium.com/v2/resize:fit:2400/1*-VEGyAgcIBD62XtZWavy8w.png"
        data-modal-disclaimer="This is a custom LLM for Milvus with access to all Milvus docs, Zilliz docs, GitHub Discussions and Issues, and the Zilliz GitHub repository."
        data-modal-example-questions="How do I create a search pipeline in Zilliz?,Help me insert entities in my Milvus database"
        data-kapa-branding-hide="true"
      ></script>
    </Helmet>
  );
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
};

export default SEO;
