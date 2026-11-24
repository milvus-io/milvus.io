import clsx from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ABSOLUTE_BASE_URL } from '@/consts';
import JsonLd from '@/components/JsonLd';
import { buildSchema, SITE } from '@/schema';
import { LanguageEnum } from '@/types/localization';
import DocLayout from '@/components/layout/docLayout';
import HomeContent from '@/parts/docs/docHome';
import LeftNavSection from '@/parts/docs/leftNavTree';
import classes from '@/styles/docs.module.css';
import { BlogFrontMatterType } from '@/types/blogs';
import { AllMdVersionIdType, FinalMenuStructureType } from '@/types/docs';
import {
  getHomePageLink,
  getSeoUrl,
  getDocCanonicalUrl,
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
  hreflangUrls: { lang: string; url: string }[];
}

// latest version's home page
export function DocHomepage(props: DocHomePageProps) {
  const { t } = useTranslation('docs', { lng: props.lang });
  const { t: headerT } = useTranslation('header', { lng: props.lang });
  const {
    homeData,
    blog,
    menus,
    version,
    versions,
    mdListData,
    lang,
    latestVersion,
    hreflangUrls,
  } = props;
  const seoUrl = getSeoUrl({ lang, version, latestVersion });
  // Every version ships a docs home, so an archived version's home always has a
  // latest-version equivalent to canonicalize to.
  const canonicalUrl = getDocCanonicalUrl({
    lang,
    version,
    latestVersion,
    existsInLatest: true,
  });
  const homePageLink = getHomePageLink({ lang, version, latestVersion });

  const ldSchemas = useMemo(() => {
    const homeUrl =
      lang === LanguageEnum.ENGLISH
        ? ABSOLUTE_BASE_URL
        : `${ABSOLUTE_BASE_URL}/${lang}`;
    const breadcrumb = buildSchema('breadcrumb', [
      { name: 'Home', url: homeUrl },
      { name: headerT('docs'), url: seoUrl },
    ]);
    if (seoUrl !== canonicalUrl) return [breadcrumb];
    return [
      buildSchema('collectionPage', {
        absoluteUrl: canonicalUrl,
        name: t('metaTitle'),
        desc: t('homepageDesc', { version }),
        inLanguage: lang,
        about: {
          '@type': 'SoftwareApplication',
          '@id': `${SITE.softwareAppId}-${encodeURIComponent(version)}`,
          name: SITE.name,
          url: SITE.url,
          softwareVersion: version,
        },
      }),
      breadcrumb,
    ];
  }, [lang, headerT, seoUrl, canonicalUrl, t, version]);

  return (
    <>
      <JsonLd schema={ldSchemas} />
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
    </>
  );
}
