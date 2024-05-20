import React from 'react';
import Header from '../header';
import Footer from '../footer';
import { ChatButton } from '../inkeepAI';
// import * as styles from "./index.module.less";

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
      <ChatButton />
      {showFooter && <Footer t={t} />}
    </>
  );
};


export default Layout;
