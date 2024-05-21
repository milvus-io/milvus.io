import { useTranslation } from 'react-i18next';
import classes from './index.module.less';
import Head from 'next/head';
import clsx from 'clsx';
import FlexibleSectionContainer from '../../flexibleSection';
import Header from '../../header';
import Footer from '../../footer';

const MENU_MINIMUM_WIDTH = 22;
const MENU_MAXIMUM_WIDTH = 283;

interface DocLayoutPropsType {
  left: React.ReactNode;
  center: React.ReactNode;
  seo: {
    title: string;
    desc: string;
    url: string;
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
  const { t } = useTranslation('common');
  const {
    left,
    center,
    seo,
    classes: customerClasses = {},
    isHome = false,
    showFooter = true,
  } = props;

  const { title = '', desc = '', url = '' } = seo;
  const { root = '', main = '', content = '' } = customerClasses;

  return (
    <main className={clsx(classes.docLayoutContainer, root)}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc}></meta>
        <meta property="og:title" content={title}></meta>
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={url} />
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
            <Footer />
          )}
        </div>
      </div>
    </main>
  );
}
