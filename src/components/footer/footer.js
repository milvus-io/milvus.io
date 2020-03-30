import React from "react";
import PropTypes from "prop-types";
// import LocalizeLink from "../localizedLink/localizedLink"
// import { globalHistory } from "@reach/router";
import GithubIcon from "../../images/icon/github-normal.svg";
import "./footer.scss";

const Footer = ({ locale, style }) => {
  // const l = locale === "cn" ? "en" : "cn";
  // const to = globalHistory.location.pathname
  //   .replace("/en/", "/")
  //   .replace("/cn/", "/");
  return (
    <footer className="footer-wrapper" style={style}>
      <div className="copy-right">
        <img src={GithubIcon} alt="github"></img>
        <span>© {new Date().getFullYear()} Milvus. All rights reserved.</span>
      </div>
      {/* <LocalizeLink locale={l} to={to}>
        {locale === "cn" ? "English" : "中"}
      </LocalizeLink> */}
    </footer>
  );
};

Footer.propTypes = {
  language: PropTypes.object,
  locale: PropTypes.string.isRequired
};

export default Footer;
