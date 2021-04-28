import React, { useEffect } from 'react';
import Footer from '../../footer/v2';
import Header from '../../header/v2';

const V2Layout = ({ header, footer, children, locale, versions }) => {

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.getElementsByTagName('body')[0].style.backgroundColor = "#fff";
    }
  }, []);
  return (
    <div className='v2-page'>
      <Header header={header} locale={locale} versions={versions} />
      {
        children
      }
      <Footer footer={footer} locale={locale} />
    </div>
  );
};

export default V2Layout;