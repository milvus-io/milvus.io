import docUtils from '../../../utils/docs.utils';
import HomeContent from '../../../parts/docs/homeContent';
import DocContent from '../../../parts/docs/DocContent';
import { markdownToHtml, copyToCommand } from '../../../utils/common';
import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../../../components/layout';
import { linkIconTpl } from '../../../components/icons';
import clsx from 'clsx';
import Aside from '../../../components/aside';
import Footer from '../../../components/footer';
import {
  useCopyCode,
  useFilter,
  useMultipleCodeFilter,
} from '../../../hooks/enhanceCodeBlock';
import { useGenAnchor } from '../../../hooks/doc-anchor';
import { recursionUpdateTree, getMenuInfoById } from '../../../utils/docUtils';
import LeftNavSection from '../../../parts/docs/leftNavTree';
import classes from '../../../styles/docHome.module.less';

export default function DocDetailPage(props) {
  const { homeData, menus, version, versions, locale, id: currentId } = props;
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
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const pageHref = useRef('');

  const components = {
    img: props => (
      // height and width are part of the props, so they get automatically passed here with {...props}
      <Image {...props} layout="responsive" loading="lazy" />
    ),
  };

  const handleNodeClick = (nodeId, parentIds, isPage = false) => {
    const updatedTree = recursionUpdateTree(
      menuTree,
      nodeId,
      parentIds,
      isPage
    );
    setMenuTree(updatedTree);
  };

  useEffect(() => {
    // active initial menu item
    const currentMenuInfo = getMenuInfoById(menus, currentId);
    if (!currentMenuInfo) {
      return;
    }
    handleNodeClick(currentId, currentMenuInfo.parentIds, true);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // add click event handler for copy icon after headings
    if (window && typeof window !== 'undefined') {
      const anchors = Array.from(document.querySelectorAll('.anchor-icon'));
      const baseHref = window.location.href.split('#')[0];

      anchors.forEach(anchor => {
        anchor.addEventListener(
          'click',
          e => {
            if (!e.currentTarget) {
              return;
            }
            const {
              dataset: { href },
            } = e.currentTarget;
            pageHref.current = `${baseHref}${href}`;
            copyToCommand(pageHref.current);

            anchor.innerHTML = '<span class="tip">copied</span>';

            setTimeout(() => {
              anchor.innerHTML = linkIconTpl;
            }, 3000);
          },
          false
        );
      });
    }
    // close mask when router changed
    isOpenMobileMenu && setIsOpenMobileMenu(false);
    // no need to watch 'isOpenMobileMenu'
    // eslint-disable-next-line
  }, [currentId]);

  useFilter();
  useMultipleCodeFilter(currentId);
  useCopyCode(codeList);
  useGenAnchor(version, editPath);

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
            linkSurfix="home"
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
              mdId={currentId}
              trans={t}
              commitPath={editPath}
            />
            <div className="doc-toc-container">
              <Aside
                locale={locale}
                version={version}
                editPath={editPath}
                mdTitle={frontmatter.title}
                category="doc"
                items={anchorList}
                title={t('v3trans.docs.tocTitle')}
                classes={{
                  root: classes.rightAnchorTreeWrapper,
                }}
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
        summary: frontmatter.summary || '',
        editPath,
        frontmatter,
      },
      version,
      locale,
      versions,
      menus: docMenus,
      id: slug,
    },
  };
};
