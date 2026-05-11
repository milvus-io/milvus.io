import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CloudBanner from '../banner';
import { Button } from '@/components/ui/button';
import {
  CloseIcon,
  DownArrowIcon,
  ExpandMoreIcon,
  GitHubIcon,
  MenuIcon,
  RightTopArrowIcon,
} from '@/components/icons';
import { LanguageSelector } from '@/components/language-selector';
import { GITHUB_MILVUS_LINK } from '@/consts/links';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import useUtmTrackPath from '@/hooks/use-utm-track-path';
import responsiveClasses from '@/styles/responsive.module.css';

import milvusStats from '../../../global-stats.json';
import { LogoSection } from './Logos';
import classes from './index.module.css';
import {
  getCloudSignupUrl,
  HeaderNavItem,
  useHeaderNavItems,
} from './navigation';

const startNum = `${(Number(milvusStats?.milvusStars || 0) / 1000).toFixed(
  1
)}K`;

const Header: React.FC<{
  darkMode?: boolean;
  className?: string;
  disableLangSelector?: boolean;
}> = ({ darkMode = false, className, disableLangSelector = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuId = useId();
  const {
    locale,
    disabled,
    disabledLanguages,
    onLocaleChange,
    getLocalePath,
  } = useGlobalLocale();
  const { t } = useTranslation('header', { lng: locale });
  const navItems = useHeaderNavItems({ t, getLocalePath });
  const trackPath = useUtmTrackPath();
  const signupUrl = getCloudSignupUrl(trackPath);
  const containerClassName = className || responsiveClasses.homeContainer;

  useEffect(() => {
    document.body.classList.toggle('lock-scroll', isMenuOpen);
    return () => document.body.classList.remove('lock-scroll');
  }, [isMenuOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1280px)');
    const closeMenuOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    };

    desktopQuery.addEventListener('change', closeMenuOnDesktop);
    return () => desktopQuery.removeEventListener('change', closeMenuOnDesktop);
  }, []);

  return (
    <header
      className={clsx(classes.headerContainer, {
        [classes.stickyHeader]: !darkMode,
        [classes.fixedHeader]: darkMode,
      })}
    >
      <CloudBanner />
      <div className={classes.navBarWrapper}>
        <div className={clsx(classes.navBar, containerClassName)}>
          <div className={classes.leftSection}>
            <LogoSection />
            <nav className={classes.desktopNav} aria-label="Primary navigation">
              <ul className={classes.desktopNavList}>
                {navItems.map(item => (
                  <DesktopNavItem key={item.label} item={item} />
                ))}
              </ul>
            </nav>
          </div>

          <div className={classes.actions}>
            {!disableLangSelector && (
              <LanguageSelector
                value={locale}
                onChange={onLocaleChange}
                disabled={disabled}
                disabledLanguages={disabledLanguages}
                hiddenSelectValue={false}
                className={classes.languageSelector}
              />
            )}
            <a
              href={GITHUB_MILVUS_LINK}
              className={classes.githubLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
              <span className={classes.githubText}>{t('star')}</span>
              <span className={classes.githubCount}>{startNum}</span>
            </a>
            <Link
              href={getLocalePath('/contact')}
              className={classes.contactLink}
            >
              {t('contact')}
            </Link>
            <Button asChild className={classes.startButton}>
              <a href={signupUrl} target="_blank" rel="noopener noreferrer">
                {t('start')}
              </a>
            </Button>
            <button
              type="button"
              className={classes.menuIconBtn}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls={mobileMenuId}
              onClick={() => setIsMenuOpen(open => !open)}
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <nav
          id={mobileMenuId}
          className={clsx(classes.mobileNav, classes.mobileNavOpen)}
          aria-label="Primary navigation"
        >
          <div className={clsx(classes.mobileNavInner, containerClassName)}>
            <ul className={classes.mobileNavList}>
              {navItems.map(item => (
                <MobileNavItem
                  key={item.label}
                  item={item}
                  onNavigate={() => setIsMenuOpen(false)}
                />
              ))}
            </ul>

            <div className={classes.mobileActions}>
              <Link
                href={getLocalePath('/contact')}
                className={classes.mobileContactLink}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('contact')}
              </Link>
              <Button asChild className={classes.mobileStartButton}>
                <a
                  href={signupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('start')}
                </a>
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

const DesktopNavItem = ({ item }: { item: HeaderNavItem }) => {
  const hasChildren = Boolean(item.children?.length);
  const triggerProps = item.href
    ? ({ href: item.href, label: item.label } as const)
    : null;

  if (hasChildren) {
    return (
      <li className={classes.desktopNavItem}>
        <div className={classes.desktopDropdown}>
          {triggerProps ? (
            <Link
              href={triggerProps.href}
              className={classes.desktopNavButton}
              aria-haspopup="menu"
            >
              <span>{triggerProps.label}</span>
              <DownArrowIcon
                size={16}
                color="rgb(0, 19, 26, 0.7)"
                className={classes.desktopArrow}
              />
            </Link>
          ) : (
            <button
              type="button"
              className={classes.desktopNavButton}
              aria-haspopup="menu"
            >
              <span>{item.label}</span>
              <DownArrowIcon
                size={16}
                color="rgb(0, 19, 26, 0.7)"
                className={classes.desktopArrow}
              />
            </button>
          )}
          <div className={classes.desktopDropdownPanel}>
            <ul className={classes.desktopDropdownList}>
              {item.children?.map(child => (
                <li key={child.label}>
                  <NavLink item={child} className={classes.desktopDropdownLink}>
                    {child.label}
                    {child.external && <RightTopArrowIcon />}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className={classes.desktopNavItem}>
      <NavLink item={item} className={classes.desktopNavLink}>
        {item.label}
      </NavLink>
    </li>
  );
};

const MobileNavItem = ({
  item,
  onNavigate,
}: {
  item: HeaderNavItem;
  onNavigate: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = Boolean(item.children?.length);

  if (hasChildren) {
    return (
      <li className={classes.mobileNavItem}>
        <div className={classes.mobileNavButtonGroup}>
          {item.href ? (
            <NavLink
              item={item}
              className={classes.mobileNavLinkWithChildren}
              onClick={onNavigate}
            >
              {item.label}
            </NavLink>
          ) : (
            <button
              type="button"
              className={classes.mobileNavGroupLabel}
              aria-expanded={isOpen}
              onClick={() => setIsOpen(open => !open)}
            >
              {item.label}
            </button>
          )}
          <button
            type="button"
            className={classes.mobileSubMenuToggle}
            aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${item.label}`}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(open => !open)}
          >
            <ExpandMoreIcon
              className={clsx(classes.mobileArrow, {
                [classes.mobileArrowOpen]: isOpen,
              })}
            />
          </button>
        </div>
        <div
          className={clsx(classes.mobileSubMenu, {
            [classes.mobileSubMenuOpen]: isOpen,
          })}
        >
          <ul className={classes.mobileSubMenuList}>
            {item.children?.map(child => (
              <li key={child.label}>
                <NavLink
                  item={child}
                  className={classes.mobileSubMenuLink}
                  onClick={onNavigate}
                >
                  {child.label}
                  {child.external && <RightTopArrowIcon />}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </li>
    );
  }

  return (
    <li className={classes.mobileNavItem}>
      <NavLink
        item={item}
        className={classes.mobileNavLink}
        onClick={onNavigate}
      >
        {item.label}
      </NavLink>
    </li>
  );
};

const NavLink = ({
  item,
  className,
  children,
  onClick,
}: {
  item: HeaderNavItem;
  className: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  if (!item.href) {
    return null;
  }

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel={item.rel}
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
};

export default Header;
