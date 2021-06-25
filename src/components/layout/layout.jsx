/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import Header from '../header/header';
import Footer from '../footer/footer';

import * as styles from './layout.module.less';
import '../../reset.less';
const Layout = ({ children, language, locale }) => {
  return (
    <>
      <Header language={language} locale={locale} />
      <div className={styles.contentWrapper}>{children}</div>
      <Footer language={language} locale={locale}></Footer>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  language: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
};

export default Layout;
