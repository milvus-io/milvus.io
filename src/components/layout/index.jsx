import React from 'react';
import Header from '../header';
import Footer from '../footer';

const Layout = ({
  darkMode,
  children,
  showFooter = true,
  t,
  headerClassName,
}) => {
  return (
    <>
      <Header darkMode={darkMode} t={t} className={headerClassName} />
      {children}
      {showFooter && <Footer t={t} />}
    </>
  );
};

export default Layout;
