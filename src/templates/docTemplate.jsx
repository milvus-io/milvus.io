import React, { useMemo, useState } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import Layout from '../components/layout';
import LeftNav from '../components/leftNavigation';
import { mdMenuListFactory } from '../components/leftNavigation/utils';
import { graphql } from 'gatsby';
import clsx from 'clsx';
import Aside from '../components/aside';
import Seo from '../components/seo';
import Footer from '../components/footer';
import {
  useCodeCopy,
  useMultipleCodeFilter,
  useFilter,
} from '../hooks/doc-dom-operation';
import { useGenAnchor } from '../hooks/doc-anchor';
import { useOpenedStatus } from '../hooks';
import DocContent from './parts/DocContent.jsx';
import HomeContent from './parts/HomeContent.jsx';
import { useLocation } from '@reach/router';
import '@zilliz/zui/dist/ZChart.css';
import './docsStyle.less';
import './docTemplate.less';
import 'highlight.js/styles/stackoverflow-light.css';

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          data
          language
          ns
        }
      }
    }
  }
`;

export default function Template({ data, pageContext }) {
  const {
    locale,
    version,
    versions,
    headings = [],
    allMenus,
    editPath,
    newHtml: mdHtml,
    homeData,
    newestVersion,
    relatedKey,
    old: mdId,
    summary,
    group,
    newestBlog,
    versionInfo,
  } = pageContext;
  const { pathname } = useLocation();

  const realVersion = useMemo(() => {
    const regex = /^v\d+/;
    const versionFromUrl = pathname.split('/')[2];
    const isVersionFormat = regex.test(versionFromUrl);
    return isVersionFormat ? versionFromUrl : newestVersion;
  }, [pathname, newestVersion]);

  const [isOpened, setIsOpened] = useState(false);
  useOpenedStatus(setIsOpened);

  const { language, t } = useI18next();
  const hljsCfg = {
    languages: ['java', 'go', 'python', 'javascript'],
  };
  const menuList = allMenus.find(
    v => locale === v.lang && v.version === realVersion
  );
  const id = 'home';
  const isHome = mdHtml === null;
  const menuConfig = menuList && {
    menuList: [
      {
        lang: menuList.lang,
        menuList: menuList.menuList,
      },
    ],
    activePost: id.split('-')[0],
    formatVersion: realVersion === 'master' ? newestVersion : realVersion,
  };
  const versionConfig = {
    homeTitle: 'Docs Home',
    version: realVersion,
    // filter master version
    versions: versions.filter(v => v !== 'master'),
  };

  const leftNavMenus =
    menuConfig?.menuList?.find(menu => menu.lang === locale)?.menuList || [];

  const leftNavHomeUrl =
    realVersion === `v0.x`
      ? `/docs/v0.x/overview.md`
      : `${realVersion === newestVersion ? `/docs` : `/docs/${realVersion}`}`;

  // generate menu
  const menus = mdMenuListFactory(
    leftNavMenus,
    'doc',
    realVersion === newestVersion ? '' : realVersion,
    locale
  )();

  // get version links on version change
  const getVersionLink = version => {
    const curVersionMenus =
      allMenus.find(v => v.version === version)?.menuList || [];
    const hasSamePage = curVersionMenus.some(
      v =>
        // mdId: some.md  v.id: language_some.id
        v.id === mdId
    );

    if (version === newestVersion) {
      return hasSamePage ? `/docs/${mdId}` : '/docs';
    } else {
      return hasSamePage ? `/docs/${version}/${mdId}` : `/docs/${version}`;
    }
  };

  // push API links if no home
  const APIs = {
    id: 'API',
    label: 'API reference',
    children: [],
  };

  if (versionInfo[realVersion] && versionInfo[realVersion].pymilvus) {
    APIs.children.push({
      id: 'pymilvus',
      label: 'Python',
      link: `/api-reference/pymilvus/${versionInfo[realVersion].pymilvus}/About.md`,
    });
  }

  if (versionInfo[realVersion] && versionInfo[realVersion].java) {
    APIs.children.push({
      id: 'java',
      label: 'Java',
      link: `/api-reference/java/${versionInfo[realVersion].java}/About.md`,
    });
  }

  if (versionInfo[realVersion] && versionInfo[realVersion].go) {
    APIs.children.push({
      id: 'go',
      label: 'Go',
      link: `/api-reference/go/${versionInfo[realVersion].go}/About.md`,
    });
  }

  if (versionInfo[realVersion] && versionInfo[realVersion].node) {
    APIs.children.push({
      id: 'node',
      label: 'Node',
      link: `/api-reference/node/${versionInfo[realVersion].node}/About.md`,
    });
  }

  if (versionInfo[realVersion] && versionInfo[realVersion].csharp) {
    APIs.children.push({
      id: 'csharp',
      label: 'C#',
      link: `/api-reference/csharp/${versionInfo[realVersion].csharp}/About.md`,
    });
  }

  if (versionInfo[realVersion] && versionInfo[realVersion].restful) {
    APIs.children.push({
      id: 'restful',
      label: 'RESTful',
      link: `/api-reference/restful/${versionInfo[realVersion].restful}/About.md`,
    });
  }

  // only merge api menus if menus.lenth > 0 and version > 1
  if (APIs.children.length > 0 && realVersion[1] * 1 > 1) {
    menus.push(APIs);
  }

  // generate commit path
  const commitPath = useMemo(() => {
    return locale === 'en' ? `site/en/${editPath}` : `site/zh-CN/${editPath}`;
  }, [locale, editPath]);

  // doc search meta
  const docsearchMeta = useMemo(() => {
    return [
      {
        name: 'docsearch:language',
        content: locale === 'cn' ? 'zh-cn' : locale,
      },
      {
        name: 'docsearch:version',
        content: realVersion || '',
      },
    ];
  }, [locale, realVersion]);

  // page title
  const title = isHome
    ? `Milvus ${
        realVersion === newestVersion
          ? `documentation`
          : `${realVersion} documentation`
      }`
    : `${headings[0] && headings[0].value}`;

  // page title template
  const titleTemplate = isHome
    ? `%s`
    : `%s Milvus ${
        realVersion === newestVersion
          ? `documentation`
          : `${realVersion} documentation`
      }`;

  useCodeCopy(
    {
      copy: t('v3trans.copyBtn.copyLabel'),
      copied: t('v3trans.copyBtn.copiedLabel'),
    },
    hljsCfg
  );
  useMultipleCodeFilter();
  useGenAnchor(realVersion, editPath);
  useFilter();

  let description = summary
    ? `${summary.replace('.', '')} ${realVersion}.`
    : `${title} for Milvus ${realVersion}`;

  return (
    <Layout
      t={t}
      showFooter={false}
      headerClassName="docHeader"
      version={realVersion}
    >
      <Seo
        title={title}
        titleTemplate={titleTemplate}
        lang={locale}
        version={realVersion}
        meta={docsearchMeta}
        description={description}
      />
      <div
        className={clsx('doc-temp-container', {
          [`home`]: homeData,
        })}
      >
        <LeftNav
          homeUrl={leftNavHomeUrl}
          homeLabel={t('v3trans.docs.homeTitle')}
          menus={menus}
          pageType="doc"
          locale={locale}
          versions={versionConfig.versions}
          version={realVersion}
          newestVersion={newestVersion}
          getVersionLink={getVersionLink}
          mdId={mdId}
          language={language}
          trans={t}
          group={group}
          isOpened={isOpened}
          onMenuCollapseUpdate={setIsOpened}
        />
        <div
          className={clsx('doc-right-container', {
            [`is-opened`]: isOpened,
          })}
        >
          <div
            className={clsx('doc-content-container', {
              [`doc-home`]: homeData,
            })}
          >
            {homeData ? (
              <HomeContent
                homeData={homeData}
                newestBlog={newestBlog}
                trans={t}
              />
            ) : (
              <DocContent
                htmlContent={mdHtml}
                commitPath={commitPath}
                mdId={mdId}
                version={realVersion}
                relatedKey={relatedKey}
                trans={t}
              />
            )}
            <div className="doc-toc-container">
              <Aside
                locale={locale}
                version={realVersion}
                editPath={editPath}
                mdTitle={headings[0]}
                category="doc"
                isHome={!!homeData}
                items={headings}
                title={t('v3trans.docs.tocTitle')}
              />
            </div>
          </div>
          <Footer t={t} darkMode={false} className="doc-right-footer" />
        </div>
      </div>
    </Layout>
  );
}
