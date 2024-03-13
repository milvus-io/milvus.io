import docUtils from '@/utils/docs.utils';
import DocContent from '@/parts/docs/docContent';
import HomeContent from '@/parts/docs/docHome';
import { markdownToHtml, copyToCommand } from '@/utils/common';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { linkIconTpl } from '@/components/icons';
import Aside from '@/components/aside';
import {
  useCopyCode,
  useFilter,
  useMultipleCodeFilter,
} from '@/hooks/enhanceCodeBlock';
import { useGenAnchor } from '@/hooks/doc-anchor';
import { recursionUpdateTree, getMenuInfoById } from '@/utils/docUtils';
import LeftNavSection from '@/parts/docs/leftNavTree';
import DocLayout from '@/components/layout/docLayout';
import { ABSOLUTE_BASE_URL } from '@/consts';
import classes from '@/styles/docDetail.module.less';
import { checkIconTpl } from '@/components/icons';
import blogUtils from '@/utils/blog.utils';
import clsx from 'clsx';

const DOC_HOME_TITLE = 'Milvus vector database documentation';

export default function DocDetailPage(props) {
  const {
    homeData,
    isHome,
    blogs,
    version,
    locale,
    versions,
    newestVersion,
    menus,
    id: currentId,
  } = props;

  console.log('home detail page version--', version);

  const {
    tree,
    codeList,
    headingContent,
    anchorList,
    summary,
    editPath,
    frontMatter,
  } = homeData;

  const { t } = useTranslation('common');

  const seoInfo = useMemo(() => {
    const title = isHome ? DOC_HOME_TITLE : `${frontMatter?.title} | Milvus`;
    const url = isHome
      ? `${ABSOLUTE_BASE_URL}/docs/${version}`
      : `${ABSOLUTE_BASE_URL}/docs/${version}/${currentId}`;
    const desc = isHome ? 'Milvus Documentation' : summary;

    return {
      title,
      url,
      desc,
    };
  }, [isHome, frontMatter, version, currentId, summary]);

  const latestBlog = useMemo(() => {
    return blogs[0];
  }, [blogs]);

  const [isOpened, setIsOpened] = useState(false);
  const [menuTree, setMenuTree] = useState(menus);
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const pageHref = useRef('');

  // const handleNodeClick = (nodeId, parentIds, isPage = false) => {
  //   const updatedTree = recursionUpdateTree(
  //     menuTree,
  //     nodeId,
  //     parentIds,
  //     isPage
  //   );
  //   setMenuTree(updatedTree);
  // };

  // useEffect(() => {
  //   // active initial menu item
  //   const currentMenuInfo = getMenuInfoById(menus, currentId);
  //   if (!currentMenuInfo) {
  //     return;
  //   }
  //   handleNodeClick(currentId, currentMenuInfo.parentIds, true);
  //   // eslint-disable-next-line
  // }, []);

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

            anchor.innerHTML = checkIconTpl;

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
  useMultipleCodeFilter();
  useCopyCode(codeList);
  useGenAnchor(version, editPath);

  return (
    <>
      {isHome ? (
        <DocLayout
          isHome
          classes={{
            root: clsx(classes.docPageContainer, classes.docHomePage),
          }}
          seo={seoInfo}
          left={
            <LeftNavSection
              tree={menus}
              className={classes.docMenu}
              version={version}
              versions={versions}
              linkPrefix={`/docs`}
              locale={locale}
              home={{ label: 'Home', link: `/docs/${version}` }}
              currentMdId="home"
              latestVersion={newestVersion}
            />
          }
          center={
            <HomeContent homeData={homeData.tree} newestBlog={latestBlog} />
          }
        />
      ) : (
        <DocLayout
          seo={seoInfo}
          left={
            <LeftNavSection
              tree={menuTree}
              className={classes.docMenu}
              version={version}
              versions={versions}
              linkPrefix="/docs"
              locale={locale}
              trans={t}
              home={{
                label: 'Home',
                link: `/docs`,
              }}
              currentMdId={currentId}
              groupId={frontMatter.group}
              latestVersion={version}
            />
          }
          center={
            <section className={classes.docDetailContainer}>
              <div className={classes.contentSection}>
                <DocContent
                  version={version}
                  htmlContent={tree}
                  mdId={currentId}
                  trans={t}
                  commitPath={editPath}
                />
              </div>

              <div className={classes.asideSection}>
                <Aside
                  locale={locale}
                  version={version}
                  editPath={editPath}
                  mdTitle={frontMatter.title}
                  category="doc"
                  items={anchorList}
                  title={t('v3trans.docs.tocTitle')}
                  classes={{
                    root: classes.rightAnchorTreeWrapper,
                  }}
                />
              </div>
            </section>
          }
        />
      )}
    </>
  );
}

export const getStaticPaths = () => {
  const { newestVersion } = docUtils.getVersion();
  const { contentList } = docUtils.getAllData();
  const filteredList = contentList.filter(v => v.version === newestVersion);
  const paths = filteredList.map(v => ({ params: { id: v.id } }));

  // common version home page paths
  const homePaths = contentList
    .filter(v => v.version !== newestVersion)
    .map(v => ({ params: { id: v.version } }));

  return {
    paths: [...paths, ...homePaths],
    fallback: false,
  };
};

export const getStaticProps = async context => {
  const {
    params: { id },
    locale = 'en',
  } = context;

  const VERSION_REG = /^v\d/;
  const { versions, newestVersion } = docUtils.getVersion();
  const version = VERSION_REG.test(id) ? id : newestVersion;
  const { docData, contentList } = docUtils.getAllData();

  const {
    content,
    editPath,
    data: frontMatter,
  } = docUtils.getDocContent(contentList, version, id);

  const docMenus = docUtils.getDocMenu(docData, version);

  // home page info which is not the latest version
  if (VERSION_REG.test(id)) {
    const homeContent = docUtils.getHomeData(docData, version);

    const blogs = blogUtils.getAllData();
    const { tree, codeList, headingContent, anchorList } = await markdownToHtml(
      homeContent,
      {
        showAnchor: true,
        version,
      }
    );

    return {
      props: {
        homeData: {
          tree,
          codeList: codeList || [],
          headingContent: headingContent || '',
          anchorList: anchorList || [],
          summary: frontMatter?.summary || '',
          editPath: editPath || '',
          frontMatter: frontMatter || {},
        },
        isHome: true,
        blogs,
        version,
        locale,
        versions,
        newestVersion,
        menus: docMenus,
        id: 'home.md',
      },
    };
  }

  const { tree, codeList, headingContent, anchorList } = await markdownToHtml(
    content,
    {
      showAnchor: true,
      newestVersion,
    }
  );

  return {
    props: {
      homeData: {
        tree,
        codeList,
        headingContent,
        anchorList,
        summary: frontMatter.summary || '',
        editPath,
        frontMatter,
      },
      blogs: [],
      isHome: false,
      version: newestVersion,
      locale,
      versions,
      menus: docMenus,
      id,
    },
  };
};
