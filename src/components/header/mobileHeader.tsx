import { useTranslation } from 'react-i18next';
import classes from './mobileHeader.module.css';
import pageClasses from '../../styles/responsive.module.css';
import Link from 'next/link';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { LogoSection } from './Logos';
import { CloseIcon, MenuIcon, ExpandMoreIcon } from '../icons';
import { useWindowSize } from '@/http/hooks';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
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

  const openTutorial = (open?: boolean) => {
    setIsTutOpen(open !== undefined ? open : !isTutOpen);
  };

  const openTool = (open?: boolean) => {
    setIsToolOpen(open !== undefined ? open : !isToolOpen);
  };

  const openCommunity = (open?: boolean) => {
    setIsCommunityOpen(open !== undefined ? open : !isCommunityOpen);
  };

  const trackPath = useUtmTrackPath();

  return (
    <div className="block lg:hidden bg-white border-b border-solid border-gray-300">
      <div
        className={clsx(
          pageClasses.container,
          classes.mobileHeader,
          className,
          {
            [classes.open]: isMenuOpen,
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
              <ul className={classes.menuList}>
                <li>
                  <Link href="/docs" className={classes.menuLink}>
                    <span className={classes.menuItemBtn}>Docs</span>
                  </Link>
                </li>

                <hr className={classes.divider} />

                <li>
                  <button
                    className={classes.menuItemBtn}
                    onClick={() => openTutorial(!isTutOpen)}
                  >
                    <span>Tutorials</span>
                    <ExpandMoreIcon
                      className={clsx(
                        classes.expendIcon,
                        isTutOpen ? classes.turnDown : classes.static
                      )}
                    />
                  </button>
                </li>

                <Collapsible open={isTutOpen}>
                  <CollapsibleContent className={classes.collapsibleContent}>
                    <div className={classes.subMenuList}>
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
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <hr className={classes.divider} />

                <li>
                  <button
                    className={classes.menuItemBtn}
                    onClick={() => openTool(!isToolOpen)}
                  >
                    <span>Tools</span>
                    <ExpandMoreIcon
                      className={clsx(
                        classes.expendIcon,
                        isToolOpen ? classes.turnDown : classes.static
                      )}
                    />
                  </button>
                </li>

                <Collapsible open={isToolOpen}>
                  <CollapsibleContent className={classes.collapsibleContent}>
                    <div className={classes.subMenuList}>
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
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <hr className={classes.divider} />

                <li>
                  <Link href="/blog" className={classes.menuLink}>
                    <span className={classes.menuItemBtn}>Blog</span>
                  </Link>
                </li>

                <hr className={classes.divider} />

                <li>
                  <button
                    className={classes.menuItemBtn}
                    onClick={() => openCommunity(!isCommunityOpen)}
                  >
                    <span>Community</span>
                    <ExpandMoreIcon
                      className={clsx(
                        classes.expendIcon,
                        isCommunityOpen ? classes.turnDown : classes.static
                      )}
                    />
                  </button>
                </li>

                <Collapsible open={isCommunityOpen}>
                  <CollapsibleContent className={classes.collapsibleContent}>
                    <div className={classes.subMenuList}>
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

                      <a
                        href="/community"
                        className={classes.externalLinkButton}
                      >
                        {t('community.more')}
                      </a>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </ul>
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
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </div>
  );
}
