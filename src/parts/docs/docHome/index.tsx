import HorizontalBlogCard from '../../../components/card/HorizontalBlogCard';
import classes from './index.module.css';
import clsx from 'clsx';
import { BlogFrontMatterType } from '@/types/blogs';
import { LanguageEnum } from '@/types/localization';
import React from 'react';
import { DeepLogo } from '@/components/localization/DeepLogo';

interface HomeContentProps {
  latestBlog: BlogFrontMatterType;
  homeData: string;
  lang?: LanguageEnum;
}
export default function HomeContent(props: HomeContentProps) {
  const { homeData = '', latestBlog, lang } = props;

  return (
    <section className={classes.container}>
      <div
        className={clsx(classes.langSelector, {
          [classes.specialSelector]: lang === LanguageEnum.ARABIC,
        })}
      >
        {<DeepLogo />}
      </div>

      <div
        className={clsx('doc-style', classes.docHomeHtmlWrapper)}
        dangerouslySetInnerHTML={{
          __html: homeData,
        }}
      ></div>

      <div className={classes.docHomeBlog}>
        <h2>Blog</h2>
        <HorizontalBlogCard blogData={latestBlog} />
      </div>
    </section>
  );
}
