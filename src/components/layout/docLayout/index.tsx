import classes from './index.module.less';
import Head from 'next/head';
import clsx from 'clsx';
import FlexibleSectionContainer from '../../flexibleSection';
import Header from '../../header';
import Footer from '../../footer';
import InkeepChatButtonContainer from '@/components/inkeep/InkeepChatButton';
import 'highlight.js/styles/atom-one-dark.css';
import { LanguageEnum } from '@/types/localization';

const MENU_MINIMUM_WIDTH = 22;
const MENU_MAXIMUM_WIDTH = 283;

interface DocLayoutPropsType {
  left: React.ReactNode;
  center: React.ReactNode;
  version: string;
  latestVersion: string;
  seo: {
    title: string;
    desc: string;
    url: string;
    docSearchLanguage?: string;
    docSearchVersion?: string;
    lang?: LanguageEnum;
  };
  classes?: {
    root?: string;
    main?: string;
    content?: string;
  };
  isHome?: boolean;
  showFooter?: boolean;
}

export default function DocLayout(props: DocLayoutPropsType) {
  const {
    left,
    center,
    seo,
    classes: customerClasses = {},
    isHome = false,
    showFooter = true,
  } = props;

  const {
    title = '',
    desc = '',
    url = '',
    docSearchLanguage,
    docSearchVersion,
    lang,
  } = seo;
  const { root = '', main = '', content = '' } = customerClasses;

  const metaKeywords = `milvus, vector database, Milvus ${docSearchVersion}, vector similarity search`;

  return (
    <>
      <main className={clsx(classes.docLayoutContainer, root)}>
        <Head>
          <title>{title}</title>
          <meta name="description" content={desc}></meta>
          <meta property="og:title" content={title}></meta>
          <meta property="og:description" content={desc} />
          <meta name="keywords" content={metaKeywords} />
          <meta property="og:url" content={url} />
          {docSearchLanguage && (
            <meta name="docsearch:language" content={docSearchLanguage} />
          )}
          {docSearchVersion && (
            <meta name="docsearch:version" content={docSearchVersion} />
          )}
          {/* {!isLatestVersion && <meta name="robots" content="noindex" />} */}
          <link rel="alternate" href={url} hrefLang={lang} />
        </Head>
        <Header className={classes.docHeader} />
        <div className={clsx(classes.mainContainer, main)}>
          <FlexibleSectionContainer
            minWidth={MENU_MINIMUM_WIDTH}
            maxWidth={MENU_MAXIMUM_WIDTH}
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
            {center}

            {showFooter && (
              <Footer
                lang={lang}
                classes={{
                  root: classes.docFooter,
                  content: classes.docFooterContent,
                  nav: classes.docFooterNav,
                }}
              />
            )}
          </div>
        </div>
        <InkeepChatButtonContainer />
      </main>
    </>
  );
}
