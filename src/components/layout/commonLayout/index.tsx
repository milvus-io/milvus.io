import React from 'react';
import Header from '../../header';
import Footer from '../../footer';

const Layout: React.FC<{
  darkMode?: boolean;
  children: React.ReactNode;
  showFooter?: boolean;
  headerClassName?: string;
}> = ({ darkMode, children, showFooter = true, headerClassName = '' }) => {
  return (
    <>
      <Header darkMode={darkMode} className={headerClassName} />
      {children}
      {showFooter && <Footer />}
    </>
  );
};

export default Layout;
