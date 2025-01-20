import { useTranslation } from 'react-i18next';
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
import { useState, useEffect } from 'react';
import { LogoSection } from './Logos';
import { CloseIcon, MenuIcon } from '../icons';
import { useWindowSize } from '@/http/hooks';
import { Button } from '@/components/ui/button';
import {
  GET_START_LINK,
  GITHUB_ATTU_LINK,
  GITHUB_VTS_LINK,
  GITHUB_MILVUS_CLI_LINK,
} from '@/consts/links';
import { RightTopArrowIcon } from '../icons';

export default function MobileHeader(props) {
  const { className } = props;
  const { t } = useTranslation('header');
  const [isTutOpen, setIsTutOpen] = useState(false);
  const [isToolOpen, setIsToolOpen] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const size = useWindowSize();

  useEffect(() => {
    if (!['tablet', 'phone'].includes(size)) {
      setIsMenuOpen(false);
    }
  }, [size]);

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
    <div className="block tablet:hidden bg-white border-b border-solid border-gray-300">
      <div
        className={clsx(
          pageClasses.container,
          classes.mobileHeader,
          className,
          {
            [classes.open]: isMenuOpen,
            // stop scrolling when menu is open
            'lock-scroll': isMenuOpen,
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
                      className={classes.externalLinkButton}
                    >
                      Video
                      <RightTopArrowIcon />
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
                      href={GITHUB_ATTU_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.externalLinkButton}
                    >
                      Attu
                      <RightTopArrowIcon />
                    </a>
                    <a
                      href={GITHUB_MILVUS_CLI_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.externalLinkButton}
                    >
                      Milvus_CLI
                      <RightTopArrowIcon />
                    </a>
                    <a
                      href="/tools/sizing"
                      className={classes.externalLinkButton}
                    >
                      Sizing Tool <RightTopArrowIcon />
                    </a>

                    <a
                      href={GITHUB_VTS_LINK}
                      className={classes.externalLinkButton}
                    >
                      VTS <RightTopArrowIcon />
                    </a>
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
            </div>

            <div className={classes.mobileStartBtnWrapper}>
              <Link
                href="/contact"
                target="_self"
                className="block text-[14px] font-[500] leading-[40px] text-black1 px-[1rem]  text-center h-[40px]"
              >
                {t('contact')}
              </Link>
              <Link href={GET_START_LINK}>
                <Button className="w-full">{t('start')}</Button>
              </Link>
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
