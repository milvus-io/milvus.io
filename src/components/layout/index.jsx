import React from 'react';
import Header from '../header';
import Footer from '../footer';
// import * as styles from "./index.module.less";

const Layout = ({
  darkMode,
  children,
  showFooter = true,
  t,
  headerClassName,
  version=''
}) => {

  console.log('version: ' + version);
  return (
    <>
      <Header darkMode={darkMode} t={t} className={headerClassName} version={version} />
      {children}
      {showFooter && <Footer t={t} />}
    </>
  );
};

export default Layout;
