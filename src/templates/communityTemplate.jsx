import React, { useEffect, useState, useMemo } from "react";
import { useI18next } from "gatsby-plugin-react-i18next";
import { graphql } from "gatsby";
import Layout from "../components/layout";
// import Typography from "@mui/material/Typography";
import clsx from "clsx";
import { useWindowSize } from "../http/hooks";
import "./communityTemplate.less";
import "./commonDocTemplate.less";
import LeftNav from "../components/leftNavigation";
// import TocTreeView from "../components/treeView/TocTreeView";
import Aside from "../components/aside";
import Footer from "../components/footer";
import "../css/variables/main.less";
import Seo from "../components/seo";
import { useCollapseStatus } from "../hooks";

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
    // fileAbsolutePath,
    html,
    headings,
    menuList,
    activePost,
    editPath,
    // isCommunity,
  } = pageContext;

  const [windowSize, setWindowSize] = useState();
  const [isCollapse, setIsCollapse] = useState(false);
  useCollapseStatus(setIsCollapse);

  const currentWindowSize = useWindowSize();

  useEffect(() => {
    setWindowSize(currentWindowSize);
  }, [currentWindowSize]);

  const isMobile = ["phone", "tablet"].includes(windowSize);
  const isPhone = ["phone"].includes(windowSize);
  const desktop1024 = ["desktop1024"].includes(windowSize);

  const docMarginLeft = useMemo(() => {
    if (isMobile) {
      return 0;
    } else {
      return isCollapse ? "20px" : "282px";
    }
  }, [isMobile, isCollapse]);

  const docMaxWidth = useMemo(() => {
    if (isMobile) {
      return "100%";
    } else {
      // original max_width: 950
      // menu_width: 282
      // gap: 20, when menu collapse
      return isCollapse ? `${950 + 282 - 20}px` : "950px";
    }
  }, [isMobile, isCollapse]);

  const { language, t } = useI18next();

  const isHomePage = activePost === "home.md";
  const TITLE = "Milvus Community";
  const DESC = "Join Milvus Community";

  const leftNavMenus =
    menuList?.find(menu => menu.lang === locale)?.menuList || [];

  useEffect(() => {
    const banner = document.querySelector('.community-h1-wrapper');
    if (!banner) {
      return;
    }
    if (isMobile) {
      banner.style.width = '100vw';
      return;
    }
    // original width: calc(100vw - 286px);
    const originalWidth = 'calc(100vw - 286px)';
    const expandedWidth = 'calc(100vw - 20px)';
    const width = isCollapse ? expandedWidth : originalWidth;
    banner.style.width = width;
  }, [isCollapse, isMobile]);

  return (
    <Layout t={t} showFooter={false} headerClassName="docHeader">
      <Seo title={TITLE} lang={language} description={DESC} />
      <div
        className={clsx("doc-temp-container", {
          [`is-desktop1024`]: desktop1024,
          [`is-mobile`]: isMobile,
          [`is-phone`]: isPhone,
          [`home`]: isHomePage,
          [`loading`]: !windowSize,
        })}
      >
        {/* TODO: "id": "#community_resources", #community_partners should be updated */}
        <LeftNav
          menus={leftNavMenus}
          apiMenus={[]}
          pageType="community"
          currentVersion={""}
          locale={locale}
          docVersions={[]}
          mdId={isHomePage ? "community" : activePost}
          isMobile={isMobile}
          language={language}
          trans={t}
          setIsCollapse={setIsCollapse}
        />
        <div className="doc-right-container" style={{ marginLeft: docMarginLeft }}>
          <div
            className={clsx("doc-content-container", {
              [`community-home`]: isHomePage,
              [`is-mobile`]: isMobile,
            })}
            style={{ maxWidth: docMaxWidth }}
          >
            <div className={clsx({ "doc-post-wrapper": !isHomePage })}
              style={{ maxWidth: docMaxWidth }}
            >
              <div
                className={clsx({
                  [`community-home-html-wrapper`]: isHomePage,
                  [`doc-post-content`]: !isHomePage,
                })}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
            {!isPhone && !!headings?.length && (
              <div className="doc-toc-container">
                <Aside
                  locale={locale}
                  // version={version}
                  editPath={editPath}
                  mdTitle={headings[0]}
                  category="doc"
                  isHome={isHomePage}
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
