import React, { useState } from "react";
import { graphql } from "gatsby";
import { useI18next } from "gatsby-plugin-react-i18next";
import "./index.less";
import * as styles from "./index.module.less";
import Layout from "../components/layout";
import Signup from "../components/signup";
import HomeBanner from "../components/home/banner";
import HomeFeatures from "../components/home/features";
import HomeCode from "../components/home/code";
import Attu from "../components/home/attu";
import { CustomizedSnackbars } from "../components/snackBar";
import cmb from "../images/brands/cmb.png";
import ebay from "../images/brands/ebay.png";
import ikea from "../images/brands/ikea.png";
import intuit from "../images/brands/intuit.png";
import kuaishou from "../images/brands/kuaishou.png";
import line from "../images/brands/line.png";
import pingan from "../images/brands/pingan.png";
import shopee from "../images/brands/shopee.png";
import smartnews from "../images/brands/smartnews.png";
import vivo from "../images/brands/vivo.png";
import walmart from "../images/brands/walmart.png";
import xiaomi from "../images/brands/xiaomi.png";
import CustomIconLink from "../components/customIconLink";

const brands = [
  {
    name: "cmb",
    icon: cmb,
  },
  {
    name: "ebay",
    icon: ebay,
  },
  {
    name: "ikea",
    icon: ikea,
  },
  {
    name: "intuit",
    icon: intuit,
  },
  {
    name: "kuaishou",
    icon: kuaishou,
  },
  {
    name: "line",
    icon: line,
  },
  {
    name: "pingan",
    icon: pingan,
  },
  {
    name: "shopee",
    icon: shopee,
  },
  {
    name: "smartnews",
    icon: smartnews,
  },
  {
    name: "vivo",
    icon: vivo,
  },
  {
    name: "walmart",
    icon: walmart,
  },
  {
    name: "xiaomi",
    icon: xiaomi,
  },
];

const IndexPage = () => {
  const { t } = useI18next();
  const [snackbarConfig, setSnackbarConfig] = useState({
    open: false,
    type: "info",
    message: "",
  });

  const handleOpenSnackbar = ({ message, type }) => {
    setSnackbarConfig({
      open: true,
      type,
      message,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarConfig({
      open: false,
      type: "info",
      message: "",
    });
  };

  const communityLinks = [
    { name: "Slack", to: "https://slack.milvus.io" },
    { name: "Github", to: "https://github.com/milvus-io/milvus" },
    { name: "Forum", to: "https://discuss.milvus.io/" },
  ];

  return (
    <main className="homepage">
      <Layout darkMode={true} t={t}>
        {/* all css about banner in banner.less */}
        <HomeBanner t={t} />
        {/* all these sections about banner in banner.less */}

        <HomeFeatures t={t} />
        <HomeCode t={t} />
        <Attu t={t} />

        <section className={`${styles.community} col-4 col-8 col-12`}>
          <p className={styles.communityTitle}>
            {t("v3trans.main.communitytitle")}
          </p>
          <div className={styles.communityLinkContainer}>
            <p className={styles.communityLinkTitle}>
              {t("v3trans.main.communitydesc")}
            </p>
            <div className={styles.communityLinks}>
              {communityLinks.map(co => {
                return (
                  <CustomIconLink className={styles.communityLink} to={co.to}>
                    {co.name}
                  </CustomIconLink>
                );
              })}
            </div>
          </div>
        </section>

        <section className={`${styles.customer} col-4 col-8 col-12`}>
          <p className={styles.customerTitle}>{t("v3trans.main.customer")}</p>
          <div className={styles.brands}>
            {brands.map(b => (
              <img src={b.icon} alt={b.name} />
            ))}
          </div>
        </section>

        <Signup callback={handleOpenSnackbar} t={t} />
        <CustomizedSnackbars
          open={snackbarConfig.open}
          type={snackbarConfig.type}
          message={snackbarConfig.message}
          handleClose={handleCloseSnackbar}
        />
      </Layout>
    </main>
  );
};

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

export default IndexPage;
