import classes from './index.module.css';
import Link from 'next/link';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AllMdVersionIdType, ApiReferenceRouteEnum } from '@/types/docs';
import { generateVersionSelectOptions } from '@/utils';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import { LanguageEnum } from '@/types/localization';

interface VersionSelectorProps {
  versions: string[];
  curVersion: string;
  latestVersion: string;
  type: 'doc' | 'api';
  currentMdId: string;
  homepageConf: {
    label: string;
    link: string;
  };
  mdListData: AllMdVersionIdType[];
  category?: ApiReferenceRouteEnum;
}

export default function VersionSelector(props: VersionSelectorProps) {
  const {
    versions,
    curVersion,
    latestVersion,
    type,
    currentMdId,
    homepageConf,
    mdListData,
    category,
  } = props;
  const { changeLocale } = useGlobalLocale();

  const links = useMemo(() => {
    if (currentMdId === 'home') {
      return versions.map(v => ({
        label: v,
        href: v === latestVersion ? '/docs' : `/docs/${v}`,
      }));
    }

    return generateVersionSelectOptions({
      versions,
      currentMdId,
      mdListData,
      latestVersion,
      type,
      category,
    });
  }, [currentMdId, mdListData, latestVersion, versions, category, type]);

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const handleVersionClick = () => {
    // Reset locale before navigating, matching previous behavior.
    changeLocale(LanguageEnum.ENGLISH);
    setOpen(false);
  };

  return (
    <div className={classes.selectorWrapper}>
      <Link
        href={homepageConf.link}
        className={clsx(classes.homeBtn, {
          [classes.docHomeButton]: type === 'doc',
          [classes.apiHomeButton]: type === 'api',
        })}
      >
        {homepageConf.label}
      </Link>

      <div className={classes.selectRoot} ref={wrapperRef}>
        <button
          type="button"
          className={classes.selectTrigger}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <span>{curVersion}</span>
          <ChevronDown
            className={clsx(classes.chevron, { [classes.chevronOpen]: open })}
            size={14}
          />
        </button>
        {/*
          The menu is always rendered (just visually hidden when closed) so the
          version <a href> links are present in the SSR HTML for crawlers.
        */}
        <ul
          className={clsx(classes.selectMenu, { [classes.selectMenuOpen]: open })}
          role="listbox"
          aria-hidden={!open}
        >
          {links.map(v => {
            const isCurrent = v.label === curVersion;
            return (
              <li key={v.label} role="option" aria-selected={isCurrent}>
                <Link
                  href={v.href}
                  className={clsx(classes.versionLink, {
                    [classes.versionLinkActive]: isCurrent,
                  })}
                  tabIndex={open ? 0 : -1}
                  onClick={handleVersionClick}
                >
                  {v.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
