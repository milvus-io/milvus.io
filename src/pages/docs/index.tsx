import HomeContent from '@/parts/docs/docHome';
import { markdownToHtml } from '@/utils/common';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import LeftNavSection from '@/parts/docs/leftNavTree';
import classes from '@/styles/docs.module.less';
import DocLayout from '@/components/layout/docLayout';
import {
  generateAllContentDataOfAllVersion,
  generateDocVersionInfo,
  generateHomePageDataOfSingleVersion,
  generateMenuDataOfCurrentVersion,
} from '@/utils/docs';
import { generateApiMenuDataOfCurrentVersion } from '@/utils/apiReference';
import { generateAllBlogContentList } from '@/utils/blogs';
import { AllMdVersionIdType, FinalMenuStructureType } from '@/types/docs';
import { BlogFrontMatterType } from '@/types/blogs';
import { ABSOLUTE_BASE_URL } from '@/consts';

const TITLE = 'Milvus vector database documentation';

interface docHomePageProps {
  homeData: string;
  isHome: boolean;
  version: string;
  locale: 'en' | 'cn';
  versions: string[];
  blog: BlogFrontMatterType;
  menus: FinalMenuStructureType[];
  mdListData: AllMdVersionIdType[];
}

// this is latest version doc homepage
export default function LatestVersionDocHomepage(props: docHomePageProps) {
  const { t } = useTranslation('docs');

  const { homeData, blog, menus, version, versions, mdListData } = props;

  return (
    <DocLayout
      version={version}
      latestVersion={version}
      isHome
      classes={{
        root: clsx(classes.docPageContainer, classes.docHomePage),
      }}
      seo={{
        title: TITLE,
        desc: t('homepageDesc', { version }),
        url: `${ABSOLUTE_BASE_URL}/docs`,
      }}
      left={
        <LeftNavSection
          tree={menus}
          className={classes.docMenu}
          version={version}
          versions={versions}
          type="doc"
          homepageConf={{ label: 'Home', link: '/docs' }}
          currentMdId="home"
          latestVersion={version}
          mdListData={mdListData}
        />
      }
      center={<HomeContent homeData={homeData} latestBlog={blog} />}
    />
  );
}

export const getStaticProps = async () => {
  const { versions, latestVersion } = generateDocVersionInfo();
  const { content: homeContent } = generateHomePageDataOfSingleVersion({
    version: latestVersion,
  });
  const { frontMatter: latestBlogData } = generateAllBlogContentList()[0];
  const docMenu = generateMenuDataOfCurrentVersion({
    docVersion: latestVersion,
  });
  const outerApiMenuItem = generateApiMenuDataOfCurrentVersion({
    docVersion: latestVersion,
  });
  const menu = [...docMenu, outerApiMenuItem];

  const { tree } = await markdownToHtml(homeContent, {
    showAnchor: false,
    version: latestVersion,
    path: '/docs/',
  });

  // used to detect has same page of current md
  const mdListData = generateAllContentDataOfAllVersion();

  return {
    props: {
      homeData: tree,
      isHome: true,
      version: latestVersion,
      locale: 'en',
      versions,
      blog: latestBlogData,
      menus: menu,
      mdListData,
    },
  };
};
