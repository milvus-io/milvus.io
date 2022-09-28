import docUtils from '../../../utils/docs.utils';
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
import { recursionUpdateTree } from '../../../utils/docUtils';
import LeftNavSection from '../../../parts/docs/leftNavTree';
import classes from '../../../styles/docHome.module.less';
import AnchorTree from '../../../parts/docs/anchorTree';

export default function DocDetailPage(props) {
  const { homeData, blogs = [], menus, version, versions, locale, id } = props;
  const {
    tree,
    codeList,
    headingContent,
    anchorList,
    summary,
    editPath,
    frontmatter,
  } = homeData;

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
          <LeftNavSection
            tree={menuTree}
            onNodeClick={handleNodeClick}
            className={classes.docMenu}
            version={version}
            versions={versions}
            linkPrefix={`/docs`}
            linkSurfix="/home"
            locale={locale}
            trans={t}
            home={{
              label: 'Home',
              link: '/docs',
            }}
          />
        </div>
        <div
          className={clsx('doc-right-container', {
            [`is-opened`]: isOpened,
          })}
        >
          <div className={clsx('doc-content-container')}>
            <DocContent
              version={version}
              htmlContent={tree}
              mdI={id}
              trans={t}
              commitPath={editPath}
            />
            <div className="doc-toc-container">
              {/* <Aside
                locale={locale}
                version={version}
                editPath={''}
                mdTitle={headingContent}
                category="doc"
                isHome={false}
                items={anchorList}
                title={t('v3trans.docs.tocTitle')}
              /> */}
              <AnchorTree
                list={anchorList}
                t={t}
                className={classes.docAnchors}
              />
            </div>
          </div>
          <Footer t={t} darkMode={false} className="doc-right-footer" />
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths = () => {
  const { contentList } = docUtils.getAllData();
  const paths = docUtils.getDocRouter(contentList);

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async context => {
  const {
    params: { version, slug },
    locale = 'en',
  } = context;

  const { versions } = docUtils.getVerion();
  const { docData, contentList } = docUtils.getAllData();
  const {
    content,
    editPath,
    data: frontmatter,
  } = docUtils.getDocConent(contentList, version, slug);
  const docMenus = docUtils.getDocMenu(docData, version);
  const { tree, codeList, headingContent, anchorList } = await markdownToHtml(
    content,
    {
      showAnchor: true,
      version,
    }
  );

  return {
    props: {
      homeData: {
        tree,
        codeList,
        headingContent,
        anchorList,
        summary: frontmatter.summary,
        editPath,
        frontmatter,
      },
      version,
      locale,
      versions,
      blogs: [],
      menus: docMenus,
      id: slug,
    },
  };
};
