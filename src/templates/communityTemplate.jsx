import React, { useEffect, useState } from "react";
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

  const currentWindowSize = useWindowSize();

  useEffect(() => {
    setWindowSize(currentWindowSize);
  }, [currentWindowSize]);

  const isMobile = ["phone", "tablet"].includes(windowSize);
  const isPhone = ["phone"].includes(windowSize);
  const desktop1024 = ["desktop1024"].includes(windowSize);

  const { language, t } = useI18next();

  const isHomePage = activePost === "home.md";
  const TITLE = "Milvus Community";
  const DESC = "Join Milvus Community";

  const leftNavMenus =
    menuList?.find(menu => menu.lang === locale)?.menuList || [];

  return (
    <Layout t={t} showFooter={false}>
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
        />
        <div className="doc-right-container">
          <div
            className={clsx("doc-content-container", {
              [`community-home`]: isHomePage,
              [`is-mobile`]: isMobile,
            })}
          >
            <div className={clsx({ ["doc-post-wrapper"]: !isHomePage })}>
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
