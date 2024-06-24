import DocContent from '@/parts/docs/docContent';
import { markdownToHtml, copyToCommand } from '@/utils/common';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { linkIconTpl } from '@/components/icons';
import Aside from '@/components/aside';
import {
  useCopyCode,
  useFilter,
  useMultipleCodeFilter,
} from '@/hooks/enhanceCodeBlock';
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
import clsx from 'clsx';
import { useActivateAnchorWhenScroll, useGenAnchor } from '@/hooks/doc-anchor';

// this is doc detail page which's version is not the latest
export default function DocDetailPage(props: DocDetailPageProps) {
  const {
    homeData,
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

  const seoInfo = useMemo(() => {
    const title = frontMatter?.title || headingContent;

    const pageTitle =
      version === latestVersion
        ? `${title} | Milvus Documentation`
        : `${title} Milvus ${version} documentation`;
    return {
      title: pageTitle,
      url: `${ABSOLUTE_BASE_URL}/docs/${version}/${currentId}`,
      desc: summary ? `${summary} | ${version}` : `${title} | ${version}`,
    };
  }, [frontMatter, version, latestVersion, currentId, summary, headingContent]);

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
    articleContainer,
    anchorList,
  });
  useGenAnchor(version, editPath);

  return (
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
        <section className={clsx('scroll-padding', classes.docDetailContainer)}>
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
              activeAnchor={activeAnchor}
              docData={{ editPath }}
              mdTitle={frontMatter.title}
              category="doc"
              items={anchorList}
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
      path: version === latestVersion ? `/docs/` : `/docs/${version}/`,
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
