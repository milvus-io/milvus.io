import DocContent from '@/parts/docs/docContent';
import { copyToCommand } from '@/utils/common';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { linkIconTpl } from '@/components/icons';
import Aside from '@/components/aside';
import {
  useCopyCode,
  useFilter,
  useMultipleCodeFilter,
} from '@/hooks/enhanceCodeBlock';
import LeftNavSection from '@/parts/docs/leftNavTree';
import DocLayout from '@/components/layout/docLayout';
import { ABSOLUTE_BASE_URL } from '@/consts';
import classes from '@/styles/docDetail.module.less';
import { checkIconTpl } from '@/components/icons';
import { DocDetailPageProps } from '@/types/docs';
import clsx from 'clsx';
import { useActivateAnchorWhenScroll, useGenAnchor } from '@/hooks/doc-anchor';
import { LanguageEnum } from '@/components/language-selector';
import { useTranslation } from 'react-i18next';

// this is doc detail page which's version is not the latest
export function DocSlugPage(props: DocDetailPageProps) {
  const {
    homeData,
    version,
    versions,
    latestVersion,
    menus,
    id: currentId,
    mdListData,
    locale,
  } = props;
  const { t } = useTranslation('docs', { lng: locale });

  const {
    tree,
    codeList,
    headingContent,
    anchorList,
    summary,
    editPath,
    frontMatter,
  } = homeData;
  const isEN = locale === LanguageEnum.ENGLISH;
  const seoUrl = isEN
    ? `${ABSOLUTE_BASE_URL}/docs/${version}/${currentId}`
    : `${ABSOLUTE_BASE_URL}/docs/${locale}/${version}/${currentId}`;
  const homeLink = isEN ? `/docs/${version}` : `/docs/${locale}/${version}`;

  const seoInfo = useMemo(() => {
    const title = frontMatter?.title || headingContent;

    const pageTitle =
      version === latestVersion
        ? `${title} | ${t('title')}`
        : `${title} ${t('homepageDesc', { version })}`;
    return {
      title: pageTitle,
      url: seoUrl,
      desc: summary ? `${summary} | ${version}` : `${title} | ${version}`,
    };
  }, [frontMatter, version, latestVersion, summary, headingContent, seoUrl, t]);

  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const pageHref = useRef('');
  const articleContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // add click event handler for copy icon after headings
    if (window && typeof window !== 'undefined') {
      const anchors = Array.from(document.querySelectorAll('.anchor-icon'));
      const baseHref = window.location.href.split('#')[0];

      anchors.forEach(anchor => {
        anchor.addEventListener(
          'click',
          e => {
            if (!e.currentTarget) {
              return;
            }
            const {
              dataset: { href },
            } = e.currentTarget as HTMLAnchorElement;
            pageHref.current = `${baseHref}${href}`;
            copyToCommand(pageHref.current);

            anchor.innerHTML = checkIconTpl;

            setTimeout(() => {
              anchor.innerHTML = linkIconTpl;
            }, 3000);
          },
          false
        );
      });
    }
    // close mask when router changed
    isOpenMobileMenu && setIsOpenMobileMenu(false);
    // no need to watch 'isOpenMobileMenu'
    // eslint-disable-next-line
  }, [currentId]);

  useFilter();
  useMultipleCodeFilter();
  useCopyCode(codeList);
  const activeAnchor = useActivateAnchorWhenScroll({
    articleContainer,
    anchorList,
  });
  useGenAnchor(version, editPath);

  return (
    <DocLayout
      version={version}
      latestVersion={latestVersion}
      seo={{
        ...seoInfo,
        lang: locale,
        docSearchLanguage: locale,
        docSearchVersion: version,
      }}
      left={
        <LeftNavSection
          tree={menus}
          className={classes.docMenu}
          version={version}
          versions={versions}
          homepageConf={{
            label: t('navigation.title'),
            link: homeLink,
          }}
          currentMdId={currentId}
          groupId={frontMatter.group}
          latestVersion={latestVersion}
          type="doc"
          mdListData={mdListData}
          lang={locale}
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
            />
          </div>

          <div className={classes.asideSection}>
            <Aside
              version={version}
              activeAnchor={activeAnchor}
              docData={{ editPath }}
              mdTitle={frontMatter.title}
              category="doc"
              items={anchorList}
              classes={{
                root: classes.rightAnchorTreeWrapper,
              }}
              lang={locale}
              disableLanguageSelector={true}
            />
          </div>
        </section>
      }
    />
  );
}
