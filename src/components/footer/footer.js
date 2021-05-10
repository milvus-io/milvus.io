import React from 'react';
import PropTypes from 'prop-types';
// import LocalizeLink from "../localizedLink/localizedLink"
// import { globalHistory } from "@reach/router";
// import GithubIcon from "../../images/icon/github-normal.svg";
// import "./footer.scss";
import * as styles from './footer.module.less';

const Footer = ({ locale, style }) => {
  // const l = locale === "cn" ? "en" : "cn";
  // const to = globalHistory.location.pathname
  //   .replace("/en/", "/")
  //   .replace("/cn/", "/");
  return (
    <footer className={styles.footerWrapper} style={style}>
      <div className={styles.copyRight}>
        <span>
          © 2019 - {new Date().getFullYear()} Milvus. All rights reserved.
        </span>
      </div>
      {/* <LocalizeLink locale={l} to={to}>
        {locale === "cn" ? "English" : "中"}
      </LocalizeLink> */}
    </footer>
  );
};

Footer.propTypes = {
  language: PropTypes.object,
  locale: PropTypes.string.isRequired,
};

export default Footer;
