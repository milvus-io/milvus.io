import React from "react";
import Header from "../header";
import Footer from "../footer";
// import * as styles from "./index.module.less";

const Layout = ({ darkMode, children, showFooter = true, t }) => {
  return (
    <>
      <Header darkMode={darkMode} t={t} />
      {children}
      {showFooter && <Footer t={t} />}
    </>
  );
};

export default Layout;
