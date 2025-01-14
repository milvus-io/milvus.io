import Typography from '@mui/material/Typography';
import HorizontalBlogCard from '../../../components/card/HorizontalBlogCard';
import classes from './index.module.less';
import clsx from 'clsx';
import { BlogFrontMatterType } from '@/types/blogs';
import { LanguageSelector } from '@/components/language-selector';
import { LanguageEnum } from '@/types/localization';
import React from 'react';

interface HomeContentProps {
  latestBlog: BlogFrontMatterType;
  homeData: string;
  lang?: LanguageEnum;
  disableLanguageSelector?: boolean;
  disabledLanguages?: LanguageEnum[];
}
export default function HomeContent(props: HomeContentProps) {
  const { homeData = '', latestBlog, lang, disableLanguageSelector, disabledLanguages = [] } = props;

  return (
    <section className={classes.container}>
      <div className={classes.langSelector}>
        <LanguageSelector
          value={lang}
          disabled={disableLanguageSelector}
          showDeepLogo={lang !== LanguageEnum.ENGLISH}
          disabledLanguages={disabledLanguages}
        />
      </div>

      <div
        className={clsx('doc-style', classes.docHomeHtmlWrapper)}
        dangerouslySetInnerHTML={{
          __html: homeData,
        }}
      ></div>

      <Typography component="section" className={classes.docHomeBlog}>
        <Typography variant="h2" component="h2">
          Blog
        </Typography>
        <HorizontalBlogCard blogData={latestBlog} />
      </Typography>
    </section>
  );
}
