import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import {
  faGithub,
  faYoutube,
  faDiscord,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as styles from './index.module.less';
import pageClasses from '../../styles/responsive.module.less';

import { DISCORD_INVITE_URL } from '../../consts';
import MilvusCookieConsent from '../milvusCookieConsent';

const footerJson = [
  {
    title: 'resources',
    children: [
      { name: 'Docs', trans: false, to: '/docs' },
      {
        name: 'Blog',
        trans: false,
        to: '/blog',
      },
      { name: 'Learn', trans: false, to: 'https://zilliz.com/learn' },
    ],
  },
  {
    title: 'tutorials',
    children: [
      { name: 'bootcamp', trans: true, to: '/bootcamp' },
      { name: 'demo', trans: true, to: '/milvus-demos' },
      {
        name: 'video',
        trans: true,
        to: 'https://www.youtube.com/c/MilvusVectorDatabase',
      },
    ],
  },
  {
    title: 'tools',
    children: [
      { name: 'Attu', trans: false, to: 'https://github.com/zilliztech/attu' },
      {
        name: 'Milvus_CLI',
        trans: false,
        to: 'https://github.com/zilliztech/milvus_cli',
      },
      { name: 'Sizing Tool', trans: false, to: '/tools/sizing' },
    ],
  },
  {
    title: 'community',
    children: [
      { name: 'getinvolved', trans: true, to: '/community' },
      { name: 'Slack', trans: false, to: 'https://slack.milvus.io' },
      {
        name: 'Github',
        trans: false,
        to: 'https://github.com/milvus-io/milvus',
      },
      { name: 'forum', trans: true, to: 'https://discuss.milvus.io/' },
    ],
  },
];

const socialJson = [
  {
    icon: faGithub,
    link: 'https://github.com/milvus-io/milvus',
  },
  {
    icon: faDiscord,
    link: DISCORD_INVITE_URL,
  },
  {
    icon: faXTwitter,
    link: 'https://twitter.com/milvusio',
  },
  {
    icon: faYoutube,
    link: 'https://www.youtube.com/channel/UCMCo_F7pKjMHBlfyxwOPw-g',
  },
];

const Footer = ({ darkMode = true, t, className }) => {
  return (
    <footer
      className={clsx(styles.footerContainer, {
        [className]: className,
        [styles.dark]: darkMode,
      })}
    >
      <div className={clsx(pageClasses.container, styles.contentWrapper)}>
        <div className={`${styles.footContentWrapper} `}>
          {footerJson.map(f => (
            <div key={f.title} className={`${styles.footerItem} col-2`}>
              <span className={styles.itemTitle}>
                {t(`v3trans.main.nav.${f.title}`)}
              </span>

              {f.children.map((c, index) => {
                if (c.to.startsWith('http')) {
                  return (
                    <a
                      key={`${index}-c.name`}
                      className={styles.itemEntry}
                      href={c.to}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {c.trans ? t(`v3trans.main.nav.${c.name}`) : c.name}
                    </a>
                  );
                }
                return (
                  <Link
                    key={`${index}-c.name`}
                    href={c.to}
                    className={styles.itemEntry}
                  >
                    {c.trans ? t(`v3trans.main.nav.${c.name}`) : c.name}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
        <div className={styles.bottombar}>
          <span>{`Milvus. ${new Date().getFullYear()} All rights reserved.`}</span>

          <div className={styles.social}>
            {socialJson.map(s => {
              const target = s.link
                ? s.link.includes('http')
                  ? '_blank'
                  : '_self'
                : '_self';

              return (
                <a
                  key={s.link}
                  href={s.link}
                  target={target}
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon
                    className={styles.iconWrapper}
                    icon={s.icon}
                  />
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <MilvusCookieConsent />
    </footer>
  );
};

export default Footer;
