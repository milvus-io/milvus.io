import React, { useState, useRef, useEffect } from "react";
import { Link, useI18next } from "gatsby-plugin-react-i18next";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import milvusLogo from "../../images/milvus_logo.svg";
import lfLogoDark from "../../images/lf_logo_dark.svg";
import lfLogoLight from "../../images/lf_logo_light.svg";
import * as styles from "./index.module.less";
import GitHubButton from "../githubButton";
import { useWindowSize } from "../../http/hooks";

const Header = ({ darkMode = false, t = (v) => v, className = "" }) => {
  const { language, languages, originalPath } = useI18next();
  const [isLightHeader, setIsLightHeader] = useState(!darkMode);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTutOpen, setIsTutOpen] = useState(false);
  const [isToolOpen, setIsToolOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isLangOpen = Boolean(anchorEl);
  const toolRef = useRef(null);
  const tutRef = useRef(null);

  useEffect(() => {
    if (!darkMode) {
      return;
    }
    const onScroll = (e) => {
      setIsLightHeader(e.target.documentElement.scrollTop > 100);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLightHeader, darkMode]);

  const currentSize = useWindowSize();
  const isMobile = ["phone", "tablet", "desktop1024"].includes(currentSize);

  const handleLangClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLangClose = () => {
    setAnchorEl(null);
  };

  const openTutorial = (open) => {
    let isOpen = open;
    if (isOpen === undefined) {
      isOpen = !isTutOpen;
    }
    setIsTutOpen(isOpen);
  };

  const openTool = (open) => {
    let isOpen = open;
    if (isOpen === undefined) {
      isOpen = !isToolOpen;
    }
    setIsToolOpen(isOpen);
  };

  const logoSection = (
    <div className={styles.logoSection}>
      <Link to="/">
        <img src={milvusLogo} alt="milvus-logo" />
      </Link>
      <span />
      <a
        href="https://lfaidata.foundation/projects/"
        target="_blank"
        rel="noopener noreferrer"
      >
        {isLightHeader || isMobile ? (
          <img src={lfLogoLight} alt="lfai-icon" />
        ) : (
          <img src={lfLogoDark} alt="lfai-icon" />
        )}
      </a>
    </div>
  );

  const actionBar = (
    <div className={styles.actionBar}>
      <div className={styles.flexend}>
        <GitHubButton
          type="star"
          // className="star-btn"
          href="https://github.com/milvus-io/milvus"
        >
          Star
        </GitHubButton>

        <GitHubButton type="fork" href="https://github.com/milvus-io/milvus">
          Forks
        </GitHubButton>
      </div>
      <button
        className={styles.langSelect}
        aria-controls={isLangOpen ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={isLangOpen ? "true" : undefined}
        onClick={handleLangClick}
      >
        <>
          <FontAwesomeIcon className={styles.global} icon={faGlobe} />
          <span className={styles.globalText}>{language}</span>
        </>
      </button>
      <Menu
        anchorEl={anchorEl}
        open={isLangOpen}
        onClose={handleLangClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {languages.map((lng) => {
          return (
            <MenuItem key={lng} value={lng} onClick={handleLangClose}>
              <Link to={originalPath} language={lng}>
                {lng === "en" ? "English" : "中文"}
              </Link>
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );

  const mobileHead = (
    <header className={`${styles.mobileHead} ${className}`}>
      <div className={`${styles.spaceBetween} col-4 col-8 col-12`}>
        {logoSection}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`${styles.hamburg} ${isMenuOpen ? styles.active : ""}`}
        >
          <span className={styles.top}></span>
          <span className={styles.middle}></span>
          <span className={styles.bottom}></span>
        </button>
      </div>

      <div className={`${styles.overlay}  ${isMenuOpen ? styles.open : ""}`}>
        <nav className={`${styles.nav} col-4 col-8 col-12`}>
          <List
            sx={{ width: "100%" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <Link to="/docs" className={styles.menuLink}>
              <ListItemButton>
                <ListItemText primary={t("v3trans.main.nav.docs")} />
                <ExpandMore className={styles.turnLeft} />
              </ListItemButton>
            </Link>

            <Divider variant="middle" />

            <ListItemButton
              onClick={() => {
                openTutorial(!isTutOpen);
              }}
            >
              <ListItemText primary={t("v3trans.main.nav.tutorials")} />
              {isTutOpen ? (
                <ExpandMore />
              ) : (
                <ExpandMore className={styles.turnLeft} />
              )}
            </ListItemButton>

            <Collapse in={isTutOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemText
                  primary={
                    <>
                      <Link to="/bootcamp" className={styles.mobileMenuLink}>
                        {t("v3trans.main.nav.bootcamp")}
                      </Link>
                      <Link
                        to="/milvus-demos"
                        className={styles.mobileMenuLink}
                      >
                        {t("v3trans.main.nav.demo")}
                      </Link>
                      <a
                        href="https://www.youtube.com/zillizchannel"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.mobileMenuLink}
                      >
                        {t("v3trans.main.nav.video")}
                      </a>
                    </>
                  }
                />
              </List>
            </Collapse>

            <Divider variant="middle" />

            <ListItemButton
              onClick={() => {
                openTool(!isToolOpen);
              }}
            >
              <ListItemText primary={t("v3trans.main.nav.tools")} />
              {isToolOpen ? (
                <ExpandMore />
              ) : (
                <ExpandMore className={styles.turnLeft} />
              )}
            </ListItemButton>

            <Collapse in={isToolOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemText
                  primary={
                    <>
                      <a
                        href="https://github.com/zilliztech/attu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.mobileMenuLink}
                      >
                        Attu
                      </a>
                      <a
                        href="https://github.com/zilliztech/milvus_cli"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.mobileMenuLink}
                      >
                        Milvus_CLI
                      </a>
                      <Link to="/tool-sizing" className={styles.mobileMenuLink}>
                        Sizing Tool
                      </Link>
                    </>
                  }
                />
              </List>
            </Collapse>

            <Divider variant="middle" />

            <Link to="/blog" className={styles.menuLink}>
              <ListItemButton>
                <ListItemText primary={t("v3trans.main.nav.blog")} />
                <ExpandMore className={styles.turnLeft} />
              </ListItemButton>
            </Link>

            <Divider variant="middle" />

            <Link to="/community" className={styles.menuLink}>
              <ListItemButton>
                <ListItemText primary={t("v3trans.main.nav.community")} />
                <ExpandMore className={styles.turnLeft} />
              </ListItemButton>
            </Link>

            <Divider variant="middle" />
          </List>

          {actionBar}

          <Divider
            variant="fullwidth"
            sx={{ position: "absolute", bottom: "78px", width: "100%" }}
          />
          <button className={styles.startBtn}>
            {t("v3trans.main.nav.getstarted")}
          </button>
        </nav>
      </div>
    </header>
  );

  const desktopHead = (
    <header
      className={`${styles.header} ${
        isLightHeader ? styles.light : ""
      } ${className}`}
    >
      <div className={styles.flexstart}>
        {logoSection}
        <nav>
          <ul className={`${styles.flexstart} ${styles.menu}`}>
            <li>
              <Link to="/docs" className={styles.menuLink}>
                {t("v3trans.main.nav.docs")}
              </Link>
            </li>
            <li>
              <button
                ref={tutRef}
                className={styles.menuLink}
                onClick={openTutorial}
              >
                {t("v3trans.main.nav.tutorials")}
              </button>
            </li>
            <li>
              <button
                ref={toolRef}
                className={styles.menuLink}
                onClick={openTool}
              >
                {t("v3trans.main.nav.tools")}
              </button>
            </li>
            <li>
              <Link to="/blog" className={styles.menuLink}>
                {t("v3trans.main.nav.blog")}
              </Link>
            </li>
            <li>
              <Link to="/community" className={styles.menuLink}>
                {t("v3trans.main.nav.community")}
              </Link>
            </li>
          </ul>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={tutRef.current}
            open={isTutOpen}
            onClose={() => {
              openTutorial(false);
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem>{t("v3trans.main.nav.bootcamp")}</MenuItem>
            <MenuItem>
              <Link to="/milvus-demos" className={styles.menuLink}>
                {t("v3trans.main.nav.demo")}
              </Link>
            </MenuItem>
            <MenuItem>
              <a
                href="https://www.youtube.com/zillizchannel"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.menuLink}
              >
                {t("v3trans.main.nav.video")}
              </a>
            </MenuItem>
          </Menu>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={toolRef.current}
            open={isToolOpen}
            onClose={() => {
              openTool(false);
            }}
          >
            <MenuItem>
              <a
                href="https://github.com/zilliztech/attu"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.menuLink}
              >
                Attu
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href="https://github.com/zilliztech/milvus_cli"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.menuLink}
              >
                Milvus_CLI
              </a>
            </MenuItem>
            <MenuItem>Sizing Tool</MenuItem>
          </Menu>
        </nav>
      </div>

      <div className={styles.flexend}>
        {actionBar}
        <button className={styles.startBtn}>
          {t("v3trans.main.nav.getstarted")}
        </button>
      </div>
    </header>
  );

  return isMobile ? mobileHead : desktopHead;
};

export default Header;
