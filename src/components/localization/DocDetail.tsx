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
import { getHomePageLink, getSeoUrl } from '@/components/localization/utils';
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
