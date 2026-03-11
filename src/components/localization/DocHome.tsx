import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { LanguageEnum } from '@/types/localization';
import DocLayout from '@/components/layout/docLayout';
import HomeContent from '@/parts/docs/docHome';
import LeftNavSection from '@/parts/docs/leftNavTree';
import classes from '@/styles/docs.module.less';
import { BlogFrontMatterType } from '@/types/blogs';
import { AllMdVersionIdType, FinalMenuStructureType } from '@/types/docs';
import {
  getHomePageLink,
  getSeoUrl,
  getDocCanonicalUrl,
  getDocHreflangUrls,
} from '@/components/localization/utils';

export interface DocHomePageProps {
  homeData: string;
  isHome: boolean;
  version: string;
  latestVersion: string;
  lang: LanguageEnum;
  versions: string[];
  blog: BlogFrontMatterType;
  menus: FinalMenuStructureType[];
  mdListData: AllMdVersionIdType[];
  availableLanguages: LanguageEnum[];
}

// latest version's home page
export function DocHomepage(props: DocHomePageProps) {
  const { t } = useTranslation('docs', { lng: props.lang });
  const {
    homeData,
    blog,
    menus,
    version,
    versions,
    mdListData,
    lang,
    latestVersion,
    availableLanguages,
  } = props;
  const seoUrl = getSeoUrl({ lang, version, latestVersion });
  const canonicalUrl = getDocCanonicalUrl({ lang, version, latestVersion });
  const hreflangUrls = getDocHreflangUrls({
    version,
    latestVersion,
    availableLanguages,
  });
  const homePageLink = getHomePageLink({ lang, version, latestVersion });

  return (
    <DocLayout
      version={version}
      latestVersion={latestVersion}
      isHome
      classes={{
        root: clsx(classes.docPageContainer, classes.docHomePage),
      }}
      seo={{
        title: t('metaTitle'),
        desc: t('homepageDesc', { version }),
        url: seoUrl,
        canonicalUrl,
        hreflangUrls,
        lang,
        docSearchLanguage: lang,
        docSearchVersion: version,
      }}
      left={
        <LeftNavSection
          tree={menus}
          className={classes.docMenu}
          version={version}
          versions={versions}
          type="doc"
          homepageConf={{
            label: t('navigation.title'),
            link: homePageLink,
          }}
          currentMdId="home"
          latestVersion={latestVersion}
          mdListData={mdListData}
          lang={lang}
        />
      }
      center={<HomeContent homeData={homeData} latestBlog={blog} lang={lang} />}
    />
  );
}
