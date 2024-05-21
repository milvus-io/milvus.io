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
  MILVUS_VIDEO_LINK,
  GITHUB_ATTU_LINK,
  GITHUB_MILVUS_CLI_LINK,
  GITHUB_MILVUS_LINK,
  MILVUS_TWITTER_LINK,
  MILVUS_YOUTUBE_CHANNEL_LINK,
  CLOUD_SIGNUP_LINK,
  GITHUB_MILVUS_BACKUP_LINK,
} from '@/consts/links';
import { RightTopArrowIcon } from '@/components/icons';

import styles from './index.module.less';

const footerJson = [
  {
    title: 'resources',
    children: [
      { name: 'Docs', trans: false, to: '/docs' },
      { name: 'Blog', trans: false, to: '/blog' },
      {
        name: 'Managed service',
        trans: false,
        to: CLOUD_SIGNUP_LINK,
        isExternal: true,
      },
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
      {
        name: 'Milvus backup tool',
        trans: false,
        to: GITHUB_MILVUS_BACKUP_LINK,
      },
    ],
  },
  {
    title: 'community',
    children: [
      { name: 'getinvolved', trans: true, to: '/community' },
      {
        name: 'Discord',
        trans: false,
        to: DISCORD_INVITE_URL,
        isExternal: true,
      },
      {
        name: 'Github',
        trans: false,
        to: GITHUB_MILVUS_LINK,
        isExternal: true,
      },
    ],
  },
];

const socialJson = [
  { icon: faXTwitter, link: MILVUS_TWITTER_LINK },
  { icon: faGithub, link: GITHUB_MILVUS_LINK },
  { icon: faDiscord, link: DISCORD_INVITE_URL },
  { icon: faYoutube, link: MILVUS_YOUTUBE_CHANNEL_LINK },
];

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="min-h-[390px] box-border border-t-[1px] border-[#D0D7DC] border-solid bg-[#FAFAFA]">
      <div className="px-[48px] py-[80px] md:px-[135px] lg:px-[80px] xl:px-[135px]">
        <div className="flex flex-col lg:flex-row justify-between space-y-8 lg:space-y-0 lg:space-x-16">
          <div className="flex flex-col items-center sm:items-start lg:items-start shrink-0">
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
            <div className="flex mt-[40px] space-x-[12px]">
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
                      className="inline-flex items-center justify-center w-[40px] h-[40px] rounded-[12px] border-[1px] border-solid border-[#D0D7DC] cursor-pointer"
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
            <p className="mt-3 text-sm text-gray-500">
              {`Copyright © Milvus. ${new Date().getFullYear()} All rights reserved.`}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:gap-x-0">
            {footerJson.map(item => {
              return (
                <div key={item.title} className="w-[200px] xl:w-[260px] ">
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
                              className="inline-flex items-center gap-[4px] text-[14px] font-[400] leading-[21px] text-black"
                              href={child.to}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {child.trans
                                ? t(`v3trans.main.nav.${child.name}`)
                                : child.name}
                              {child.isExternal && <RightTopArrowIcon />}
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
