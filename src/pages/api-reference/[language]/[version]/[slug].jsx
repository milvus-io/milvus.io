import { api_reference } from '../../../../utils/milvus';
import React, { useState } from 'react';
import clsx from 'clsx';
import Layout from '../../../../components/layout';
import MenuTree from '../../../../components/tree';
import { useTranslation } from 'react-i18next';
import { mdMenuListFactory } from '../../../../components/leftNavigation/utils';
import Aside from '../../../../components/aside';
import Footer from '../../../../components/footer';
// import { useCodeCopy } from '../hooks/doc-dom-operation';
// import { useOpenedStatus } from '../hooks';
import { markdownToHtml } from '../../../../utils/common';
import { recursionUpdateTree } from '../../../../utils/docUtils';
import * as classes from '../../../../styles/docHome.module.less';
import VersionSelector from '../../../../components/versionSelector';

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

export default function Template(props) {
  const { doc, name, menus, version, locale, category, versions } = props;
  const { t } = useTranslation('common');

  // left nav toggle state
  const [isOpened, setIsOpened] = useState(false);
  const [menuTree, setMenuTree] = useState(menus);

  const handleNodeClick = (nodeId, parentIds, isPage = false) => {
    // const updatedTree = isPage
    //   ? handleClickMenuPageItem(menus, nodeId, parentIds)
    //   : handleClickPureMenuItem(menus, nodeId, parentIds);
    const updatedTree = recursionUpdateTree(
      menuTree,
      nodeId,
      parentIds,
      isPage
    );
    setMenuTree(updatedTree);
  };

  // recover state
  // useOpenedStatus(setIsOpened);

  // https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md
  // Specify supported languages to fix Java doc code layout.
  const hljsCfg = {
    languages: ['java', 'go', 'python', 'javascript'],
  };

  // useCodeCopy(
  //   {
  //     copy: t('v3trans.copyBtn.copyLabel'),
  //     copied: t('v3trans.copyBtn.copiedLabel'),
  //   },
  //   hljsCfg
  // );

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

  return (
    <Layout t={t} showFooter={false} headerClassName="docHeader">
      <div className={'doc-temp-container'}>
        <div className={classes.menuContainer}>
          <VersionSelector
            versions={versions}
            curVersion={version}
            programLang={category}
            homeLabel="Home"
          />
          <MenuTree
            tree={menuTree}
            onNodeClick={handleNodeClick}
            className={classes.docMenu}
            version={version}
          />
        </div>
        <div
          className={clsx('doc-right-container', {
            [`is-opened`]: isOpened,
          })}
        >
          <div className={'doc-content-container'}>
            <div className="doc-post-wrapper doc-style">
              <div
                className={`api-reference-wrapper doc-style ${category}`}
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

export const getStaticPaths = () => {
  const { routers } = api_reference.getApiData();

  return {
    paths: routers,
    fallback: false,
  };
};

export const getStaticProps = async ({
  locale,
  params: { language, version, slug },
}) => {
  console.log();
  const menus = api_reference.getMenus(language, version);
  const doc = api_reference.getContent(language, version, slug);
  const { versions } = api_reference.getVersions(language);

  const { tree } = await markdownToHtml(doc.content);

  return {
    props: {
      doc: tree,
      name: slug,
      menus,
      version,
      locale,
      category: language,
      versions: versions,
    },
  };
};
