import { useEffect, useRef, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import clsx from 'clsx';
import Link from 'next/link';
import {
  MILVUS_CODELAB_LINK,
  MILVUS_VIDEO_LINK,
  GITHUB_ATTU_LINK,
  GITHUB_MILVUS_CLI_LINK,
  GITHUB_MILVUS_BACKUP_LINK,
  CLOUD_SIGNUP_LINK,
} from '@/consts/links';

import { LogoSection, ActionBar } from './Logos';

import pageClasses from '../../styles/responsive.module.less';
import classes from './desktopHeader.module.less';

export default function DesktopHeader(props) {
  const { darkMode = false, className } = props;
  const theme = darkMode ? 'dark' : 'light';
  const { t } = useTranslation('header');

  const headerContainerRef = useRef(null);

  const [isDarkLogo, setIsDarkLogo] = useState(theme === 'dark');

  const menuConfigs = [
    {
      label: t('intro.label'),
      list: [
        { label: t('intro.definition'), link: '/intro' },
        { label: t('intro.cases'), link: '/use-cases' },
      ],
    },
    { label: t('docs'), link: '/docs' },
    {
      label: t('tutorials.label'),
      list: [
        { label: t('tutorials.codelabs'), link: MILVUS_CODELAB_LINK },
        { label: t('tutorials.bootcamp'), link: '/bootcamp' },
        { label: t('tutorials.demo'), link: '/milvus-demos' },
        {
          label: t('tutorials.video'),
          link: MILVUS_VIDEO_LINK,
          rel: 'noopener noreferrer',
        },
      ],
    },
    {
      label: t('tools.label'),
      list: [
        {
          label: t('tools.attu'),
          link: GITHUB_ATTU_LINK,
          rel: 'noopener noreferrer',
        },
        {
          label: t('tools.cli'),
          link: GITHUB_MILVUS_CLI_LINK,
          rel: 'noopener noreferrer',
        },
        { label: t('tools.sizing'), link: '/tools/sizing' },
        {
          label: t('tools.backup'),
          link: GITHUB_MILVUS_BACKUP_LINK,
          rel: 'noopener noreferrer',
        },
      ],
    },
    { label: t('blog'), link: '/blog' },
    { label: t('community'), link: '/community' },
  ];

  useEffect(() => {
    const target = headerContainerRef.current;
    if (theme === 'light' || typeof window === 'undefined' || !target) {
      return;
    }
    const onScroll = e => {
      const scrollTop = window.document.documentElement.scrollTop;
      if (scrollTop > 90) {
        target.classList.add(classes.lightHeaderContainer);
        target.classList.remove(classes.darkHeaderContainer);
        setIsDarkLogo(false);
      }
      if (scrollTop < 90) {
        target.classList.add(classes.darkHeaderContainer);
        target.classList.remove(classes.lightHeaderContainer);
        setIsDarkLogo(true);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [theme, headerContainerRef.current]);

  return (
    <div
      className={clsx(classes.commonHeaderContainer, {
        [classes.lightHeaderContainer]: theme === 'light',
        [classes.darkHeaderContainer]: theme === 'dark',
      })}
      ref={headerContainerRef}
    >
      <div
        className={clsx(
          pageClasses.container,
          classes.desktopHeader,
          className
        )}
      >
        <LogoSection lightMode={!isDarkLogo} />
        <div className={classes.headerNavBar}>
          <div className={classes.leftSection}>
            <ul className={classes.menuList}>
              {menuConfigs.map(config => {
                if (config.list) {
                  return (
                    <li key={config.label}>
                      <div className={classes.subMenuWrapper}>
                        <button className={classes.menuItem}>
                          {config.label}
                        </button>
                        <ul className={classes.subMenuList}>
                          {config.list.map(item => (
                            <li key={item.label}>
                              <Link
                                href={item.link}
                                rel={item.rel}
                                className={classes.subMenuLink}
                                target={item.rel ? '_blank' : undefined}
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  );
                }
                return (
                  <li key={config.label}>
                    <Link href={config.link} className={classes.menuItem}>
                      {config.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={classes.rightSection}>
            <ActionBar />
            <Link
              href={CLOUD_SIGNUP_LINK}
              target="_blank"
              className={classes.startBtn}
            >
              <Trans
                t={t}
                i18nKey="try"
                components={[<span></span>]}
                values={{ price: t('free') }}
              />
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M12 3.5L18.364 9.86396L12 16.2279"
                  stroke="white"
                  strokeWidth="2"
                />
                <path d="M18 10H1" stroke="white" strokeWidth="2" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
