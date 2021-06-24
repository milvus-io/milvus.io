import React from 'react';
import PropTypes from 'prop-types';
import Header from '../../header/v2';
import Footer from '../../footer/footer';
import * as styles from './404Layout.module.less';

const Layout = ({ children, language, locale }) => {
  return (
    <>
      <Header language={language} locale={locale} />
      <div className={styles.contentWrapper}>
        <main>{children}</main>
      </div>
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
