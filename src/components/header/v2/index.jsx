import React, { useState } from 'react';
import milvusLogo from '../../../images/v2/milvus-logo.svg';
import milvusLogoMobile from '../../../images/v2/milvus-logo-mobile.svg';
import lfai from '../../../images/v2/lfai.svg';
import close from '../../../images/v2/close.svg';
import menu from '../../../images/v2/menu.svg';
import V2Selector from '../../selector/v2';
import { useMobileScreen } from '../../../hooks';
import { sortVersions } from '../../../utils/docTemplate.util';
import MobilePopup from '../components/MobilePopupV2';
import { Link } from 'gatsby';
import './index.scss';

const V2Header = ({
  header,
  locale,
  versions,
  version,
  setVersion = () => {},
}) => {
  const { isMobile } = useMobileScreen();
  versions.sort((a, b) => sortVersions(a, b));

  const [open, setOpen] = useState(false);

  const navList = [
    {
      label: 'What is milvus?',
      link: '#',
      isExternal: false,
    },
    {
      label: 'Documentation',
      link: `/docs`,
      isExternal: false,
    },
    {
      label: 'Blog',
      link: 'https://blog.milvus.io/',
      isExternal: true,
    },
    {
      label: 'Github',
      link: 'https://github.com/milvus-io/milvus/',
      isExternal: true,
    },
  ];

  const handleOpenMask = () => {
    setOpen(open ? false : true);
  };

  const hideMask = () => {
    setOpen(false);
  };

  const handleSelected = val => {
    setVersion(val);
    window.location.href = `https://milvus.io/docs/${val}/overview.md`;
  };

  return (
    <section className="header">
      <div className="header-container">
        {!isMobile ? (
          <div className="content-wrapper">
            <div className="logo-section">
              <Link to="/v2">
                <img
                  className="milvus-logo"
                  src={milvusLogo}
                  alt="milvus-logo"
                />
              </Link>
              <a
                href="https://lfaidata.foundation/projects/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img className="lfai-logo" src={lfai} alt="lfai-icon" />
              </a>
            </div>
            <div className="nav-section">
              {navList.map(i => {
                const { label, link, isExternal } = i;
                return isExternal ? (
                  <a className="nav-item" href={link} key={label}>
                    {label}
                  </a>
                ) : (
                  <Link className="nav-item" to={link} key={label}>
                    {label}
                  </Link>
                );
              })}
              <div className="drop-down">
                <V2Selector
                  selected={version}
                  options={versions}
                  setSelected={handleSelected}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="mobile-header-warapper">
            <div className="logo-section">
              <Link to="/v2">
                <img
                  className="milvus-logo"
                  src={milvusLogoMobile}
                  alt="milvus-logo"
                />
              </Link>
              <a
                href="https://lfaidata.foundation/projects/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img className="lfai-logo" src={lfai} alt="lfai-icon" />
              </a>
            </div>
            <div
              className="menu-section"
              role="button"
              tabIndex={0}
              onClick={handleOpenMask}
              onKeyDown={handleOpenMask}
            >
              {open ? (
                <img className="menu-icon" src={close} alt="close-icon" />
              ) : (
                <img className="menu-icon" src={menu} alt="menu-icon" />
              )}
            </div>
            <MobilePopup className="v2-popup" open={open} hideMask={hideMask}>
              <div className="nav-section">
                {navList.map(i => {
                  const { label, link, isExternal } = i;
                  return isExternal ? (
                    <a className="nav-item" href={link} key={label}>
                      {label}
                    </a>
                  ) : (
                    <Link className="nav-item" to={link} key={label}>
                      {label}
                    </Link>
                  );
                })}
                <div className="drop-down">
                  <V2Selector
                    className="mobile-selector"
                    selected={version}
                    options={versions}
                    setSelected={handleSelected}
                  />
                </div>
              </div>
            </MobilePopup>
          </div>
        )}
      </div>
    </section>
  );
};

export default V2Header;
