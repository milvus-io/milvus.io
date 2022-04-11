import React, { useEffect, useState } from "react";
import { useI18next } from "gatsby-plugin-react-i18next";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import clsx from "clsx";
import { useWindowSize } from "../http/hooks";
import LeftNav from "../components/leftNavigation";
import Aside from "../components/aside";
import Footer from "../components/footer";
import Seo from "../components/seo";
import { useOpenedStatus } from "../hooks";
import "./communityTemplate.less";

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

  const [windowSize, setWindowSize] = useState("desktop1440");
  const [isOpened, setIsOpened] = useState(false);

  useOpenedStatus(setIsOpened);

  const currentWindowSize = useWindowSize();

  useEffect(() => {
    setWindowSize(currentWindowSize);
  }, [currentWindowSize]);

  const isMobile = ["phone", "tablet"].includes(windowSize);

  const { language, t } = useI18next();

  const isHomePage = activePost === "home.md";

  const TITLE = isHomePage
    ? `Milvus Community`
    : `${headings[0] && headings[0].value}`;
  const DESC = "Join Milvus Community";

  const titleTemplate = isHomePage ? "%s" : "%s - Milvus Community";

  const leftNavMenus =
    menuList?.find(menu => menu.lang === locale)?.menuList || [];

  return (
    <Layout t={t} showFooter={false} headerClassName="docHeader">
      <Seo
        title={TITLE}
        titleTemplate={titleTemplate}
        lang={language}
        description={DESC}
      />
      <div
        className={clsx("doc-temp-container", {
          [`home`]: isHomePage,
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
          isOpened={isOpened}
          onMenuCollapseUpdate={setIsOpened}
        />
        <div
          className={clsx("doc-right-container", {
            [`is-opened`]: isOpened,
          })}
        >
          <div
            className={clsx("doc-content-container", {
              [`community-home`]: isHomePage,
            })}
          >
            <div
              className={clsx({ "doc-post-wrapper": !isHomePage }, `doc-style`)}
            >
              <div
                className={clsx({
                  [`community-home-html-wrapper`]: isHomePage,
                  [`doc-post-content`]: !isHomePage,
                })}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
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
          </div>
          <Footer t={t} darkMode={false} className="doc-right-footer" />
        </div>
      </div>
    </Layout>
  );
}
