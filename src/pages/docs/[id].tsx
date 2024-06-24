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
import { useActivateAnchorWhenScroll, useGenAnchor } from '@/hooks/doc-anchor';
import LeftNavSection from '@/parts/docs/leftNavTree';
import DocLayout from '@/components/layout/docLayout';
import { ABSOLUTE_BASE_URL } from '@/consts';
import classes from '@/styles/docDetail.module.less';
import { checkIconTpl } from '@/components/icons';
import clsx from 'clsx';
import {
  generateDocVersionInfo,
  generateAllContentDataOfSingleVersion,
  generateHomePageDataOfSingleVersion,
  generateMenuDataOfCurrentVersion,
  generateAllContentDataOfAllVersion,
} from '@/utils/docs';
import { GetStaticProps } from 'next';
import { generateApiMenuDataOfCurrentVersion } from '@/utils/apiReference';
import { generateAllBlogContentList } from '@/utils/blogs';
import { DocDetailPageProps } from '@/types/docs';

const DOC_HOME_TITLE = 'Milvus vector database documentation';

// doc detail page of latest version & home page which's version is not the latest
export default function DocDetailPage(props: DocDetailPageProps) {
  const {
    homeData,
    isHome,
    blog: latestBlog,
    version,
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

  const { t } = useTranslation('docs');

  const seoInfo = useMemo(() => {
    const title = isHome
      ? DOC_HOME_TITLE
      : `${frontMatter?.title || headingContent}`;

    const pageTitle =
      version === latestVersion
        ? `${title} | Milvus Documentation`
        : `${title} Milvus ${version} documentation`;

    const url = isHome
      ? `${ABSOLUTE_BASE_URL}/docs/`
      : `${ABSOLUTE_BASE_URL}/docs/${currentId}`;
    const desc = isHome
      ? t('homepageDesc', { version })
      : summary
      ? `${summary} | ${version}`
      : `${title} | ${version}`;

    return {
      title: pageTitle,
      url,
      desc,
    };
  }, [isHome, frontMatter, version, currentId, summary]);

  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const pageHref = useRef('');
  const articleContainer = useRef<HTMLDivElement>(null);

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
  const activeAnchor = useActivateAnchorWhenScroll({
    articleContainer: articleContainer,
    anchorList,
  });
  useGenAnchor(version, editPath);

  return (
    <>
      {isHome ? (
        <DocLayout
          version={version}
          latestVersion={latestVersion}
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
              type="doc"
              homepageConf={{ label: 'Home', link: `/docs/${version}` }}
              currentMdId="home"
              latestVersion={latestVersion}
              mdListData={mdListData}
            />
          }
          center={
            <HomeContent homeData={homeData?.tree} latestBlog={latestBlog} />
          }
        />
      ) : (
        <DocLayout
          version={version}
          latestVersion={latestVersion}
          seo={{
            ...seoInfo,
            docSearchLanguage: 'en',
            docSearchVersion: version,
          }}
          left={
            <LeftNavSection
              tree={menus}
              className={classes.docMenu}
              version={version}
              versions={versions}
              type="doc"
              homepageConf={{
                label: 'Home',
                link: `/docs`,
              }}
              currentMdId={currentId}
              groupId={frontMatter.group}
              latestVersion={version}
              mdListData={mdListData}
            />
          }
          center={
            <section
              className={clsx('scroll-padding', classes.docDetailContainer)}
            >
              <div className={classes.contentSection} ref={articleContainer}>
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
                  docData={{ editPath }}
                  mdTitle={frontMatter.title}
                  category="doc"
                  items={anchorList}
                  classes={{
                    root: classes.rightAnchorTreeWrapper,
                  }}
                  activeAnchor={activeAnchor}
                />
              </div>
            </section>
          }
        />
      )}
    </>
  );
}

// this page combines the detail pages of latest versions and the home page of all versions
// these two pages has same params
export const getStaticPaths = () => {
  const { latestVersion, restVersions } = generateDocVersionInfo();
  const latestDocContentList = generateAllContentDataOfSingleVersion({
    version: latestVersion,
  });

  const paths = latestDocContentList.map(v => ({
    params: { id: v.frontMatter.id },
  }));

  // common version home page paths
  const homePagePaths = restVersions.map(v => ({
    params: { id: v },
  }));

  return {
    paths: [...paths, ...homePagePaths],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { params, locale = 'en' } = context;
  const VERSION_REG = /^v\d/;

  const id = params.id as string;
  const { versions, latestVersion } = generateDocVersionInfo();
  const version = VERSION_REG.test(id) ? id : latestVersion;

  const docMenu = generateMenuDataOfCurrentVersion({
    docVersion: version,
  });

  // used to detect has same page of current md
  const mdListData = generateAllContentDataOfAllVersion();

  // home page data
  if (VERSION_REG.test(id)) {
    const { content: homepageContent, frontMatter } =
      generateHomePageDataOfSingleVersion({ version });
    const outerApiMenuItem = generateApiMenuDataOfCurrentVersion({
      docVersion: version,
    });
    const menu = [...docMenu, outerApiMenuItem];
    const { frontMatter: latestBlogData } = generateAllBlogContentList()[0];

    const { tree, codeList, headingContent, anchorList } = await markdownToHtml(
      homepageContent,
      {
        showAnchor: true,
        version,
        path: `/docs/${version}/`,
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
          editPath: '',
          frontMatter: frontMatter,
        },
        isHome: true,
        blog: latestBlogData,
        version,
        locale,
        versions,
        latestVersion,
        menus: menu,
        id: 'home.md',
        mdListData,
      },
    };
  }

  // xxx.md of latest version
  const outerApiMenuItem = generateApiMenuDataOfCurrentVersion({
    docVersion: latestVersion,
  });
  const menu = [...docMenu, outerApiMenuItem];

  const docDetailContentList = generateAllContentDataOfSingleVersion({
    version: latestVersion,
    withContent: true,
  });

  const {
    content: docDetailContent,
    frontMatter,
    editPath,
  } = docDetailContentList.find(v => v.frontMatter.id === id);

  const { tree, codeList, headingContent, anchorList } = await markdownToHtml(
    docDetailContent,
    {
      showAnchor: true,
      version: latestVersion,
      path: `/docs/`,
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
      blog: null,
      isHome: false,
      version: latestVersion,
      latestVersion,
      locale,
      versions,
      menus: menu,
      id,
      mdListData,
    },
  };
};
