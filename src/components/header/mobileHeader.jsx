import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import classes from './mobileHeader.module.less';
import pageClasses from '../../styles/responsive.module.less';
import Link from 'next/link';
import clsx from 'clsx';
import { useState } from 'react';
import { LogoSection, ActionBar } from './Logos';
import { CloseIcon, MenuIcon } from '../icons';

export default function MobileHeader(props) {
  const { className } = props;
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
    <div className={classes.mobileHeaderContainer}>
      <div
        className={clsx(
          pageClasses.container,
          classes.mobileHeader,
          className,
          {
            [classes.open]: isMenuOpen,
          }
        )}
      >
        <LogoSection />
        <nav
          className={clsx(classes.navWrapper, {
            [classes.activeMenu]: isMenuOpen,
          })}
        >
          <div className={clsx(pageClasses.container, classes.listWrapper)}>
            <div>
              <List
                sx={{ width: '100%' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
              >
                <Link href="/docs" className={classes.menuLink}>
                  <ListItemButton>
                    <ListItemText primary="Docs" />
                  </ListItemButton>
                </Link>

                <Divider variant="fullWidth" />

                <ListItemButton
                  onClick={() => {
                    openTutorial(!isTutOpen);
                  }}
                >
                  <ListItemText primary="Tutorials" />
                  {isTutOpen ? (
                    <ExpandMore
                      className={clsx(classes.expendIcon, classes.turnDown)}
                    />
                  ) : (
                    <ExpandMore
                      className={clsx(classes.expendIcon, classes.static)}
                    />
                  )}
                </ListItemButton>

                <Collapse in={isTutOpen} timeout="auto" unmountOnExit>
                  <List
                    component="div"
                    disablePadding
                    classes={{
                      root: classes.subMenuList,
                    }}
                  >
                    <Link href="/bootcamp">Bootcamp</Link>
                    <Link href="/milvus-demos">Demo</Link>
                    <a
                      href="https://www.youtube.com/c/MilvusVectorDatabase"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Video
                    </a>
                  </List>
                </Collapse>

                <Divider variant="fullWidth" />

                <ListItemButton
                  onClick={() => {
                    openTool(!isToolOpen);
                  }}
                >
                  <ListItemText primary="Tools" />
                  {isToolOpen ? (
                    <ExpandMore
                      className={clsx(classes.expendIcon, classes.turnDown)}
                    />
                  ) : (
                    <ExpandMore
                      className={clsx(classes.expendIcon, classes.static)}
                    />
                  )}
                </ListItemButton>

                <Collapse in={isToolOpen} timeout="auto" unmountOnExit>
                  <List
                    component="div"
                    disablePadding
                    classes={{ root: classes.subMenuList }}
                  >
                    <a
                      href="https://github.com/zilliztech/attu"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Attu
                    </a>
                    <a
                      href="https://github.com/zilliztech/milvus_cli"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Milvus_CLI
                    </a>
                    <a href="/tools/sizing">Sizing Tool</a>
                  </List>
                </Collapse>

                <Divider variant="fullWidth" />

                <Link href="/blog" className={classes.menuLink}>
                  <ListItemButton>
                    <ListItemText primary="Blog" />
                  </ListItemButton>
                </Link>

                <Divider variant="fullWidth" />
                <Link href="/community" className={classes.menuLink}>
                  <ListItemButton>
                    <ListItemText primary="Community" />
                  </ListItemButton>
                </Link>

                <Divider variant="fullWidth" />
              </List>

              <ActionBar />
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
          className={classes.menuIconBtn}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </div>
  );
}
