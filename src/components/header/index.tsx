import Link from 'next/link';
import { LocalizedAnchor } from '@/components/localizedLinks';
import clsx from 'clsx';
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
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

type HeaderLayoutMode = 'normal' | 'compact' | 'collapsed';
type ViewportTier = 'mobile' | 'compact-desktop' | 'medium-desktop' | 'wide-desktop';

const DESKTOP_MIN_WIDTH = 1280;
const OVERFLOW_HYSTERESIS_PX = 16;

const getViewportTier = (width: number): ViewportTier => {
  if (width < DESKTOP_MIN_WIDTH) return 'mobile';
  if (width <= 1400) return 'compact-desktop';
  if (width <= 1580) return 'medium-desktop';
  return 'wide-desktop';
};

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const startNum = `${(Number(milvusStats?.milvusStars || 0) / 1000).toFixed(
  1
)}K`;

const Header: React.FC<{
  darkMode?: boolean;
  className?: string;
  disableLangSelector?: boolean;
}> = ({ darkMode = false, className, disableLangSelector = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState<HeaderLayoutMode>('normal');
  const mobileMenuId = useId();
  const navBarRef = useRef<HTMLDivElement>(null);
  const leftSectionRef = useRef<HTMLDivElement>(null);
  const desktopNavListRef = useRef<HTMLUListElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const layoutModeRef = useRef<HeaderLayoutMode>('normal');
  const viewportTierRef = useRef<ViewportTier | null>(null);
  const thresholdsRef = useRef<{
    normal: number | null;
    compact: number | null;
  }>({ normal: null, compact: null });
  const {
    locale,
    disabled,
    disabledLanguages,
    onLocaleChange,
    getLocalePath,
  } = useGlobalLocale();
  const { t } = useTranslation('header', { lng: locale });
  const navItems = useHeaderNavItems({ t, getLocalePath, locale });
  const trackPath = useUtmTrackPath();
  const signupUrl = getCloudSignupUrl(trackPath);
  const containerClassName = className || responsiveClasses.homeContainer;

  const updateLayoutMode = useCallback((nextMode: HeaderLayoutMode) => {
    if (layoutModeRef.current === nextMode) {
      return;
    }
    layoutModeRef.current = nextMode;
    setLayoutMode(nextMode);
  }, []);

  const checkOverflow = useCallback(() => {
    const navBar = navBarRef.current;
    const leftSection = leftSectionRef.current;
    const desktopNavList = desktopNavListRef.current;
    const actions = actionsRef.current;

    if (!navBar || !leftSection || !desktopNavList || !actions) {
      return;
    }

    const tier = getViewportTier(window.innerWidth);
    if (tier === 'mobile') {
      viewportTierRef.current = tier;
      thresholdsRef.current = { normal: null, compact: null };
      updateLayoutMode('normal');
      return;
    }

    if (viewportTierRef.current !== null && viewportTierRef.current !== tier) {
      viewportTierRef.current = tier;
      thresholdsRef.current = { normal: null, compact: null };
      if (layoutModeRef.current !== 'normal') {
        updateLayoutMode('normal');
        return;
      }
    } else {
      viewportTierRef.current = tier;
    }

    const navBarStyle = window.getComputedStyle(navBar);
    const paddingLeft = parseFloat(navBarStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(navBarStyle.paddingRight) || 0;
    const availableWidth = navBar.clientWidth - paddingLeft - paddingRight;
    const mode = layoutModeRef.current;

    const measureRequiredWidth = () => {
      const logoEl = leftSection.firstElementChild as HTMLElement | null;
      const logoWidth = logoEl ? logoEl.getBoundingClientRect().width : 0;
      const leftStyle = window.getComputedStyle(leftSection);
      const leftGap = parseFloat(leftStyle.columnGap || leftStyle.gap) || 0;

      const navListStyle = window.getComputedStyle(desktopNavList);
      const navListGap =
        parseFloat(navListStyle.columnGap || navListStyle.gap) || 0;
      const topLevelNavItems = Array.from(
        desktopNavList.children
      ) as HTMLElement[];
      const navItemsWidth =
        topLevelNavItems.reduce(
          (sum, item) => sum + item.getBoundingClientRect().width,
          0
        ) +
        Math.max(0, topLevelNavItems.length - 1) * navListGap;

      const actionsStyle = window.getComputedStyle(actions);
      const actionsGap =
        parseFloat(actionsStyle.columnGap || actionsStyle.gap) || 0;
      const visibleActions = (
        Array.from(actions.children) as HTMLElement[]
      ).filter(child => window.getComputedStyle(child).display !== 'none');
      const actionsWidth =
        visibleActions.reduce(
          (sum, item) => sum + item.getBoundingClientRect().width,
          0
        ) +
        Math.max(0, visibleActions.length - 1) * actionsGap;

      const navBarGap =
        parseFloat(navBarStyle.columnGap || navBarStyle.gap) || 0;

      return Math.ceil(
        logoWidth + leftGap + navItemsWidth + navBarGap + actionsWidth
      );
    };

    if (mode === 'normal') {
      const required = measureRequiredWidth();
      thresholdsRef.current.normal = required;
      if (required > availableWidth) {
        updateLayoutMode('compact');
      } else {
        setIsMenuOpen(false);
      }
    } else if (mode === 'compact') {
      const required = measureRequiredWidth();
      thresholdsRef.current.compact = required;
      if (required > availableWidth) {
        updateLayoutMode('collapsed');
      } else if (
        thresholdsRef.current.normal !== null &&
        availableWidth >=
          thresholdsRef.current.normal + OVERFLOW_HYSTERESIS_PX
      ) {
        updateLayoutMode('normal');
      } else {
        setIsMenuOpen(false);
      }
    } else if (
      thresholdsRef.current.normal !== null &&
      availableWidth >= thresholdsRef.current.normal + OVERFLOW_HYSTERESIS_PX
    ) {
      updateLayoutMode('normal');
    } else if (
      thresholdsRef.current.compact !== null &&
      availableWidth >= thresholdsRef.current.compact + OVERFLOW_HYSTERESIS_PX
    ) {
      updateLayoutMode('compact');
    }
  }, [updateLayoutMode]);

  useEffect(() => {
    document.body.classList.toggle('lock-scroll', isMenuOpen);
    return () => document.body.classList.remove('lock-scroll');
  }, [isMenuOpen]);

  useIsomorphicLayoutEffect(() => {
    thresholdsRef.current = { normal: null, compact: null };
    updateLayoutMode('normal');
  }, [locale, disableLangSelector, containerClassName, updateLayoutMode]);

  useIsomorphicLayoutEffect(() => {
    checkOverflow();
  }, [layoutMode, locale, disableLangSelector, containerClassName, checkOverflow]);

  useEffect(() => {
    const navBar = navBarRef.current;
    const leftSection = leftSectionRef.current;
    const desktopNavList = desktopNavListRef.current;
    const actions = actionsRef.current;
    if (!navBar) {
      return;
    }

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => checkOverflow())
        : null;
    observer?.observe(navBar);
    if (leftSection) observer?.observe(leftSection);
    if (desktopNavList) observer?.observe(desktopNavList);
    if (actions) observer?.observe(actions);

    const handleResize = () => checkOverflow();
    window.addEventListener('resize', handleResize);

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (cancelled) {
        return;
      }
      thresholdsRef.current = { normal: null, compact: null };
      if (
        window.innerWidth >= DESKTOP_MIN_WIDTH &&
        layoutModeRef.current !== 'normal'
      ) {
        updateLayoutMode('normal');
      } else {
        checkOverflow();
      }
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [checkOverflow, updateLayoutMode]);

  return (
    <header
      className={clsx(classes.headerContainer, {
        [classes.stickyHeader]: !darkMode,
        [classes.fixedHeader]: darkMode,
        [classes.compactNav]: layoutMode === 'compact',
        [classes.collapsedNav]: layoutMode === 'collapsed',
      })}
    >
      <CloudBanner />
      <div className={classes.navBarWrapper}>
        <div
          ref={navBarRef}
          className={clsx(classes.navBar, containerClassName)}
        >
          <div ref={leftSectionRef} className={classes.leftSection}>
            <LogoSection />
            <nav className={classes.desktopNav} aria-label="Primary navigation">
              <ul ref={desktopNavListRef} className={classes.desktopNavList}>
                {navItems.map(item => (
                  <DesktopNavItem key={item.label} item={item} />
                ))}
              </ul>
            </nav>
          </div>

          <div ref={actionsRef} className={classes.actions}>
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
              aria-label={`Milvus GitHub (${t('star')} ${startNum})`}
              target="_blank"
              rel="noopener"
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
              <LocalizedAnchor
                href={signupUrl}
                target="_blank"
                rel="noopener"
              >
                {t('start')}
              </LocalizedAnchor>
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
                <LocalizedAnchor
                  href={signupUrl}
                  target="_blank"
                  rel="noopener"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('start')}
                </LocalizedAnchor>
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
          aria-hidden={!isOpen}
          inert={!isOpen}
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
