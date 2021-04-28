import React, { useState } from 'react';
import milvusLogo from '../../../images/v2/milvus-logo.svg';
import milvusLogoMobile from '../../../images/v2/milvus-logo-mobile.svg';
import lfai from '../../../images/v2/lfai.svg';
import close from '../../../images/v2/close.svg';
import menu from '../../../images/v2/menu.svg';
import V2Selector from '../../selector/v2';
import { useMobileScreen } from '../../../hooks';
import { sortVersions } from '../../../utils/docTemplate.util';
import MobilePopup from '../components/MobilePopUpV2';

import './index.scss';


const V2Header = ({ header, locale, versions }) => {
  const { navlist } = header;
  const screenWidth = useMobileScreen();
  versions.sort((a, b) => sortVersions(a, b));
  if (!versions.includes('v.2.0.0')) {
    versions.unshift('v.2.0.0');
  }


  const [selected, setSelected] = useState(versions[0]);
  const [open, setOpen] = useState(false);

  const handleOpenMask = () => {
    setOpen(open ? false : true);
  };

  const hideMask = () => {
    setOpen(false);
  };

  const handleSelected = (val) => {
    setSelected(val);
    window.location.href = `https://milvus.io/docs/${val}/overview.md`;
  };

  return (
    <section className='header'>
      <div className="header-container">
        {
          screenWidth > 1000 ? (
            <div className="content-wrapper">
              <div className="logo-section">
                <a href="https://milvus.io/">
                  <img className="milvus-logo" src={milvusLogo} alt="milvus-logo" />
                </a>
                <a href="https://lfaidata.foundation/projects/" target="_blank" rel="noopener noreferrer">
                  <img className="lfai-logo" src={lfai} alt="lfai-icon" />
                </a>

              </div>
              <div className="nav-section">
                {
                  navlist.map(i => {
                    const { label, href } = i;
                    return (
                      <a className="nav-item" href={href} key={label}>{label}</a>
                    );
                  })
                }
                <div className="drop-down">
                  <V2Selector
                    selected={selected}
                    options={versions}
                    setSelected={handleSelected}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className='mobile-header-warapper'>
              <div className="logo-section">
                <a href="https://milvus.io/">
                  <img className="milvus-logo" src={milvusLogoMobile} alt="milvus-logo" />
                </a>
                <a href="https://lfaidata.foundation/projects/" target="_blank" rel="noopener noreferrer">
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
                {
                  open ?
                    <img className="menu-icon" src={close} alt="close-icon" /> :
                    <img className="menu-icon" src={menu} alt="menu-icon" />
                }
              </div>
              <MobilePopup className='v2-popup' open={open} hideMask={hideMask}>
                <div className="nav-section">
                  {
                    navlist.map(i => {
                      const { label, href } = i;
                      return (
                        <a className="nav-item" href={href} key={label}>{label}</a>
                      );
                    })
                  }
                  <div className="drop-down">
                    <V2Selector
                      className="mobile-selector"
                      selected={selected}
                      options={versions}
                      setSelected={setSelected}
                    />
                  </div>
                </div>
              </MobilePopup>
            </div>
          )
        }
      </div>
    </section>
  );
};

export default V2Header;