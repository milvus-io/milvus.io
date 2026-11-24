import DocContent from '@/parts/docs/docContent';
import React, { useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Aside from '@/components/aside';
import {
  useCopyCode,
  useFilter,
  useMultipleCodeFilter,
} from '@/hooks/enhanceCodeBlock';
import { useActivateAnchorWhenScroll, useGenAnchor } from '@/hooks/doc-anchor';
import LeftNavSection from '@/parts/docs/leftNavTree';
import DocLayout from '@/components/layout/docLayout';
import classes from '@/styles/docDetail.module.css';
import clsx from 'clsx';
import { DocDetailPageProps } from '@/types/docs';
import { LanguageEnum } from '@/types/localization';
import { getHomePageLink, getSeoUrl } from '@/components/localization/utils';
import { useBreadcrumbLabels } from '@/hooks/use-breadcrumb-lables';
import { useAnchorEventListener } from '@/hooks/use-anchor-event-listener';
import { useHeadingAnchorFallback } from '@/hooks/use-heading-anchor-fallback';
import JsonLd from '@/components/JsonLd';
import { buildSchema } from '@/schema';
import { ABSOLUTE_BASE_URL } from '@/consts';

// contains the latest version's detail pages and other versions' home pages
export function DocDetailPage(props: DocDetailPageProps) {
  const {
    homeData,
    version,
    versions,
    latestVersion,
    menus,
    id: currentId,
    mdListData,
    lang,
    hreflangUrls,
    canonicalUrl,
    lastModified,
  } = props;

  const {
    tree,
    codeList,
    headingContent,
    anchorList,
    summary,
    editPath,
    frontMatter,
  } = homeData;
  const seoUrl = getSeoUrl({ lang, version, latestVersion, docId: currentId });
  const homePageLink = getHomePageLink({ lang, version, latestVersion });

  const isEN = lang === LanguageEnum.ENGLISH;
  const { t } = useTranslation('docs', { lng: lang });
  const { t: headerT } = useTranslation('header', { lng: lang });

  const seoInfo = useMemo(() => {
    const title = `${frontMatter?.title || headingContent}`;

    const pageTitle =
      version === latestVersion
        ? `${title} | ${t('title')}`
        : `${title} ${t('homepageDesc', { version })}`;

    const desc = summary ? `${summary} | ${version}` : `${title} | ${version}`;

    return {
      title: pageTitle,
      url: seoUrl,
      desc,
    };
  }, [frontMatter, version, summary, seoUrl, t]);

  const articleContainer = useRef<HTMLDivElement>(null);

  useAnchorEventListener();
  useFilter();
  useMultipleCodeFilter();
  useCopyCode(codeList);
  const activeAnchor = useActivateAnchorWhenScroll({
    articleContainer: articleContainer,
    anchorList,
  });
  useGenAnchor(version, editPath);
  useHeadingAnchorFallback(articleContainer);

  const activeLabels = useBreadcrumbLabels({
    currentId,
    menu: menus,
  });

  // Breadcrumb mirrors the visible trail (Home → Docs → page); intermediate
  // category labels are omitted since they have no standalone URL.
  const docTitle = `${frontMatter?.title || headingContent}`;
  const ldSchemas = useMemo(() => {
    const breadcrumb = buildSchema('breadcrumb', [
      { name: 'Home', url: ABSOLUTE_BASE_URL },
      { name: headerT('docs'), url: `${ABSOLUTE_BASE_URL}${homePageLink}` },
      { name: docTitle, url: seoUrl },
    ]);
    // The canonical page defines the article's language, version, and date.
    if (seoUrl !== canonicalUrl) return [breadcrumb];

    const schemas = [
      buildSchema('techArticle', {
        absoluteUrl: canonicalUrl,
        title: docTitle,
        desc: summary || undefined,
        modifiedTime: lastModified,
        inLanguage: lang,
        softwareVersion: version,
      }),
      breadcrumb,
    ];
    if (currentId === 'glossary.md' && tree) {
      const termSet = buildSchema('definedTermSet', {
        absoluteUrl: canonicalUrl,
        name: docTitle,
        desc: summary || undefined,
        inLanguage: lang,
        html: tree,
      });
      if (termSet.hasDefinedTerm?.length) {
        schemas.push(termSet);
      }
    }
    return schemas;
  }, [
    canonicalUrl, seoUrl, docTitle, summary, lastModified, lang, version,
    homePageLink, headerT, currentId, tree,
  ]);

  return (
    <>
      <JsonLd schema={ldSchemas} />
      <DocLayout
      version={version}
      latestVersion={latestVersion}
      seo={{
        ...seoInfo,
        lang,
        canonicalUrl,
        hreflangUrls,
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
          currentMdId={currentId}
          groupId={frontMatter.group}
          latestVersion={latestVersion}
          mdListData={mdListData}
          lang={lang}
        />
      }
      center={
        <section className={clsx('scroll-padding', classes.docDetailContainer)}>
          <div className={classes.contentSection} ref={articleContainer}>
            <DocContent
              version={version}
              htmlContent={tree}
              mdId={currentId}
              commitPath={editPath}
              type="doc"
              lang={lang}
              activeLabels={activeLabels}
              latestVersion={latestVersion}
            />
          </div>

          <div className={classes.asideSection}>
            <Aside
              version={version}
              docData={{ editPath }}
              mdTitle={frontMatter.title}
              category="doc"
              items={anchorList}
              classes={{
                root: classes.rightAnchorTreeWrapper,
              }}
              activeAnchor={activeAnchor}
              lang={lang}
              isShowBtnGroup={isEN}
              mdId={currentId}
            />
          </div>
        </section>
      }
      />
    </>
  );
}
