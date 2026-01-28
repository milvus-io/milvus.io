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
  GITHUB_ATTU_LINK,
  GITHUB_VTS_LINK,
  GITHUB_MILVUS_CLI_LINK,
  CLOUD_SIGNUP_LINK,
  GITHUB_DEEP_SEARCHER_LINK,
  GITHUB_MILVUS_BACKUP_LINK,
  GITHUB_MILVUS_LINK,
  DISCORD_INVITE_URL,
  GITHUB_MILVUS_COMMUNITY_LINK,
  GITHUB_CLAUDE_CONTEXT_LINK,
  MILVUS_SLACK_LINK,
} from '@/consts/links';
import { MILVUS_OFFICE_HOURS_URL } from '@/consts/externalLinks';
import { RightTopArrowIcon } from '../icons';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import { LanguageSelector } from '../language-selector';
import useUtmTrackPath from '@/hooks/use-utm-track-path';

export default function MobileHeader(props: {
  className?: string;
  disableLangSelector?: boolean;
}) {
  const { className = '', disableLangSelector = false } = props;
  const { t } = useTranslation('header');

  const [isTutOpen, setIsTutOpen] = useState(false);
  const [isToolOpen, setIsToolOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const size = useWindowSize();

  const {
    locale,
    disabled,
    disabledLanguages,
    localeSuffix,
    onLocaleChange,
    getLocalePath,
  } = useGlobalLocale();

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

  const openCommunity = open => {
    let isOpen = open;
    if (isOpen === undefined) {
      isOpen = !isCommunityOpen;
    }
    setIsCommunityOpen(isOpen);
  };

  const trackPath = useUtmTrackPath();

  return (
    <div className="block xl:hidden bg-white border-b border-solid border-gray-300">
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
        <LogoSection equipment="tablet" />

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
                      {t('tools.attu')}
                      <RightTopArrowIcon />
                    </a>
                    <a
                      href={GITHUB_MILVUS_CLI_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.externalLinkButton}
                    >
                      {t('tools.cli')}
                      <RightTopArrowIcon />
                    </a>
                    <Link
                      href="/tools/sizing"
                      className={classes.externalLinkButton}
                    >
                      {t('tools.sizing')}
                    </Link>
                    <a
                      href={GITHUB_MILVUS_BACKUP_LINK}
                      className={classes.externalLinkButton}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('tools.backup')} <RightTopArrowIcon />
                    </a>
                    <a
                      href={GITHUB_VTS_LINK}
                      className={classes.externalLinkButton}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('tools.vts')} <RightTopArrowIcon />
                    </a>
                    <a
                      href={GITHUB_DEEP_SEARCHER_LINK}
                      className={classes.externalLinkButton}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('tools.deepSearcher')} <RightTopArrowIcon />
                    </a>
                    <a
                      href={GITHUB_CLAUDE_CONTEXT_LINK}
                      className={classes.externalLinkButton}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('tools.claudeContext')} <RightTopArrowIcon />
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

                <ListItemButton
                  onClick={() => {
                    openCommunity(!isCommunityOpen);
                  }}
                >
                  <ListItemText primary="Community" />
                  {isCommunityOpen ? (
                    <ExpandMore
                      className={clsx(classes.expendIcon, classes.turnDown)}
                    />
                  ) : (
                    <ExpandMore
                      className={clsx(classes.expendIcon, classes.static)}
                    />
                  )}
                </ListItemButton>

                <Collapse in={isCommunityOpen} timeout="auto" unmountOnExit>
                  <List
                    component="div"
                    disablePadding
                    classes={{ root: classes.subMenuList }}
                  >
                    <a
                      href={MILVUS_OFFICE_HOURS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.externalLinkButton}
                    >
                      {t('community.officeHours')}
                      <RightTopArrowIcon />
                    </a>
                    <a
                      href={MILVUS_SLACK_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.externalLinkButton}
                    >
                      {t('community.slack')}
                      <RightTopArrowIcon />
                    </a>
                    <a
                      href={DISCORD_INVITE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.externalLinkButton}
                    >
                      {t('community.discord')}
                      <RightTopArrowIcon />
                    </a>
                    <a
                      href={GITHUB_MILVUS_COMMUNITY_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.externalLinkButton}
                    >
                      {t('community.github')}
                      <RightTopArrowIcon />
                    </a>

                    <a href="/community" className={classes.externalLinkButton}>
                      {t('community.more')}
                    </a>
                  </List>
                </Collapse>
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
              <Link
                href={`${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=milvus_nav_right&utm_content=${trackPath}`}
                target="_blank"
              >
                <Button className="w-full">{t('start')}</Button>
              </Link>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-[12px]">
          {!disableLangSelector && (
            <LanguageSelector
              value={locale}
              onChange={onLocaleChange}
              disabled={disabled}
              disabledLanguages={disabledLanguages}
              hiddenSelectValue={false}
            />
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={classes.menuIconBtn}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </div>
  );
}
