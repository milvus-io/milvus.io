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

  const [isOpened, setIsOpened] = useState(false);
  useOpenedStatus(setIsOpened);

  const { language, t } = useI18next();
  const hljsCfg = {
    languages: ['java', 'go', 'python', 'javascript'],
  };
  const menuList = allMenus.find(v => locale === v.lang && v.version === version);
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
    formatVersion: version === 'master' ? newestVersion : version,
  };
  const versionConfig = {
    homeTitle: 'Docs Home',
    version,
    // filter master version
    versions: versions.filter(v => v !== 'master'),
  };
  const leftNavMenus =
    menuConfig?.menuList?.find(menu => menu.lang === locale)?.menuList || [];
  const leftNavHomeUrl =
    version === `v0.x`
      ? `/docs/v0.x/overview.md`
      : `${version === newestVersion ? `/docs` : `/docs/${version}`}`;

  // generate menu
  const menus = mdMenuListFactory(
    leftNavMenus,
    'doc',
    version === newestVersion ? '' : version,
    locale
  )();
  // push API links if no home

  const APIs = {
    id: 'API',
    label: 'API reference',
    children: [],
  };

  if (versionInfo[version] && versionInfo[version].pymilvus) {
    APIs.children.push({
      id: 'pymilvus',
      label: 'Python',
      link: `/api-reference/pymilvus/${versionInfo[version].pymilvus}/About.md`,
    });
  }

  if (versionInfo[version] && versionInfo[version].java) {
    APIs.children.push({
      id: 'java',
      label: 'Java',
      link: `/api-reference/java/${versionInfo[version].java}/About.md`,
    });
  }

  if (versionInfo[version] && versionInfo[version].go) {
    APIs.children.push({
      id: 'go',
      label: 'Go',
      link: `/api-reference/go/${versionInfo[version].go}/About.md`,
    });
  }

  if (versionInfo[version] && versionInfo[version].node) {
    APIs.children.push({
      id: 'node',
      label: 'Node',
      link: `/api-reference/node/${versionInfo[version].node}/About.md`,
    });
  }

  console.log(versionInfo)

  if (versionInfo[version] && versionInfo[version].csharp) {
    APIs.children.push({
      id: 'csharp',
      label: 'C#',
      link: `/api-reference/csharp/${versionInfo[version].csharp}/About.md`,
    });
  }

  if (versionInfo[version] && versionInfo[version].restful) {
    APIs.children.push({
      id: 'restful',
      label: 'RESTful',
      link: `/api-reference/restful/${versionInfo[version].restful}/About.md`,
    });
  }

  // only merge api menus if menus.lenth > 0 and version > 1
  if (APIs.children.length > 0 && version[1] * 1 > 1) {
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
        content: version || '',
      },
    ];
  }, [locale, version]);

  // page title
  const title = isHome
    ? `Milvus ${
        version === newestVersion ? `documentation` : `${version} documentation`
      }`
    : `${headings[0] && headings[0].value}`;

  // page title template
  const titleTemplate = isHome
    ? `%s`
    : `%s Milvus ${
        version === newestVersion ? `documentation` : `${version} documentation`
      }`;

  useCodeCopy(
    {
      copy: t('v3trans.copyBtn.copyLabel'),
      copied: t('v3trans.copyBtn.copiedLabel'),
    },
    hljsCfg
  );
  useMultipleCodeFilter();
  useGenAnchor(version, editPath);
  useFilter();

  let description = summary
    ? `${summary.replace('.', '')} ${version}.`
    : `${title} for Milvus ${version}`;

  return (
    <Layout
      t={t}
      showFooter={false}
      headerClassName="docHeader"
      version={version}
    >
      <Seo
        title={title}
        titleTemplate={titleTemplate}
        lang={locale}
        version={version}
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
          version={version}
          newestVersion={newestVersion}
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
                version={version}
                relatedKey={relatedKey}
                trans={t}
              />
            )}
            <div className="doc-toc-container">
              <Aside
                locale={locale}
                version={version}
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
