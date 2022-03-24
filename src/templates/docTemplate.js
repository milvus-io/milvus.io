import React, { useEffect, useMemo, useState } from "react";
import { useI18next } from "gatsby-plugin-react-i18next";
import Layout from "../components/layout";
import LeftNav from "../components/leftNavigation";
import { graphql } from "gatsby";
import clsx from "clsx";
import Aside from "../components/aside";
import Seo from "../components/seo";
import Footer from "../components/footer";
import {
  useCodeCopy,
  useMultipleCodeFilter,
  useFilter,
} from "../hooks/doc-dom-operation";
import { useGenAnchor } from "../hooks/doc-anchor";
import { useCollapseStatus, useDocContainerFlexibleStyle } from "../hooks";
import { useWindowSize } from "../http/hooks";
import DocContent from "./parts/DocContent.jsx";
import HomeContent from "./parts/HomeContent.jsx";
import "@zilliz/zui/dist/ZChart.css";
import "./docTemplate.less";
import "highlight.js/styles/stackoverflow-light.css";

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
    isBlog,
    isBenchmark = false,
    editPath,
    newHtml: mdHtml,
    homeData,
    allApiMenus,
    newestVersion,
    relatedKey,
    old: mdId,
    summary,
    group,
    newestBlog,
  } = pageContext;
  const [windowSize, setWindowSize] = useState("desktop1440");
  const [isCollapse, setIsCollapse] = useState(false);
  useCollapseStatus(setIsCollapse);

  const currentWindowSize = useWindowSize();

  useEffect(() => {
    setWindowSize(currentWindowSize);
  }, [currentWindowSize]);

  const isMobile = ["phone", "tablet"].includes(windowSize);
  const isPhone = ["phone"].includes(windowSize);

  const { language, t } = useI18next();
  const hljsCfg = {
    languages: ["java", "go", "python", "javascript"],
  };

  const menuList = allMenus.find(
    v =>
      v.absolutePath.includes(version) &&
      isBlog === v.isBlog &&
      locale === v.lang
  );
  const id = "home";
  const menuConfig = menuList && {
    menuList: [
      {
        lang: menuList.lang,
        menuList: menuList.menuList,
      },
    ],
    activePost: id.split("-")[0],
    isBlog: menuList.isBlog,
    formatVersion: version === "master" ? newestVersion : version,
  };
  const versionConfig = {
    homeTitle: "Docs Home",
    version,
    // filter master version
    versions: versions.filter(v => v !== "master"),
  };
  const leftNavMenus =
    menuConfig?.menuList?.find(menu => menu.lang === locale)?.menuList || [];
  const leftNavHomeUrl =
    version === `v0.x` ? `/docs/v0.x/overview.md` : `/docs/${version}`;

  const commitPath = useMemo(() => {
    return locale === "en" ? `site/en/${editPath}` : `site/zh-CN/${editPath}`;
  }, [locale, editPath]);
  const isDoc = !(isBlog || isBenchmark);

  const docContainerFlexibleStyle = useDocContainerFlexibleStyle(
    isMobile,
    isCollapse
  );

  const docsearchMeta = useMemo(() => {
    if (
      typeof window === "undefined" ||
      !window.location.pathname.includes(version)
    ) {
      return [];
    }
    return [
      {
        name: "docsearch:language",
        content: locale === "cn" ? "zh-cn" : locale,
      },
      {
        name: "docsearch:version",
        content: version || "",
      },
    ];
  }, [locale, version]);

  const title =
    mdHtml === null
      ? `Milvus documentation`
      : `${headings[0] && headings[0].value}`;

  useCodeCopy(
    {
      copy: t("v3trans.copyBtn.copyLabel"),
      copied: t("v3trans.copyBtn.copiedLabel"),
    },
    hljsCfg
  );
  useMultipleCodeFilter();
  useGenAnchor(version, editPath);
  useFilter();
  return (
    <Layout
      t={t}
      windowSize={currentWindowSize}
      showFooter={false}
      headerClassName="docHeader"
    >
      <Seo
        title={title}
        lang={locale}
        version={version}
        meta={docsearchMeta}
        description={summary}
      />
      <div
        className={clsx("doc-temp-container", {
          [`home`]: homeData,
        })}
      >
        <LeftNav
          homeUrl={leftNavHomeUrl}
          homeLabel={t("v3trans.docs.homeTitle")}
          menus={leftNavMenus}
          apiMenus={allApiMenus}
          pageType="doc"
          currentVersion={version}
          locale={locale}
          docVersions={versionConfig.versions}
          mdId={mdId}
          isMobile={isMobile}
          language={language}
          trans={t}
          version={version}
          group={group}
          setIsCollapse={setIsCollapse}
        />
        <div
          className="doc-right-container"
          style={{ marginLeft: docContainerFlexibleStyle.marginLeft }}
        >
          <div
            className={clsx("doc-content-container", {
              [`doc-home`]: homeData,
              [`is-mobile`]: isMobile,
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
                isDoc={isDoc}
                mdId={mdId}
                version={version}
                relatedKey={relatedKey}
                isMobile={isMobile}
                trans={t}
                docContainerFlexibleStyle={docContainerFlexibleStyle}
              />
            )}
            {!isPhone && (
              <div className="doc-toc-container">
                <Aside
                  locale={locale}
                  version={version}
                  editPath={editPath}
                  mdTitle={headings[0]}
                  category="doc"
                  isHome={!!homeData}
                  items={headings}
                  title={t("v3trans.docs.tocTitle")}
                />
              </div>
            )}
          </div>
          <Footer t={t} darkMode={false} className="doc-right-footer" />
        </div>
      </div>
    </Layout>
  );
}
