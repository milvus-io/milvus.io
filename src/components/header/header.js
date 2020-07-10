import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import LocalizeLink from "../localizedLink/localizedLink";
import Logo from "../../images/logo/milvus-horizontal-color.svg";
import LfaiLogo from "../../images/logo/lfai-color.png";
import Search from "../../components/search";
import "./header.scss";
import { globalHistory } from "@reach/router";
import { useMobileScreen } from "../../hooks";

const Header = ({ language, locale, current = "", showDoc = true }) => {
  const { header } = language;
  const screenWidth = useMobileScreen();
  const [mobileNav, setMobileNav] = useState(null);
  const [lanList, setLanList] = useState(false);

  const l = locale === "cn" ? "en" : "cn";
  const to = globalHistory.location.pathname
    .replace("/en/", "/")
    .replace("/cn/", "/");
  const blogHref =
    locale === "cn"
      ? "http://zilliz.blog.csdn.net"
      : "https://medium.com/tag/milvus-project/latest";
  useEffect(() => {
    window.addEventListener("click", () => {
      setMobileNav(false);
      setLanList(false);
    });
  }, []);

  const handleClick = (e) => {
    e.stopPropagation();
    setMobileNav((v) => !v);
  };

  const onChangeLocale = () => {
    window.localStorage.setItem("milvus.io.setlanguage", true);
  };

  return (
    <>
      <div className="full-header-wrapper">
        <header className="header-wrapper">
          <div className="logo-wrapper">
            <LocalizeLink locale={locale} to={"/"}>
              <img src={Logo} alt="Milvos Logo"></img>
            </LocalizeLink>
            <a
              href="https://lfai.foundation/projects/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={LfaiLogo} alt="Lfai" className="lfai"></img>
            </a>
          </div>

          {screenWidth > 1000 ? (
            <div className="right">
              <LocalizeLink
                locale={locale}
                to="/docs/install_milvus.md"
                className="link"
              >
                {header.quick}
              </LocalizeLink>

              <LocalizeLink
                locale={locale}
                className="link"
                to={"/docs/benchmarks_azure"}
              >
                {header.benchmarks}
              </LocalizeLink>
              <a
                href={`https://tutorials.milvus.io${
                  locale === "cn" ? `/cn/` : ""
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                {header.tutorials}
              </a>

              <LocalizeLink
                locale={locale}
                className={`link ${current === "scenarios" ? "current" : ""}`}
                to="/scenarios"
              >
                {header.solution}
              </LocalizeLink>
              {showDoc && (
                <LocalizeLink
                  locale={locale}
                  className={`link ${current === "doc" ? "current" : ""}`}
                  to={"/docs/overview.md"}
                >
                  {header.doc}
                </LocalizeLink>
              )}

              <a
                href={blogHref}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                {header.blog}
              </a>

              <Search language={header}></Search>
              <span
                className="language"
                onClick={(e) => {
                  e.stopPropagation();
                  setLanList(!lanList);
                }}
              >
                {locale === "cn" ? "中" : "En"}
                {lanList && (
                  <div className="language-list">
                    <LocalizeLink
                      locale={l}
                      to={to}
                      className={locale === "en" ? "active" : ""}
                    >
                      <span onClick={onChangeLocale} role="button">
                        English
                      </span>
                    </LocalizeLink>
                    <LocalizeLink
                      locale={l}
                      to={to}
                      className={locale === "cn" ? "active" : ""}
                    >
                      <span onClick={onChangeLocale} role="button">
                        中文
                      </span>
                    </LocalizeLink>
                  </div>
                )}
              </span>
            </div>
          ) : (
            <div className="right">
              <Search language={header}></Search>
              <span
                className="language"
                onClick={(e) => {
                  e.stopPropagation();
                  setLanList(!lanList);
                }}
              >
                {locale === "cn" ? "中" : "En"}
                {lanList && (
                  <div className="language-list">
                    <LocalizeLink
                      locale={l}
                      to={to}
                      className={locale === "en" ? "active" : ""}
                    >
                      <span onClick={onChangeLocale} role="button">
                        English
                      </span>
                    </LocalizeLink>
                    <LocalizeLink
                      locale={l}
                      to={to}
                      className={locale === "cn" ? "active" : ""}
                    >
                      <span onClick={onChangeLocale} role="button">
                        中文
                      </span>
                    </LocalizeLink>
                  </div>
                )}
              </span>
              <i className="fas fa-bars" onClick={handleClick}></i>
            </div>
          )}
        </header>
      </div>
      <div className={`mobile-nav ${mobileNav && "open"}`}>
        <LocalizeLink locale={locale} to="/#whymilvus" className="link">
          {header.quick}
        </LocalizeLink>
        <a
          href="https://tutorials.milvus.io"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          {header.tutorials}
        </a>

        <LocalizeLink locale={locale} className="link" to="/scenarios">
          {header.solution}
        </LocalizeLink>

        <LocalizeLink
          locale={locale}
          className="link"
          to={"/docs/install_milvus.md"}
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
      </div>
    </>
  );
};

Header.propTypes = {
  language: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
};

export default Header;
