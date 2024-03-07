import { useTranslation } from 'react-i18next';
import classes from './index.module.less';
import Head from 'next/head';
import clsx from 'clsx';
import FlexibleSectionContainer from '../../flexibleSection';
import { useState, useEffect } from 'react';
import { getCurrentSize } from '../../../http/hooks';
import Header from '../../header';
import Footer from '../../footer';

export default function DocLayout(props) {
  const { t } = useTranslation('common');
  const {
    left,
    center,
    seo = {},
    classes: customerClasses = {},
    isHome,
    showFooter = true,
  } = props;

  const { title = '', desc = '', url = '' } = seo;
  const { root = '', main = '', content = '' } = customerClasses;

  return (
    <main className={clsx(classes.docLayoutContainer, root)}>
      <Head>
        <title>{title}</title>
        <meta type="description" content={desc}></meta>
        <meta property="og:title" content={title}></meta>
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={url} />
      </Head>
      <Header className={classes.docHeader} />
      <div className={clsx(classes.mainContainer, main)}>
        <FlexibleSectionContainer
          minWidth={24}
          maxWidth={282}
          classes={{
            root: classes.flexibleContainer,
          }}
        >
          {left}
        </FlexibleSectionContainer>
        <div
          className={clsx(classes.contentContainer, content, {
            [classes.docHome]: isHome,
          })}
        >
          <div className={classes.centerContainer}>{center}</div>

          {showFooter && (
            <Footer
              darkMode={false}
              classes={{
                content: classes.docFooter,
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}
