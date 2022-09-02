import classes from '../../../styles/docDetail.module.less';
import clsx from 'clsx';
import {
  generateAllVersionPaths,
  generateCurVersionMenuList,
  generateCurDocInfo,
} from '../../../utils/milvus';
import { markdownToHtml } from '../../../utils/common';
import React, { useState, useEffect, useRef, useMemo } from 'react';
// import {
//   useCopyCode,
//   useFilter,
//   useMultipleCodeFilter,
// } from '../../../hooks/enhanceCodeBlock';
import 'highlight.js/styles/github.css';
import Head from 'next/head';
// import { RightArrow24Icon } from '../../../components/icons/Index';
import { useRouter } from 'next/router';
// import AnchorTree from '../../../parts/docs/anchorTree';
import { copyToCommand } from '../../../utils/common';
import { getMenuInfoById, recursionUpdateTree } from '../../../utils/docUtils';
// import MenuTree from '../../../parts/docs/tree';

export const linkIconTpl = `
  <svg
    aria-hidden="true"
    focusable="false"
    height="20"
    version="1.1"
    viewBox="0 0 16 16"
    width="16"
  >
    <path
      fill="#0092E4"
      fill-rule="evenodd"
      d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
    ></path>
  </svg>
`;

export default function Docs(props) {
  const {
    content,
    codeList,
    id: currentId,
    version,
    menus,
    headingContent,
    summary,
    anchorList,
  } = props;
  const router = useRouter();

  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const [menuTree, setMenuTree] = useState(menus);
  const pageHref = useRef('');

  const handleSearch = value => {
    if (!value) return;
    // close mask when search
    if (isOpenMobileMenu) {
      setIsOpenMobileMenu(false);
    }
    router.push(`/doc?key=${value}`);
  };

  const handleToggleMobileMenuMask = () => {
    setIsOpenMobileMenu(v => !v);
  };

  const handleCloseMask = e => {
    if (e.target === e.currentTarget) {
      setIsOpenMobileMenu(false);
    }
  };

  const handleNodeClick = (nodeId, parentIds, isPage) => {
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

  // useFilter();
  // useMultipleCodeFilter(currentId);
  // useCopyCode(codeList);

  return (
    <main>
      <Head>
        <title>Milvus doc</title>
        <meta name="description" content={summary} />
      </Head>
      <div className={classes.container}>
        <div
          className={clsx(classes.popupMask, {
            [classes.visibleMask]: isOpenMobileMenu,
          })}
          onClick={handleCloseMask}
        ></div>
        <div
          className={clsx(classes.mobileMenuWrapper, {
            [classes.visibleMenu]: isOpenMobileMenu,
          })}
        >
          <div className={classes.titleBar}>
            <p>menu</p>
            <button
              className={clsx(classes.iconBtn, {
                [classes.expandedBtn]: isOpenMobileMenu,
              })}
              onClick={handleToggleMobileMenuMask}
            >
              {'>'}
            </button>
          </div>

          <div className={classes.mobileMenuContainer}>
            {/* <MenuTree
              tree={menuTree}
              onNodeClick={handleNodeClick}
              version={version}
            /> */}
          </div>
        </div>

        <div className={classes.docContentcontainer}>
          <div className={classes.menuContainer}>
            {/* <MenuTree
              tree={menuTree}
              onNodeClick={handleNodeClick}
              version={version}
            /> */}
          </div>
          <div className={classes.contentContainer}>
            <div
              dangerouslySetInnerHTML={{ __html: content }}
              className="doc-style"
            ></div>
          </div>
          <div className={classes.anchorContainer}>
            {/* <AnchorTree list={anchorList} /> */}
          </div>
        </div>
      </div>
    </main>
  );
}

export const getStaticPaths = () => {
  const paths = generateAllVersionPaths();

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ locale, params }) => {
  const { slug, version = 'v2.1.x' } = params;

  const menus = generateCurVersionMenuList('en', version);
  const { content, summary } = generateCurDocInfo(slug, version, locale);

  const { tree, codeList, headingContent, anchorList } = await markdownToHtml(
    content
  );

  return {
    props: {
      content: tree,
      codeList,
      headingContent,
      summary: summary,
      id: slug,
      version,
      menus: [],
      anchorList: [],
    },
  };
};
