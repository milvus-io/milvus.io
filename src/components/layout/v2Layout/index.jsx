import React from 'react';
import Footer from '../../footer/v2';
import Header from '../../header/v2';

const V2Layout = ({ header, footer, children, locale, versions }) => {
  return (
    <div>
      <Header
        header={header}
        locale={locale}
        versions={versions}
        version="v2.0.0"
        type="home"
      />
      {children}
      <Footer footer={footer} locale={locale} />
    </div>
  );
};

export default V2Layout;
