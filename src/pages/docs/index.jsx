import docUtils from '@/utils/docs.utils';
import blogUtils from '@/utils/blog.utils';
import HomeContent from '@/parts/docs/docHome';
import { markdownToHtml } from '@/utils/common';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import LeftNavSection from '@/parts/docs/leftNavTree';
import classes from '@/styles/docs.module.less';
import DocLayout from '@/components/layout/docLayout';

const TITLE = 'Milvus vector database documentation';

/**
 *  1. 进入docs页面时，淫荡展示最新版本的 homepage
 *  2. 所以 【version] 页面 getStaticPaths 应当移除最新版本的路径，getStaticProps 同理
 *  3. 新增 [slug] 页面，用于展示最新版本的文档
 *  4. [version]/[slug] 页面用于展示指定版本的文档 保持不变
 *  5. 迁移到 ts
 *  6. 优化 utils 代码
 * */

// this is latest version doc homepage
export default function LatestVersionDocHomepage(props) {
  const { t } = useTranslation('common');

  const { homeData, blogs = [], menus, version, versions, locale } = props;

  const newestBlog = useMemo(() => {
    return blogs[0];
  }, [blogs]);

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
      center={
        <HomeContent homeData={homeData} newestBlog={newestBlog} trans={t} />
      }
    />
  );
}

export const getStaticProps = async () => {
  const { versions } = docUtils.getVersion();
  const { newestVersion } = docUtils.getVersion();
  const { docData } = docUtils.getAllData();
  const homeContent = docUtils.getHomeData(docData, newestVersion);
  const blogs = blogUtils.getAllData();
  const menu = docUtils.getDocMenu(docData, newestVersion);

  const { tree } = await markdownToHtml(homeContent, {
    showAnchor: false,
    newestVersion,
  });

  return {
    props: {
      homeData: tree,
      isHome: true,
      version: newestVersion,
      locale: 'en',
      versions,
      blogs,
      menus: menu,
    },
  };
};
