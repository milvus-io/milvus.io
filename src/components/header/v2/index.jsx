import React, { useState, useRef, useEffect } from 'react';
import milvusLogo from '../../../images/v2/milvus-logo.svg';
import milvusLogoMobile from '../../../images/v2/milvus-logo-mobile.svg';
import lfai from '../../../images/v2/lfai.svg';
import close from '../../../images/v2/close.svg';
import search from '../../../images/v2/search.svg';
import menu from '../../../images/v2/menu.svg';
import V2Selector from '../../selector/v2';
import { useMobileScreen } from '../../../hooks';
import { sortVersions } from '../../../utils/docTemplate.util';
import MobilePopup from '../components/MobilePopupV2';
import { Link } from 'gatsby';
import Search from './Search';
import Menu from './Menu';
import './index.scss';


const V2Header = ({
  versions,
  version,
  setVersion = () => { },
  type = 'home',
  onSearchChange,
  setShowMask = () => { },
  showMask = false
}) => {
  const screenWidth = useMobileScreen();
  const versionList = [...versions];
  versionList.sort((a, b) => sortVersions(a, b));

  const [open, setOpen] = useState(false);
  const [openType, setOpenType] = useState('');
  const container = useRef(null);
  const headContainer = useRef(null);

  const navList = [
    {
      label: 'What is milvus?',
      link: '#',
      isExternal: false
    },
    {
      label: 'Documentation',
      link: `/docs/home`,
      isExternal: false
    },
    {
      label: 'Blog',
      link: 'https://blog.milvus.io/',
      isExternal: true
    },
    {
      label: 'Github',
      link: 'https://github.com/milvus-io/milvus/',
      isExternal: true
    }
  ];

  const handleOpenMask = (e) => {
    const { type } = e.target.dataset;
    setOpen(open ? false : true);
    setOpenType(type);
    setShowMask(true);
    headContainer.current.style.zIndex = 13;
    headContainer.current.style.backgroundColor = 'transparent';
  };

  const hideMask = () => {
    setOpen(false);
    setShowMask(false);
    headContainer.current.style.zIndex = 3;
    headContainer.current.style.backgroundColor = '#fff';
  };

  const handleSelected = (val) => {
    setVersion(val);
    window.location.href = `https://milvus.io/docs/${val}/overview.md`;
  };

  const handleSearch = value => {
    onSearchChange(value);
    hideMask();
  };



  const useClickOutside = (ref, handler, events) => {
    if (!events) events = [`mousedown`, `touchstart`];
    const detectClickOutside = event => {
      !ref.current.contains(event.target) && handler(event);
    };
    useEffect(() => {
      for (const event of events)
        document.addEventListener(event, detectClickOutside);
      return () => {
        for (const event of events)
          document.removeEventListener(event, detectClickOutside);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  };

  useClickOutside(container, () => {
    hideMask();
  });


  return (
    <section className='header' ref={headContainer}>
      <div className="header-container" ref={container}>
        {
          screenWidth > 1000 ? (
            <div className="content-wrapper">
              <div className="logo-section">
                <Link to="/v2">
                  <img className="milvus-logo" src={milvusLogo} alt="milvus-logo" />
                </Link>
                <a href="https://lfaidata.foundation/projects/" target="_blank" rel="noopener noreferrer">
                  <img className="lfai-logo" src={lfai} alt="lfai-icon" />
                </a>

              </div>
              <div className="nav-section">
                {
                  navList.map(i => {
                    const { label, link, isExternal } = i;
                    return (
                      isExternal ?
                        (<a className="nav-item" href={link} key={label}>{label}</a>) :
                        (<Link className="nav-item" to={link} key={label}>{label}</Link>)
                    );
                  })
                }
                <div className="drop-down">
                  <V2Selector
                    selected={version}
                    options={versionList}
                    setSelected={handleSelected}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className='mobile-header-warapper'>
              <div className="logo-section">
                <Link to="/v2">
                  <img className="milvus-logo" src={milvusLogoMobile} alt="milvus-logo" />
                </Link>
                <a href="https://lfaidata.foundation/projects/" target="_blank" rel="noopener noreferrer">
                  <img className="lfai-logo" src={lfai} alt="lfai-icon" />
                </a>
              </div>
              <div className="menu-section">
                {
                  open ?
                    <div
                      className="icon-wrapper"
                      role="button"
                      tabIndex={0}
                      onClick={hideMask}
                      onKeyDown={hideMask}
                    >
                      <img className="btn-icon" src={close} alt="close-icon" />
                    </div>
                    :
                    <div className='menus-wrapper'
                      role="button"
                      tabIndex={0}
                      onClick={handleOpenMask}
                      onKeyDown={handleOpenMask}
                    >
                      {type === 'doc' && (
                        <div className="icon-wrapper" data-type='search'>
                          <img className="btn-icon" src={search} alt="search-icon" />
                        </div>
                      )}
                      <div className="icon-wrapper" data-type='menu'>
                        <img className="btn-icon" src={menu} alt="menu-icon" />
                      </div>
                    </div>
                }
              </div>
              <MobilePopup className='v2-popup' open={open} hideMask={hideMask}>
                {
                  openType === 'menu' ? <Menu
                    version={version}
                    options={versionList}
                    setSelected={handleSelected}
                    navList={navList}
                  /> : <Search handleSearch={handleSearch} />
                }
              </MobilePopup>
            </div>
          )
        }
      </div>
    </section >
  );
};

export default V2Header;




