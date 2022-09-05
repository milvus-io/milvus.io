import {
  generateAvailableDocVersions,
  getCurVersionHomeMd,
  generateApiData,
  generateDocsData,
  generateCurVersionMenu,
} from '../../utils/milvus';
import HomeContent from '../../parts/docs/homeContent';
import DocContent from '../../parts/docs/DocContent';
import { markdownToHtml } from '../../utils/common';

import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../../components/layout';
import { mdMenuListFactory } from '../../components/leftNavigation/utils';
import clsx from 'clsx';
import Aside from '../../components/aside';
import Footer from '../../components/footer';
import {
  useCodeCopy,
  useMultipleCodeFilter,
  useFilter,
} from '../../hooks/doc-dom-operation';
import { useGenAnchor } from '../../hooks/doc-anchor';
import { useOpenedStatus } from '../../hooks';
import { recursionUpdateTree } from '../../utils/docUtils';
import MenuTree from '../../components/tree';
import classes from '../../styles/docHome.module.less';

export default function DocHomePage(props) {
  const { homeData, blogs = [], menus, version } = props;

  const { t } = useTranslation('common');

  const [isOpened, setIsOpened] = useState(false);
  const [menuTree, setMenuTree] = useState(menus);

  const newestBlog = useMemo(() => {
    return blogs[0];
  }, [blogs]);

  const components = {
    img: props => (
      // height and width are part of the props, so they get automatically passed here with {...props}
      <Image {...props} layout="responsive" loading="lazy" />
    ),
  };

  const handleNodeClick = (nodeId, parentIds, isPage = false) => {
    // const updatedTree = isPage
    //   ? handleClickMenuPageItem(menus, nodeId, parentIds)
    //   : handleClickPureMenuItem(menus, nodeId, parentIds);
    const updatedTree = recursionUpdateTree(
      menuTree,
      nodeId,
      parentIds,
      isPage
    );
    setMenuTree(updatedTree);
  };

  return (
    <Layout t={t} showFooter={false} headerClassName="docHeader">
      <div
        className={clsx('doc-temp-container', {
          [`home`]: homeData,
        })}
      >
        <div className={classes.menuContainer}>
          <MenuTree
            tree={menuTree}
            onNodeClick={handleNodeClick}
            className={classes.docMenu}
            version={version}
          />
        </div>

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

export const getStaticProps = async context => {
  const { locale } = context;

  const { versions, newestVersion } = generateAvailableDocVersions();
  const md = getCurVersionHomeMd(newestVersion, locale);
  const apiMenus = generateApiData('pymilvus');
  const docMenus = generateCurVersionMenu(newestVersion, locale);
  const data = generateDocsData();
  const { tree } = await markdownToHtml(md, {
    showAnchor: false,
    newestVersion,
  });

  return {
    props: {
      homeData: tree,
      version: newestVersion,
      locale,
      versions,
      blogs: [],
      menus: docMenus,
    },
  };
};
