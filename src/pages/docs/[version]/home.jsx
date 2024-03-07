import docUtils from '@/utils/docs.utils';
import blogUtils from '@/utils/blog.utils';
import HomeContent from '@/parts/docs/docHome';
import { markdownToHtml } from '@/utils/common';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useGenAnchor } from '@/hooks/doc-anchor';
import { recursionUpdateTree } from '@/utils/docUtils';
import LeftNavSection from '@/parts/docs/leftNavTree';
import classes from '@/styles/docs.module.less';
import DocLayout from '@/components/layout/docLayout';

const TITLE = 'Milvus vector database documentation';

export default function DocHomePage(props) {
  const { homeData, blogs = [], menus, version, versions, locale } = props;

  const { t } = useTranslation('common');

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
          linkPrefix={`/docs`}
          linkSuffix="home"
          locale={locale}
          home={{ label: 'Home', link: '/docs' }}
          currentMdId="home"
        />
      }
      center={
        <HomeContent homeData={homeData} newestBlog={newestBlog} trans={t} />
      }
    />
  );
}

export const getStaticPaths = () => {
  const { versions } = docUtils.getVersion();

  const paths = versions.map(v => ({
    params: { version: v },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async context => {
  const {
    params: { version },
    locale = 'en',
  } = context;

  const { versions } = docUtils.getVersion();
  const { docData } = docUtils.getAllData();
  const homeContent = docUtils.getHomeData(docData, version);
  const menu = docUtils.getDocMenu(docData, version);

  const blogs = blogUtils.getAllData();

  const { tree } = await markdownToHtml(homeContent, {
    showAnchor: false,
    version,
  });

  return {
    props: {
      homeData: tree,
      isHome: true,
      version,
      locale,
      versions,
      blogs,
      menus: menu,
    },
  };
};
