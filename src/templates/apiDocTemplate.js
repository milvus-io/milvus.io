import React, { useState, useMemo } from 'react';
import { graphql } from 'gatsby';
import { useI18next } from 'gatsby-plugin-react-i18next';
import clsx from 'clsx';
import Layout from '../components/layout';
import LeftNav from '../components/leftNavigation';
import { mdMenuListFactory } from '../components/leftNavigation/utils';
import Aside from '../components/aside';
import Footer from '../components/footer';
import Seo from '../components/seo';
import { useCodeCopy } from '../hooks/doc-dom-operation';
import { useOpenedStatus } from '../hooks';
import 'highlight.js/styles/stackoverflow-light.css';
import './docTemplate.less';
import { findLatestVersion } from '../utils';

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
    allVersion(filter: { released: { eq: "yes" } }) {
      nodes {
        version
      }
    }
  }
`;

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

export default function Template({ data, pageContext }) {
  const { allVersion } = data;
  const { doc, name, allApiMenus, version, locale, category, docVersion } =
    pageContext;
  // left nav toggle state
  const [isOpened, setIsOpened] = useState(false);
  // recover state
  useOpenedStatus(setIsOpened);
  // i18n
  const { t } = useI18next();

  // https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md
  // Specify supported languages to fix Java doc code layout.
  const hljsCfg = {
    languages: ['java', 'go', 'python', 'javascript'],
  };

  useCodeCopy(
    {
      copy: t('v3trans.copyBtn.copyLabel'),
      copied: t('v3trans.copyBtn.copiedLabel'),
    },
    hljsCfg
  );

  // get all versions of the current API
  const versions = Object.keys(allApiMenus[category]);
  // get current version's menu of the current API
  const currentApiMenu = allApiMenus[category][version];
  // generate menus
  const menus = mdMenuListFactory(currentApiMenu, 'api', version, locale)();

  // get version links on version change
  const getApiVersionLink = version => {
    const currentApiMenu = allApiMenus[category][version];
    const hasSamePage = currentApiMenu.some(
      v =>
        // pId: some.md  v.id: language_some.id
        v.id === `${category}_${pageContext.pId}`
    );

    return hasSamePage
      ? `/api-reference/${category}/${version}/${pageContext.pId}`
      : `/docs`;
  };

  // Generate apiReferenceData.sourceUrl for final page's Edit Button.
  const apiReferenceData = {
    projName: category,
    relativePath: name,
    apiVersion: version,
  };
  switch (category) {
    case 'pymilvus':
      const path = name?.split('pymilvus_')?.[1]?.replace('.html', '.rst');
      const url = `https://github.com/milvus-io/pymilvus/edit/${version.slice(
        1
      )}/docs/source/${path}`;
      apiReferenceData.sourceUrl = url;

      if (name.endsWith('.md')) {
        apiReferenceData.sourceUrl = `https://github.com/milvus-io/web-content/edit/master/API_Reference/pymilvus/${version}/${name.replace(
          'pymilvus_',
          ''
        )}`;
      }
      break;

    case 'java':
      if (name.endsWith('.md')) {
        apiReferenceData.sourceUrl = `https://github.com/milvus-io/web-content/edit/master/API_Reference/milvus-sdk-java/${version}/${name.replace(
          'java_',
          ''
        )}`;
      }
      break;

    case 'go':
      if (name.endsWith('.md')) {
        apiReferenceData.sourceUrl = `https://github.com/milvus-io/web-content/edit/master/API_Reference/milvus-sdk-go/${version}/${name.replace(
          'go_',
          ''
        )}`;
      }
      break;

    case 'node':
      if (name.endsWith('.html')) {
        const relativePath = name
          ?.split('node_')?.[1]
          ?.replace('.html', '.ts')
          ?.split('/')
          ?.pop();
        const transformName = (originName = '') => {
          if (originName === 'index.ts') return 'MilvusIndex.ts';
          return originName.charAt(0).toUpperCase() + originName.slice(1);
        };
        if (name.includes('api reference')) {
          const fileName = transformName(relativePath);
          apiReferenceData.sourceUrl = `https://github.com/milvus-io/milvus-sdk-node/edit/main/milvus/${fileName}`;
        }
        if (name.includes('tutorial')) {
          apiReferenceData.sourceUrl =
            'https://github.com/milvus-io/milvus-sdk-node/edit/main/README.md';
        }
      }

      if (name.endsWith('.md')) {
        apiReferenceData.sourceUrl = `https://github.com/milvus-io/web-content/edit/master/API_Reference/milvus-sdk-node/${version}/${name.replace(
          'node_',
          ''
        )}`;
      }
      break;

    case 'restful':
      apiReferenceData.sourceUrl = `https://github.com/milvus-io/web-content/edit/master/API_Reference/milvus-sdk-restful/${version}/${name.replace(
        'restful_',
        ''
      )}`;
      break;
    default:
      break;
  }

  // doc search meta
  const docsearchMeta = useMemo(() => {
    if (
      typeof window === 'undefined' ||
      !window.location.pathname.includes(version)
    ) {
      return [];
    }
    return [
      {
        name: 'docsearch:language',
        content: locale === 'cn' ? 'zh-cn' : locale,
      },
      {
        name: 'docsearch:version',
        content: docVersion || '',
      },
    ];
  }, [locale, docVersion]);

  const newestVersion = findLatestVersion(allVersion.nodes);

  return (
    <Layout t={t} showFooter={false} headerClassName="docHeader" version={newestVersion}>
      <Seo
        title={`${capitalizeFirstLetter(category)} SDK ${version} for Milvus`}
        titleTemplate="%s"
        lang={locale}
        version={version}
        meta={docsearchMeta}
      />
      <div className={'doc-temp-container'}>
        <LeftNav
          homeUrl={'/docs'}
          homeLabel={'< Docs'}
          menus={menus}
          locale={locale}
          versions={versions}
          version={version}
          getVersionLink={getApiVersionLink}
          mdId={name}
          trans={t}
          isOpened={isOpened}
          onMenuCollapseUpdate={setIsOpened}
          showSearch={false}
        />
        <div
          className={clsx('doc-right-container', {
            [`is-opened`]: isOpened,
          })}
        >
          <div className={'doc-content-container'}>
            <div className="doc-post-wrapper doc-style">
              <div
                className={`api-reference-wrapper doc-post-content doc-style ${category}`}
                dangerouslySetInnerHTML={{ __html: doc }}
              ></div>
            </div>
            <div className="doc-toc-container">
              <Aside
                apiReferenceData={apiReferenceData}
                category="api"
                isHome={false}
              />
            </div>
          </div>
          <Footer t={t} darkMode={false} className="doc-right-footer" />
        </div>
      </div>
    </Layout>
  );
}
