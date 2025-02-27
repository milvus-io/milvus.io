import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import Link from 'next/link';
import clsx from 'clsx';
import pageClasses from '@/styles/responsive.module.less';
import {
  DISCORD_INVITE_URL,
  MILVUS_VIDEO_LINK,
  GITHUB_ATTU_LINK,
  GITHUB_MILVUS_CLI_LINK,
  GITHUB_MILVUS_LINK,
  CLOUD_SIGNUP_LINK,
  GITHUB_MILVUS_BACKUP_LINK,
  GITHUB_VTS_LINK,
} from '@/consts/links';
import { RightTopArrowIcon } from '@/components/icons';
import SocialMedias from '../socialMedias';
import { LanguageEnum } from '@/types/localization';
import SubscribeNewsletter from '../subscribe';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import { Divider } from '@mui/material';
import { ZILLIZ_OFFICIAL_WEBSITE } from '@/consts/externalLinks';

type Props = {
  classes?: {
    container?: string;
    root?: string;
    content?: string;
    nav?: string;
  };
  lang?: LanguageEnum;
};

const Footer = (props: Props) => {
  const { classes: customClasses = {} } = props;
  const { container = '', root = '', content = '', nav } = customClasses;
  const { locale, getLocalePath } = useGlobalLocale();
  const { t } = useTranslation(['common', 'header'], { lng: locale });

  const footerJson = [
    {
      title: t(`common:v3trans.main.nav.resources`),
      children: [
        { name: t('header:docs'), to: getLocalePath('/docs') },
        { name: t('header:blog'), to: getLocalePath('/blog') },
        {
          name: t('header:footer.resource.managed'),
          to: CLOUD_SIGNUP_LINK,
          isExternal: true,
        },
        {
          name: t('header:footer.resource.contact'),
          to: getLocalePath('/contact'),
        },
      ],
    },
    {
      title: t(`common:v3trans.main.nav.tutorials`),
      children: [
        {
          name: t(`common:v3trans.main.nav.bootcamp`),
          to: getLocalePath('/bootcamp'),
        },
        {
          name: t(`common:v3trans.main.nav.demo`),
          to: getLocalePath('/milvus-demos'),
        },
        {
          name: t(`common:v3trans.main.nav.video`),
          to: MILVUS_VIDEO_LINK,
        },
      ],
    },
    {
      title: t(`common:v3trans.main.nav.tools`),
      children: [
        { name: 'Attu', to: GITHUB_ATTU_LINK },
        { name: 'Milvus CLI', to: GITHUB_MILVUS_CLI_LINK },
        {
          name: t('header:footer.tools.sizing'),
          to: getLocalePath('/tools/sizing'),
        },
        {
          name: t('header:footer.tools.backup'),
          to: GITHUB_MILVUS_BACKUP_LINK,
        },
        {
          name: t('header:footer.tools.vts'),
          to: GITHUB_VTS_LINK,
        },
      ],
    },
    {
      title: t(`common:v3trans.main.nav.community`),
      children: [
        {
          name: t(`common:v3trans.main.nav.getinvolved`),
          to: getLocalePath('/community'),
        },
        {
          name: 'Discord',
          to: DISCORD_INVITE_URL,
          isExternal: true,
        },
        {
          name: 'Github',
          to: GITHUB_MILVUS_LINK,
          isExternal: true,
        },
      ],
    },
  ];

  return (
    <footer
      className={clsx(
        pageClasses.homeContainer,
        'min-h-[390px] box-border bg-[#fff] border-t-[1px] border-solid border-[#ECECEE] font-mono',
        container
      )}
    >
      <div className={clsx('py-[80px]', root)}>
        <div
          className={clsx(
            'flex flex-col lg:flex-row justify-between space-y-8 lg:space-y-0 lg:space-x-16',
            content
          )}
        >
          <div className="flex  flex-col items-center max-phone:items-start sm:items-start lg:items-start flex-shrink-0 flex-grow-0 flex-[390px]">
            <img
              src="/images/layout/lf-ai-logo.svg"
              alt="LF_AI"
              className="h-[16px] w-[auto] mb-[10px]"
            />
            <div className="flex items-center gap-[8px] ">
              <Link href="/">
                <img
                  alt="Milvus"
                  className="h-[40px] w-[auto] max-phone:h-[30px]"
                  src="/images/layout/milvus-logo.svg"
                />
              </Link>
              <span className="h-[40px] w-[1px] bg-black3"></span>
              <a
                href={ZILLIZ_OFFICIAL_WEBSITE}
                target="_blank"
                rel="noreferrer noopener"
              >
                <img
                  src="/images/layout/zilliz-logo.svg"
                  alt="Zilliz"
                  className="h-[50px] w-[auto] max-phone:h-[40px]"
                />
              </a>
            </div>
            <div className="flex items-center gap-[8px] mt-[12px] text-[14px] font-[400] leading-[1.5] text-black2 whitespace-nowrap flex-wrap">
              <Trans
                t={t}
                i18nKey="v3trans.footnote.maintainer"
                components={[
                  <img
                    width={16}
                    height={16}
                    src="/images/blue-heart.png"
                    alt="Blue Heart Emoji"
                    className="mx-[-4px]"
                  />,
                  <a
                    href="https://zilliz.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-black2 hover:underline"
                  ></a>,
                ]}
              />
            </div>
            <div className="mt-[100px] w-full">
              <SubscribeNewsletter />
            </div>
            <div className="flex mt-[40px] space-x-[12px]">
              <SocialMedias />
            </div>
            <p className="mt-3 text-sm text-black1">
              {t('common:v3trans.footnote.copyright', {
                year: new Date().getFullYear(),
              })}
            </p>
          </div>
          <div
            className={clsx(
              'grid grid-cols-2 gap-8 text-sm sm:gap-x-0 flex-shrink-0 flex-grow-0 flex-[420px] max-tablet:flex-auto',
              nav
            )}
          >
            {footerJson.map(item => {
              return (
                <div key={item.title}>
                  <h3 className="text-[16px] font-[500] leading-[24px]">
                    {item.title}
                  </h3>
                  <ul className="mt-[20px] space-y-[8px]">
                    {item.children.map((child, index) => {
                      if (child.to.startsWith('http')) {
                        return (
                          <li key={index} className="list-none">
                            <a
                              key={`${index}-c.name`}
                              className="inline-flex items-center gap-[4px] text-[14px] font-[400] leading-[21px] text-black1 hover:opacity-[0.7]"
                              href={child.to}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {child.name}
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
                            className="text-[14px] font-[400] leading-[21px] text-black1 hover:opacity-[0.7]"
                          >
                            {child.name}
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
