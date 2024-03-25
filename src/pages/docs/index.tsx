import HomeContent from '@/parts/docs/docHome';
import { markdownToHtml } from '@/utils/common';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import LeftNavSection from '@/parts/docs/leftNavTree';
import classes from '@/styles/docs.module.less';
import DocLayout from '@/components/layout/docLayout';
import {
  generateDocVersionInfo,
  generateHomePageDataOfSingleVersion,
  generateMenuDataOfCurrentVersion,
} from '@/utils/docs';
import { generateApiMenuDataOfCurrentVersion } from '@/utils/apiReference';
import { generateAllBlogContentList } from '@/utils/blogs';
import { FinalMenuStructureType } from '@/types/docs';
import { BlogFrontMatterType } from '@/types/blogs';

const TITLE = 'Milvus vector database documentation';

interface docHomePageProps {
  homeData: string;
  isHome: boolean;
  version: string;
  locale: 'en' | 'cn';
  versions: string;
  blog: BlogFrontMatterType;
  menus: FinalMenuStructureType[];
}

/**
 *  1. 进入docs页面时，淫荡展示最新版本的 homepage
 *  2. 所以 【version] 页面 getStaticPaths 应当移除最新版本的路径，getStaticProps 同理
 *  3. 新增 [slug] 页面，用于展示最新版本的文档
 *  4. [version]/[slug] 页面用于展示指定版本的文档 保持不变
 *  5. 迁移到 ts
 *  6. 优化 utils 代码
 * */

// this is latest version doc homepage
export default function LatestVersionDocHomepage(props: docHomePageProps) {
  const { t } = useTranslation('common');

  const { homeData, blog, menus, version, versions, locale } = props;

  return (
    <DocLayout
      isHome
      classes={{
        root: clsx(classes.docPageContainer, classes.docHomePage),
      }}
      seo={{
        title: TITLE,
        desc: '',
        url: 'https://milvus.io/docs',
      }}
      left={
        <LeftNavSection
          tree={menus}
          className={classes.docMenu}
          version={version}
          versions={versions}
          linkPrefix="docs"
          locale={locale}
          home={{ label: 'Home', link: '/docs' }}
          currentMdId="home"
          latestVersion={version}
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
    latestVersion,
  });

  return {
    props: {
      homeData: tree,
      isHome: true,
      version: latestVersion,
      locale: 'en',
      versions,
      blog: latestBlogData,
      menus: menu,
    },
  };
};
