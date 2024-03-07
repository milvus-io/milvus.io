import LeftNavSection from '../../../../parts/docs/leftNavTree';
import { useTranslation } from 'react-i18next';
import Aside from '../../../../components/aside';
// import { useCodeCopy } from '../hooks/doc-dom-operation';
import { markdownToHtml } from '../../../../utils/common';
import { recursionUpdateTree } from '../../../../utils/docUtils';
import classes from '../../../../styles/docDetail.module.less';
import apiUtils from '../../../../utils/apiReference.utils';
import DocLayout from '../../../../components/layout/docLayout';
import DocContent from '../../../../parts/docs/docContent';
import { useState } from 'react';

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

export default function Template(props) {
  const {
    doc,
    name,
    menus,
    version,
    locale,
    category,
    versions,
    id: currentId,
  } = props;
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
  // switch (category) {
  //   case 'pymilvus':
  //     const path = name?.split('pymilvus_')?.[1]?.replace('.html', '.rst');
  //     const url = `https://github.com/milvus-io/pymilvus/edit/${version.slice(
  //       1
  //     )}/docs/source/${path}`;
  //     apiReferenceData.sourceUrl = url;

  //     if (name.endsWith('.md')) {
  //       apiReferenceData.sourceUrl = `https://github.com/milvus-io/web-content/edit/master/API_Reference/pymilvus/${version}/${name.replace(
  //         'pymilvus_',
  //         ''
  //       )}`;
  //     }
  //     break;

  //   case 'java':
  //     if (name.endsWith('.md')) {
  //       apiReferenceData.sourceUrl = `https://github.com/milvus-io/web-content/edit/master/API_Reference/milvus-sdk-java/${version}/${name.replace(
  //         'java_',
  //         ''
  //       )}`;
  //     }
  //     break;

  //   case 'go':
  //     if (name.endsWith('.md')) {
  //       apiReferenceData.sourceUrl = `https://github.com/milvus-io/web-content/edit/master/API_Reference/milvus-sdk-go/${version}/${name.replace(
  //         'go_',
  //         ''
  //       )}`;
  //     }
  //     break;

  //   case 'node':
  //     if (name.endsWith('.html')) {
  //       const relativePath = name
  //         ?.split('node_')?.[1]
  //         ?.replace('.html', '.ts')
  //         ?.split('/')
  //         ?.pop();
  //       const transformName = (originName = '') => {
  //         if (originName === 'index.ts') return 'MilvusIndex.ts';
  //         return originName.charAt(0).toUpperCase() + originName.slice(1);
  //       };
  //       if (name.includes('api reference')) {
  //         const fileName = transformName(relativePath);
  //         apiReferenceData.sourceUrl = `https://github.com/milvus-io/milvus-sdk-node/edit/main/milvus/${fileName}`;
  //       }
  //       if (name.includes('tutorial')) {
  //         apiReferenceData.sourceUrl =
  //           'https://github.com/milvus-io/milvus-sdk-node/edit/main/README.md';
  //       }
  //     }

  //     if (name.endsWith('.md')) {
  //       apiReferenceData.sourceUrl = `https://github.com/milvus-io/web-content/edit/master/API_Reference/milvus-sdk-node/${version}/${name.replace(
  //         'node_',
  //         ''
  //       )}`;
  //     }
  //     break;

  //   case 'restful':
  //     apiReferenceData.sourceUrl = `https://github.com/milvus-io/web-content/edit/master/API_Reference/milvus-sdk-restful/${version}/${name.replace(
  //       'restful_',
  //       ''
  //     )}`;
  //     break;
  //   default:
  //     break;
  // }

  const versionLinkPrefix = `/api-reference/${category}`;

  return (
    <DocLayout
      left={
        <LeftNavSection
          tree={menuTree}
          className={classes.docMenu}
          version={version}
          versions={versions}
          linkPrefix={versionLinkPrefix}
          linkSuffix="About.md"
          locale={locale}
          trans={t}
          home={{
            label: 'Doc',
            link: '/docs',
          }}
          currentMdId={currentId}
        />
      }
      center={
        <section className={classes.docDetailContainer}>
          <div className={classes.contentSection}>
            <DocContent version={version} htmlContent={doc} mdId={name} />
          </div>

          <div className={classes.asideSection}>
            <Aside
              apiReferenceData={apiReferenceData}
              category="api"
              isHome={false}
              classes={{
                root: classes.rightAnchorTreeWrapper,
              }}
            />
          </div>
        </section>
      }
    />
  );
}

export const getStaticPaths = () => {
  const routerList = apiUtils.getRouter();

  return {
    paths: routerList,
    fallback: false,
  };
};

export const getStaticProps = async ({
  locale = 'en',
  params: { language, version, slug },
}) => {
  const menu = apiUtils.getMenu(language, version);
  const id = slug instanceof Array ? slug.join('/') : slug;
  const doc = apiUtils.getDoc(language, version, id);
  const { versions } = apiUtils.getVersions();

  const { tree } = await markdownToHtml(doc.content);

  return {
    props: {
      doc: tree,
      name: slug,
      menus: menu,
      version,
      locale,
      category: language,
      versions: versions,
      id: slug,
    },
  };
};
