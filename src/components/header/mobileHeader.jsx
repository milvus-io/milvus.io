import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';

import classes from './index.module.less';
import pageClasses from '../../styles/responsive.module.less';
import Link from 'next/link';
import clsx from 'clsx';
import { useState } from 'react';

export default function MobileHeader(props) {
  const { actionBar, logoSection } = props;
  const [isTutOpen, setIsTutOpen] = useState(false);
  const [isToolOpen, setIsToolOpen] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openTutorial = open => {
    let isOpen = open;
    if (isOpen === undefined) {
      isOpen = !isTutOpen;
    }
    setIsTutOpen(isOpen);
  };

  const openTool = open => {
    let isOpen = open;
    if (isOpen === undefined) {
      isOpen = !isToolOpen;
    }
    setIsToolOpen(isOpen);
  };

  return (
    <div
      className={clsx(pageClasses.col8, classes.mobileHeader, {
        [classes.open]: isMenuOpen,
      })}
    >
      {logoSection}
      <nav
        className={clsx(classes.navWrapper, {
          [classes.activeMenu]: isMenuOpen,
        })}
      >
        <div className={clsx(pageClasses.col8, classes.listWrapper)}>
          <div>
            <List
              sx={{ width: '100%' }}
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              <Link href="/docs" className={classes.menuLink}>
                <ListItemButton>
                  <ListItemText primary="Docs" />
                  <ExpandMore className={classes.turnLeft} />
                </ListItemButton>
              </Link>

              <Divider variant="middle" />

              <ListItemButton
                onClick={() => {
                  openTutorial(!isTutOpen);
                }}
              >
                <ListItemText primary="Tutorials" />
                {isTutOpen ? (
                  <ExpandMore />
                ) : (
                  <ExpandMore className={classes.turnLeft} />
                )}
              </ListItemButton>

              <Collapse in={isTutOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemText
                    primary={
                      <>
                        <Link
                          href="/bootcamp"
                          className={classes.mobileMenuLink}
                        >
                          Bootcamp
                        </Link>
                        <Link
                          href="/milvus-demos"
                          className={classes.mobileMenuLink}
                        >
                          Demo
                        </Link>
                        <a
                          href="https://www.youtube.com/c/MilvusVectorDatabase"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={classes.mobileMenuLink}
                        >
                          Video
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
                <ListItemText primary="Tools" />
                {isToolOpen ? (
                  <ExpandMore />
                ) : (
                  <ExpandMore className={classes.turnLeft} />
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
                          className={classes.mobileMenuLink}
                        >
                          Attu
                        </a>
                        <a
                          href="https://github.com/zilliztech/milvus_cli"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={classes.mobileMenuLink}
                        >
                          Milvus_CLI
                        </a>
                        <Link
                          href="/tools/sizing"
                          className={classes.mobileMenuLink}
                        >
                          Sizing Tool
                        </Link>
                      </>
                    }
                  />
                </List>
              </Collapse>

              <Divider variant="middle" />

              <Link href="/blog" className={classes.menuLink}>
                <ListItemButton>
                  <ListItemText primary="Blog" />
                  <ExpandMore className={classes.turnLeft} />
                </ListItemButton>
              </Link>

              <Divider variant="middle" />

              <Link href="/community" className={classes.menuLink}>
                <ListItemButton>
                  <ListItemText primary="Community" />
                  <ExpandMore className={classes.turnLeft} />
                </ListItemButton>
              </Link>

              <Divider variant="middle" />
            </List>

            {actionBar}
          </div>

          <div className={classes.mobileStartBtnWrapper}>
            <a
              href="https://cloud.zilliz.com"
              className={classes.mobileStartBtn}
            >
              Try Managed Milvus <span>FREE</span>
            </a>
          </div>
        </div>
      </nav>

      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={clsx(classes.hamburg, {
          [classes.active]: isMenuOpen,
        })}
      >
        <span className={classes.top}></span>
        <span className={classes.middle}></span>
        <span className={classes.bottom}></span>
      </button>
    </div>
  );
}
