import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import LocalizeLink from "../localizedLink/localizedLink";
import Logo from "../../images/logo/milvus-horizontal-color.svg";
import "./header.scss";

const Header = ({ language, locale }) => {
  const { header } = language;

  const [screenWidth, setScreenWidth] = useState(null);
  const [mobileNav, setMobileNav] = useState(null);

  useEffect(() => {
    const cb = () => {
      setScreenWidth(document.body.clientWidth);
    };
    cb();
    window.addEventListener("resize", cb);
    window.addEventListener("click", () => {
      setMobileNav(false)
    })
    return () => {
      window.removeEventListener("resize", cb);
    };
  }, []);

  const handleClick = (e) => {
    e.stopPropagation()
    setMobileNav(v => !v)
  }

  return (
    <>
      <header className="header-wrapper">
        <LocalizeLink locale={locale} to={"/"}>
          <img src={Logo} alt="Milvos Logo"></img>
        </LocalizeLink>
        {screenWidth > 1000 ? (
          <div className="right">
            <LocalizeLink locale={locale} to="/#whymilvus" className="link">
              {header.quick}
            </LocalizeLink>
            <LocalizeLink locale={locale} to="/gui" className="link">
              {header.gui}
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

          </div>
        ) : (
            <div className="right" onClick={handleClick}>
              <i className="fas fa-bars"></i>
            </div>
          )}
      </header>
      <div className={`mobile-nav ${mobileNav && 'open'}`}>
        <LocalizeLink locale={locale} to="/#whymilvus" className="link">
          {header.quick}
        </LocalizeLink>
        <LocalizeLink locale={locale} to="/gui" className="link">
          {header.gui}
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
      </div>
    </>
  );
};

Header.propTypes = {
  language: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired
};

export default Header;
