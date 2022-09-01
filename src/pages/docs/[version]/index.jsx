import {
  generateAvailableVersions,
  getCurVersionHomeMd,
  generateApiData,
  generateDocsData,
} from '../../../utils/milvus';
import HomeContent from '../../../parts/docs/homeContent';
import DocContent from '../../../parts/docs/DocContent';
import { markdownToHtml } from '../../../utils/common';

import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../../../components/layout';
import LeftNav from '../../../components/leftNavigation';
import { mdMenuListFactory } from '../../../components/leftNavigation/utils';
import clsx from 'clsx';
import Aside from '../../../components/aside';
import Footer from '../../../components/footer';
import {
  useCodeCopy,
  useMultipleCodeFilter,
  useFilter,
} from '../../../hooks/doc-dom-operation';
import { useGenAnchor } from '../../../hooks/doc-anchor';
import { useOpenedStatus } from '../../../hooks';

export default function DocHomePage(props) {
  const { homeData, blogs = [] } = props;
  const { t } = useTranslation('common');

  const [isOpened, setIsOpened] = useState(false);

  const newestBlog = useMemo(() => {
    return blogs[0];
  }, [blogs]);

  return (
    <Layout t={t} showFooter={false} headerClassName="docHeader">
      <div
        className={clsx('doc-temp-container', {
          [`home`]: homeData,
        })}
      >
        {/* <LeftNav
          homeUrl={leftNavHomeUrl}
          homeLabel={t('v3trans.docs.homeTitle')}
          menus={menus}
          pageType="doc"
          locale={locale}
          versions={versionConfig.versions}
          version={version}
          mdId={mdId}
          language={language}
          trans={t}
          group={group}
          isOpened={isOpened}
          onMenuCollapseUpdate={setIsOpened}
        /> */}
        <p>Menus</p>
        <div
          className={clsx('doc-right-container', {
            [`is-opened`]: isOpened,
          })}
        >
          <div
            className={clsx('doc-content-container', {
              [`doc-home`]: homeData,
            })}
          >
            <HomeContent
              homeData={homeData}
              newestBlog={newestBlog}
              trans={t}
            />
            <div className="doc-toc-container">
              {/* <Aside
                locale={locale}
                version={version}
                editPath={editPath}
                mdTitle={headings[0]}
                category="doc"
                isHome={!!homeData}
                items={headings}
                title={t('v3trans.docs.tocTitle')}
              /> */}
              <p>Anchors</p>
            </div>
          </div>
          <Footer t={t} darkMode={false} className="doc-right-footer" />
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths = () => {
  const versions = generateAvailableVersions();

  const paths = versions.map(v => ({
    params: { version: v },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async context => {
  const {
    params: { version },
    locale,
  } = context;

  const versions = generateAvailableVersions();
  const md = getCurVersionHomeMd(version, locale);
  const apiMenus = generateApiData('pymilvus');
  const data = generateDocsData();
  const { tree } = await markdownToHtml(md);

  return {
    props: {
      homeData: tree,
      version,
      locale,
      versions,
      blogs: [],
      menus: [],
    },
  };
};
