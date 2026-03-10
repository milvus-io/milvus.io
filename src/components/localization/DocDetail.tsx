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
import classes from '@/styles/docDetail.module.less';
import clsx from 'clsx';
import { DocDetailPageProps } from '@/types/docs';
import { LanguageEnum } from '@/types/localization';
import {
  getHomePageLink,
  getSeoUrl,
  getDocCanonicalUrl,
  getDocHreflangUrls,
} from '@/components/localization/utils';
import { useBreadcrumbLabels } from '@/hooks/use-breadcrumb-lables';
import { useAnchorEventListener } from '@/hooks/use-anchor-event-listener';

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
    availableLanguages,
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
  const latestVersionMds = mdListData?.find(
    item => item.version === latestVersion
  )?.mds;
  const canonicalUrl = getDocCanonicalUrl({
    lang,
    version,
    latestVersion,
    docId: currentId,
    latestVersionMds,
  });
  const hreflangUrls = getDocHreflangUrls({
    version,
    latestVersion,
    docId: currentId,
    availableLanguages,
  });
  const homePageLink = getHomePageLink({ lang, version, latestVersion });

  const isEN = lang === LanguageEnum.ENGLISH;
  const { t } = useTranslation('docs', { lng: lang });

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

  useAnchorEventListener(currentId);
  useFilter();
  useMultipleCodeFilter();
  useCopyCode(codeList);
  const activeAnchor = useActivateAnchorWhenScroll({
    articleContainer: articleContainer,
    anchorList,
  });
  useGenAnchor(version, editPath);

  const activeLabels = useBreadcrumbLabels({
    currentId,
    menu: menus,
  });
  return (
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
  );
}
