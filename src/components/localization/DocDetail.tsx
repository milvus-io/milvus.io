import DocContent from '@/parts/docs/docContent';
import HomeContent from '@/parts/docs/docHome';
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
import { ABSOLUTE_BASE_URL } from '@/consts';
import classes from '@/styles/docDetail.module.less';
import { checkIconTpl } from '@/components/icons';
import clsx from 'clsx';
import { DocDetailPageProps } from '@/types/docs';
import { LanguageEnum } from '@/components/language-selector';

const DOC_HOME_TITLE = 'Milvus vector database documentation';

export function DocDetailPage(props: DocDetailPageProps) {
  const {
    homeData,
    isHome,
    blog: latestBlog,
    version,
    versions,
    latestVersion,
    menus,
    id: currentId,
    mdListData,
    locale: lang,
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

  const isEN = lang === LanguageEnum.ENGLISH;

  const homeSeoUrl = isEN
    ? `${ABSOLUTE_BASE_URL}/docs/${version}`
    : `${ABSOLUTE_BASE_URL}/docs/${lang}/${version}`;
  const versionSeoUrl = isEN
    ? `${ABSOLUTE_BASE_URL}/docs/${currentId}`
    : `${ABSOLUTE_BASE_URL}/docs/${lang}/${currentId}`;
  const seoUrl = isHome ? homeSeoUrl : versionSeoUrl;
  const homePageLink = isEN ? '/docs' : `/docs/${lang}`;

  const { t } = useTranslation('docs', { lng: lang });

  const seoInfo = useMemo(() => {
    const title = isHome
      ? DOC_HOME_TITLE
      : `${frontMatter?.title || headingContent}`;

    const pageTitle =
      version === latestVersion
        ? `${title} | ${t('title')}`
        : `${title} ${t('homepageDesc', { version })}`;

    const desc = isHome
      ? t('homepageDesc', { version })
      : summary
      ? `${summary} | ${version}`
      : `${title} | ${version}`;

    return {
      title: pageTitle,
      url: seoUrl,
      desc,
    };
  }, [isHome, frontMatter, version, summary, seoUrl, t]);

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
    <>
      {isHome ? (
        <DocLayout
          version={version}
          latestVersion={latestVersion}
          isHome
          classes={{
            root: clsx(classes.docPageContainer, classes.docHomePage),
          }}
          seo={seoInfo}
          left={
            <LeftNavSection
              tree={menus}
              className={classes.docMenu}
              version={version}
              versions={versions}
              type="doc"
              homepageConf={{ label: 'Home', link: `/docs/${version}` }}
              currentMdId="home"
              latestVersion={latestVersion}
              mdListData={mdListData}
              lang={lang}
            />
          }
          center={
            <HomeContent
              homeData={homeData?.tree}
              latestBlog={latestBlog}
              lang={lang}
              disableLanguageSelector={true}
            />
          }
        />
      ) : (
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
              latestVersion={version}
              mdListData={mdListData}
              lang={lang}
            />
          }
          center={
            <section
              className={clsx('scroll-padding', classes.docDetailContainer)}
            >
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
                />
              </div>
            </section>
          }
        />
      )}
    </>
  );
}
