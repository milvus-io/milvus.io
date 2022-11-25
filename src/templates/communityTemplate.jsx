import React, { useState } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import clsx from 'clsx';
import LeftNav from '../components/leftNavigation';
import { mdMenuListFactory } from '../components/leftNavigation/utils';
import Aside from '../components/aside';
import Footer from '../components/footer';
import Seo from '../components/seo';
import { useOpenedStatus } from '../hooks';
import './communityTemplate.less';
import { findLatestVersion } from '../utils';

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
    allVersion(filter: { released: { eq: "yes" } }) {
      nodes {
        version
      }
    }
  }
`;

export default function Template({data,  pageContext }) {
  const { allVersion } = data;

  const {
    locale,
    // fileAbsolutePath,
    html,
    headings,
    menuList,
    activePost,
    editPath,
    // isCommunity,
  } = pageContext;

  const [isOpened, setIsOpened] = useState(false);
  const { language, t } = useI18next();
  useOpenedStatus(setIsOpened);

  const isHomePage = activePost === 'home.md';

  // title
  const TITLE = isHomePage
    ? `Milvus Community`
    : `${headings[0] && headings[0].value}`;
  // meta description
  const DESC = TITLE;
  // title template
  const titleTemplate = isHomePage ? '%s' : '%s - Milvus Community';

  // generate menu
  const menus = mdMenuListFactory(
    menuList?.find(menu => menu.lang === locale)?.menuList || [],
    'community',
    '',
    locale
  )();

  const version = findLatestVersion(allVersion.nodes);

  return (
    <Layout t={t} showFooter={false} headerClassName="docHeader" version={version}>
      <Seo
        title={TITLE}
        titleTemplate={titleTemplate}
        lang={language}
        description={DESC}
      />
      <div
        className={clsx('doc-temp-container', {
          [`home`]: isHomePage,
        })}
      >
        {/* TODO: "id": "#community_resources", #community_partners should be updated */}
        <LeftNav
          menus={menus}
          apiMenus={[]}
          pageType="community"
          version={''}
          locale={locale}
          versions={[]}
          mdId={isHomePage ? 'community' : activePost}
          language={language}
          trans={t}
          isOpened={isOpened}
          showSearch={false}
          onMenuCollapseUpdate={setIsOpened}
        />
        <div
          className={clsx('doc-right-container', {
            [`is-opened`]: isOpened,
          })}
        >
          <div
            className={clsx('doc-content-container', {
              [`community-home`]: isHomePage,
            })}
          >
            <div
              className={clsx({ 'doc-post-wrapper': !isHomePage }, `doc-style`)}
            >
              <div
                className={clsx({
                  [`community-home-html-wrapper`]: isHomePage,
                  [`doc-post-content`]: !isHomePage,
                })}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
            <div className="doc-toc-container">
              <Aside
                locale={locale}
                // version={version}
                editPath={editPath}
                mdTitle={headings[0]}
                category="community"
                isHome={isHomePage}
                items={headings}
                title={t('v3trans.docs.tocTitle')}
              />
            </div>
          </div>
          <Footer t={t} darkMode={false} className="doc-right-footer" />
        </div>
      </div>
    </Layout>
  );
}
