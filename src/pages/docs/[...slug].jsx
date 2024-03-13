import docUtils from '@/utils/docs.utils';
import DocContent from '@/parts/docs/docContent';

import { markdownToHtml, copyToCommand } from '@/utils/common';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { linkIconTpl } from '@/components/icons';
import Aside from '@/components/aside';
import {
  useCopyCode,
  useFilter,
  useMultipleCodeFilter,
} from '@/hooks/enhanceCodeBlock';
import { useGenAnchor } from '@/hooks/doc-anchor';
import { recursionUpdateTree, getMenuInfoById } from '@/utils/docUtils';
import LeftNavSection from '@/parts/docs/leftNavTree';
import DocLayout from '@/components/layout/docLayout';
import { ABSOLUTE_BASE_URL } from '@/consts';
import classes from '@/styles/docDetail.module.less';
import { checkIconTpl } from '@/components/icons';

export default function DocDetailPage(props) {
  const {
    homeData,
    isHome,
    blogs,
    version,
    locale,
    versions,
    newestVersion,
    menus,
    id: currentId,
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

  const { t } = useTranslation('common');

  const seoInfo = useMemo(() => {
    return {
      title: `${frontMatter?.title} | Milvus`,
      url: `${ABSOLUTE_BASE_URL}/docs/${version}/${currentId}`,
      desc: summary,
    };
  }, [frontMatter, version, currentId, summary]);

  const [isOpened, setIsOpened] = useState(false);
  const [menuTree, setMenuTree] = useState(menus);
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const pageHref = useRef('');

  const components = {
    img: props => (
      // height and width are part of the props, so they get automatically passed here with {...props}
      <Image {...props} layout="responsive" loading="lazy" />
    ),
  };

  // const handleNodeClick = (nodeId, parentIds, isPage = false) => {
  //   const updatedTree = recursionUpdateTree(
  //     menuTree,
  //     nodeId,
  //     parentIds,
  //     isPage
  //   );
  //   setMenuTree(updatedTree);
  // };

  // useEffect(() => {
  //   // active initial menu item
  //   const currentMenuInfo = getMenuInfoById(menus, currentId);
  //   if (!currentMenuInfo) {
  //     return;
  //   }
  //   handleNodeClick(currentId, currentMenuInfo.parentIds, true);
  //   // eslint-disable-next-line
  // }, []);

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
            } = e.currentTarget;
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
  useGenAnchor(version, editPath);

  return (
    <DocLayout
      seo={seoInfo}
      left={
        <LeftNavSection
          tree={menuTree}
          className={classes.docMenu}
          version={version}
          versions={versions}
          linkPrefix={`/docs`}
          locale={locale}
          home={{
            label: 'Home',
            link: `/docs/${version}`,
          }}
          currentMdId={currentId}
          groupId={frontMatter.group}
          latestVersion={newestVersion}
        />
      }
      center={
        <section className={classes.docDetailContainer}>
          <div className={classes.contentSection}>
            <DocContent
              version={version}
              htmlContent={tree}
              mdId={currentId}
              commitPath={editPath}
            />
          </div>

          <div className={classes.asideSection}>
            <Aside
              locale={locale}
              version={version}
              editPath={editPath}
              mdTitle={frontMatter.title}
              category="doc"
              items={anchorList}
              title={t('v3trans.docs.tocTitle')}
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
  const { newestVersion } = docUtils.getVersion();
  const { contentList } = docUtils.getAllData();
  const filteredList = contentList.filter(v => v.version !== newestVersion);
  // const paths = docUtils.getDocRouter(filteredList);

  const paths = filteredList.map(v => {
    return {
      params: { slug: [v.version, v.id] },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async context => {
  const { params, locale = 'en' } = context;

  const [version, id] = params.slug;

  const { versions, newestVersion } = docUtils.getVersion();

  const { docData, contentList } = docUtils.getAllData();

  const {
    content,
    editPath,
    data: frontMatter,
  } = docUtils.getDocContent(contentList, version, id);
  const docMenus = docUtils.getDocMenu(docData, version);

  const { tree, codeList, headingContent, anchorList } = await markdownToHtml(
    content,
    {
      showAnchor: true,
      version,
    }
  );

  return {
    props: {
      homeData: {
        tree,
        codeList,
        headingContent,
        anchorList,
        summary: frontMatter.summary || '',
        editPath,
        frontMatter,
      },
      isHome: false,
      blogs: [],
      version,
      locale,
      versions,
      newestVersion,
      menus: docMenus,
      id,
    },
  };
};
