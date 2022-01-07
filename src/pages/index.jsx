import React, { useState } from "react";
import { graphql } from "gatsby";
import { useI18next } from "gatsby-plugin-react-i18next";
import "./index.less";
import { useWindowSize } from "../http/hooks";
import Layout from "../components/layout";
import Signup from "../components/signup";
import HomeBanner from "../components/home/banner";
import HomeFeatures from "../components/home/features";
import HomeCode from "../components/home/code";
import { CustomizedSnackbars } from "../components/snackBar";

// markup
const IndexPage = () => {
  const { t } = useI18next();

  const currentSize = useWindowSize();
  const isMobile = ["phone", "tablet"].includes(currentSize);

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

  return (
    <main className="homepage">
      <Layout darkMode={true} t={t}>
        {/* all css about banner in banner.less */}
        <HomeBanner />
        {/* all these sections about banner in banner.less */}

        <HomeFeatures />
        <HomeCode />

        <Signup isMobile={isMobile} callback={handleOpenSnackbar} />
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
