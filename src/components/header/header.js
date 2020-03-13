import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { globalHistory } from "@reach/router";
import LocalizeLink from "../localizedLink/localizedLink";
import Logo from "../../images/logo-horizontal-white.svg";
import Search from "../search";
import "./header.scss";

const Header = ({ language, locale }) => {
  const { header } = language;
  const l = locale === "cn" ? "en" : "cn";
  const to = globalHistory.location.pathname
    .replace("/en/", "/")
    .replace("/cn/", "/");

  const [screenWidth, setScreenWidth] = useState(null);
  useEffect(() => {
    const cb = () => {
      setScreenWidth(document.body.clientWidth);
    };
    cb();
    window.addEventListener("resize", cb);
    return () => {
      window.removeEventListener("resize", cb);
    };
  }, []);

  return (
    <>
      <header className="header-wrapper">
        <LocalizeLink locale={locale} to={"/"}>
          <img src={Logo} alt="Milvos Logo"></img>
        </LocalizeLink>
        {screenWidth > 1000 ? (
          <div className="right">
            <LocalizeLink locale={locale} to="/#whymilvus" className="link">
              {header.why}
            </LocalizeLink>
            <LocalizeLink locale={locale} to="/gui" className="link">
              {header.gui}
            </LocalizeLink>
            <LocalizeLink
              locale={locale}
              className="link"
              to={"/docs/guides/get_started/install_milvus/install_milvus.md"}
            >
              {header.tutorial}
            </LocalizeLink>

            <LocalizeLink locale={locale} className="link" to="/#solution">
              {header.solution}
            </LocalizeLink>

            <LocalizeLink
              locale={locale}
              className="link"
              to={"/docs/guides/get_started/install_milvus/install_milvus.md"}
            >
              {header.doc}
            </LocalizeLink>
            <LocalizeLink
              locale={locale}
              className="link"
              to={"/blogs/2019-08-26-vector-search-million.md"}
            >
              {header.blog}
            </LocalizeLink>

            <Search language={header}></Search>
            <a
              href="https://github.com/milvus-io/milvus"
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
            <LocalizeLink locale={l} to={to} className="link">
              {locale === "cn" ? "EN" : "中"}
            </LocalizeLink>
          </div>
        ) : (
            <div className="right">
              <Search language={header}></Search>
              <LocalizeLink locale={l} to={to}>
                {locale === "cn" ? "EN" : "中"}
              </LocalizeLink>
            </div>
          )}
      </header>
      {screenWidth <= 1000 && (
        <nav className="mobile-nav">
          <LocalizeLink locale={locale} to="/#whymilvus">
            {header.why}
          </LocalizeLink>
          <LocalizeLink locale={locale} to="/#solution">
            {header.solution}
          </LocalizeLink>

          <LocalizeLink
            locale={locale}
            to={"/docs/guides/get_started/install_milvus/install_milvus.md"}
          >
            {header.doc}
          </LocalizeLink>
          <LocalizeLink
            locale={locale}
            to={"/blogs/2019-08-26-vector-search-million.md"}
          >
            {header.blog}
          </LocalizeLink>
        </nav>
      )}
    </>
  );
};

Header.propTypes = {
  language: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired
};

export default Header;
