import React from 'react';
import { graphql } from 'gatsby';
import {
  Link,
  useI18next,
} from "gatsby-plugin-react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
// import Seo from '../components/seo';
import notFound from '../images/404/404.svg';
import notFound_mobile from '../images/404/404-mobile.svg';
import bird from '../images/404/bird.svg';
import bird_mobile from '../images/404/bird-mobile.svg';
import './404.less';

import Layout from '../components/layout/index';
import { useWindowSize } from "../http/hooks";
// import { useMobileScreen } from '../hooks';

const NotFoundPage = () => {
  const { t } = useI18next();
  const currentSize = useWindowSize();
  const isMobile = ["phone", "tablet"].includes(currentSize);

  return (
    <Layout t={t}>
      {/* <Seo title="404: Not found" /> */}
      <div className="notfound-container">
        <div className="notfount-center-wrapper">
          <img src={isMobile ? notFound_mobile : notFound} alt="not found" />
          <div className="notfound-titlebar">
            <h1 className="notfound-title">{t('v3trans.404.title')}</h1>
            <img
              className="notfound-icon"
              src={isMobile ? bird_mobile : bird}
              alt="milvus icon"
            />
          </div>

          <p className="notfound-content">
            {t('v3trans.404.desc1')}
          </p>
          <p className="notfound-content">
            {t('v3trans.404.desc2')}
          </p>
          <Link
            to={'/'}
            className="notfound-button"
            children={
              <>
                <FontAwesomeIcon icon={faChevronLeft} />
                <span>{t('v3trans.404.gobtn')}</span>
              </>
            }
          />
        </div>
      </div>
    </Layout>
  );
};
export default NotFoundPage;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          data
          language
          ns
        }
      }
    }
  }
`;