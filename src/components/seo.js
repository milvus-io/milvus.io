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
  script = [],
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
        data-project-color="#00a1ea"
        data-project-logo="https://miro.medium.com/v2/resize:fit:2400/1*-VEGyAgcIBD62XtZWavy8w.png"
        data-modal-disclaimer="This is an experimental generative AI chatbot trained on public documentation,  github repository, and other contents. Feel free to ask me anything about Milvus and Zilliz Cloud! Notice: the answers that bot provides might not always be accurate or up-to-date. Please use your best judgement when evaluating its responses. Also, please refrain from sharing any personal or private information with the bot."
        data-modal-example-questions="Get Started with Milvus,What's new in Milvus 2.4?,How to choose embedding model?,How to conduct a search in Milvus?"
        data-kapa-branding-hide="true"
        data-button-text="Ask Milvus AI"
        data-modal-size="958px"
        data-font-family="Inter"
        data-button-image-height="40"
        data-button-image-width="40"
        data-button-padding="8px 12px"
        data-button-border-radius="35px"
        data-button-width="fit-content"
        data-button-height="auto"
        data-button-bg-color="#fff"
        data-button-border="1px solid #00a1ea"
        data-button-text-shadow="rgba(0, 0, 0, 0) 0px 0px 0px"
        data-button-text-color="#00a1ea"
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
