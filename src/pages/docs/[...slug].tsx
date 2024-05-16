import DocContent from '@/parts/docs/docContent';
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
import LeftNavSection from '@/parts/docs/leftNavTree';
import DocLayout from '@/components/layout/docLayout';
import { ABSOLUTE_BASE_URL } from '@/consts';
import classes from '@/styles/docDetail.module.less';
import { checkIconTpl } from '@/components/icons';
import {
  generateAllContentDataOfAllVersion,
  generateAllContentDataOfSingleVersion,
  generateContentDataOfSingleFile,
  generateDocVersionInfo,
  generateMenuDataOfCurrentVersion,
} from '@/utils/docs';
import { GetStaticProps } from 'next';
import { generateApiMenuDataOfCurrentVersion } from '@/utils/apiReference';
import { DocDetailPageProps } from '@/types/docs';

export default function DocDetailPage(props: DocDetailPageProps) {
  const {
    homeData,
    version,
    locale,
    versions,
    latestVersion,
    menus,
    id: currentId,
    mdListData,
  } = props;

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
    return {
      title: `${frontMatter?.title} | Milvus`,
      url: `${ABSOLUTE_BASE_URL}/docs/${version}/${currentId}`,
      desc: summary,
    };
  }, [frontMatter, version, currentId, summary]);

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
            } = e.currentTarget as HTMLAnchorElement;
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
    <DocLayout
      seo={seoInfo}
      left={
        <LeftNavSection
          tree={menuTree}
          className={classes.docMenu}
          version={version}
          versions={versions}
          homepageConf={{
            label: 'Home',
            link: `/docs/${version}`,
          }}
          currentMdId={currentId}
          groupId={frontMatter.group}
          latestVersion={latestVersion}
          type="doc"
          mdListData={mdListData}
        />
      }
      center={
        <section className={classes.docDetailContainer}>
          <div className={classes.contentSection}>
            <DocContent
              version={version}
              htmlContent={tree}
              mdId={currentId}
              commitPath={editPath}
              type="doc"
            />
          </div>

          <div className={classes.asideSection}>
            <Aside
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
  );
}

export const getStaticPaths = () => {
  const { restVersions } = generateDocVersionInfo();
  const contentList = restVersions.map(v => ({
    version: v,
    data: generateAllContentDataOfSingleVersion({ version: v }),
  }));

  const paths = contentList.reduce((acc, cur) => {
    const { version, data } = cur;
    const paths = data.map(d => {
      return {
        params: { slug: [version, d.frontMatter.id] },
      };
    });
    acc = acc.concat(paths);
    return acc;
  }, []);

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { params, locale = 'en' } = context;
  const [version, id] = params.slug as string[];
  const { versions, latestVersion } = generateDocVersionInfo();
  const {
    content: docDetailContent,
    frontMatter,
    editPath,
  } = generateContentDataOfSingleFile({
    version,
    id,
    withContent: true,
  });

  // used to detect has same page of current md
  const mdListData = generateAllContentDataOfAllVersion();

  const docMenu = generateMenuDataOfCurrentVersion({
    docVersion: version,
  });
  const outerApiMenuItem = generateApiMenuDataOfCurrentVersion({
    docVersion: version,
  });
  const menu = [...docMenu, outerApiMenuItem];

  const { tree, codeList, headingContent, anchorList } = await markdownToHtml(
    docDetailContent,
    {
      showAnchor: true,
      version,
      path: '/docs/',
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
      isHome: false,
      blog: null,
      version,
      locale,
      versions,
      latestVersion,
      menus: menu,
      id,
      mdListData,
    },
  };
};
