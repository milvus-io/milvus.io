import DocContent from '@/parts/docs/docContent';
import { copyToCommand } from '@/utils/common';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { linkIconTpl } from '@/components/icons';
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
import { checkIconTpl } from '@/components/icons';
import clsx from 'clsx';
import { DocDetailPageProps } from '@/types/docs';
import { LanguageEnum } from '@/types/localization';
import {
  DOCS_LANGUAGE_DISABLED_MAP,
  SHOW_LANGUAGE_SELECTOR_VERSIONS,
} from '@/components/localization/const';
import { getHomePageLink, getSeoUrl } from '@/components/localization/utils';

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
    articleContainer: articleContainer,
    anchorList,
  });
  useGenAnchor(version, editPath);

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
              disableLanguageSelector={
                !SHOW_LANGUAGE_SELECTOR_VERSIONS.includes(version)
              }
              disabledLanguages={DOCS_LANGUAGE_DISABLED_MAP[version]}
            />
          </div>
        </section>
      }
    />
  );
}
