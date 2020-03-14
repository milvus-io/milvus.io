/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import Header from "../header/header";
import Footer from "../footer/footer";
import LocalizeLink from "../localizedLink/localizedLink";

import '../../scss/guiLayout.scss'
const Layout = ({ children, language, locale }) => {
  const { section6 } = language.home;

  return (
    <>
      <Header language={language} locale={locale} />
      <div className="gui-layout-wrapper">
        <main>{children}</main>
      </div>
      <section className="section6">
        <div>
          <span>{section6.title}</span>
          <LocalizeLink
            locale={locale}
            className=" get-start"
            to={"/docs/guides/get_started/install_milvus/install_milvus.md"}
          >
            {section6.button}
          </LocalizeLink>
        </div>
      </section>
      <Footer language={language} locale={locale}></Footer>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  language: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired
};

export default Layout;
