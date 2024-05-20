import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithub,
  faYoutube,
  faDiscord,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import {
  DISCORD_INVITE_URL,
  ZILLIZ_LEARN_LINK,
  MILVUS_VIDEO_LINK,
  GITHUB_ATTU_LINK,
  GITHUB_MILVUS_CLI_LINK,
  MILVUS_SLACK_LINK,
  GITHUB_MILVUS_LINK,
  MILVUS_FORUM_LINK,
  MILVUS_TWITTER_LINK,
  MILVUS_YOUTUBE_CHANNEL_LINK,
} from '@/consts/links';

import styles from './index.module.less';

const footerJson = [
  {
    title: 'resources',
    children: [
      { name: 'Docs', trans: false, to: '/docs' },
      { name: 'Blog', trans: false, to: '/blog' },
      { name: 'Learn', trans: false, to: ZILLIZ_LEARN_LINK },
    ],
  },
  {
    title: 'tutorials',
    children: [
      { name: 'bootcamp', trans: true, to: '/bootcamp' },
      { name: 'demo', trans: true, to: '/milvus-demos' },
      { name: 'video', trans: true, to: MILVUS_VIDEO_LINK },
    ],
  },
  {
    title: 'tools',
    children: [
      { name: 'Attu', trans: false, to: GITHUB_ATTU_LINK },
      { name: 'Milvus CLI', trans: false, to: GITHUB_MILVUS_CLI_LINK },
      { name: 'Sizing Tool', trans: false, to: '/tools/sizing' },
    ],
  },
  {
    title: 'community',
    children: [
      { name: 'getinvolved', trans: true, to: '/community' },
      { name: 'Slack', trans: false, to: MILVUS_SLACK_LINK },
      { name: 'Github', trans: false, to: GITHUB_MILVUS_LINK },
      { name: 'forum', trans: true, to: MILVUS_FORUM_LINK },
    ],
  },
];

const socialJson = [
  { icon: faXTwitter, link: MILVUS_TWITTER_LINK },
  { icon: faGithub, link: GITHUB_MILVUS_LINK },
  { icon: faDiscord, link: DISCORD_INVITE_URL },
  { icon: faYoutube, link: MILVUS_YOUTUBE_CHANNEL_LINK },
];

const Footer = ({ darkMode = true, classes: customerClasses = {} }) => {
  const { t } = useTranslation();

  const { root = '', content = '' } = customerClasses as Record<string, string>;

  return (
    <footer className="min-h-[390px] box-border border-t-[1px] border-[#D0D7DC] border-solid">
      <div className="px-[135px] py-[80px]">
        <div className="flex flex-col lg:flex-row justify-between space-y-8 lg:space-y-0 lg:space-x-16">
          <div className="flex flex-col items-center sm:items-start lg:items-start">
            <img
              alt="Milvus logo"
              height="30"
              width="131"
              src={'/images/milvus_logo.svg'}
              style={{
                aspectRatio: '120/40',
                objectFit: 'cover',
              }}
            />
            <div className="flex mt-6 space-x-[12px]">
              <div className="flex items-center justify-between gap-[12px]">
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
            <p className="mt-4 text-sm text-gray-500">
              {`Copyright © Milvus. ${new Date().getFullYear()} All rights reserved.`}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:gap-0">
            {footerJson.map(item => {
              return (
                <div key={item.title} className="w-[260px] sm:w-[150px]">
                  <h3 className="text-[16px] font-[500] leading-[24px]">
                    {t(`v3trans.main.nav.${item.title}`)}
                  </h3>
                  <ul className="mt-[20px] space-y-[8px]">
                    {item.children.map((child, index) => {
                      if (child.to.startsWith('http')) {
                        return (
                          <li key={index} className="list-none">
                            <a
                              key={`${index}-c.name`}
                              className="text-[14px] font-[400] leading-[21px] text-black"
                              href={child.to}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {child.trans
                                ? t(`v3trans.main.nav.${child.name}`)
                                : child.name}
                            </a>
                          </li>
                        );
                      }
                      return (
                        <li key={index} className="list-none">
                          <Link
                            key={`${index}-c.name`}
                            href={child.to}
                            className="text-[14px] font-[400] leading-[21px] text-black"
                          >
                            {child.trans
                              ? t(`v3trans.main.nav.${child.name}`)
                              : child.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
