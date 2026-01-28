import clsx from 'clsx';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import {
  DownArrowIcon,
  GitHubIcon,
  RightTopArrowIcon,
} from '@/components/icons';
import {
  GITHUB_ATTU_LINK,
  GITHUB_MILVUS_BACKUP_LINK,
  GITHUB_MILVUS_CLI_LINK,
  GITHUB_MILVUS_LINK,
  GITHUB_VTS_LINK,
  CLOUD_SIGNUP_LINK,
  MILVUS_VIDEO_LINK,
  GITHUB_DEEP_SEARCHER_LINK,
  DISCORD_INVITE_URL,
  GITHUB_MILVUS_COMMUNITY_LINK,
  GITHUB_CLAUDE_CONTEXT_LINK,
  MILVUS_SLACK_LINK
} from '@/consts/links';
import { MILVUS_OFFICE_HOURS_URL } from '@/consts/externalLinks';
import { LanguageSelector } from '@/components/language-selector';
import { useGlobalLocale } from '@/hooks/use-global-locale';

import milvusStats from '../../../global-stats.json';
import { LogoSection } from './Logos';
import useUtmTrackPath from '@/hooks/use-utm-track-path';

type Props = { className?: string; disableLangSelector?: boolean; };

const startNum = `${(Number(milvusStats?.milvusStars || 0) / 1000).toFixed(
  1
)}K`;

export default function DesktopHeader(props: Props) {
  const { className, disableLangSelector = false } = props;
  const {
    locale,
    disabled,
    disabledLanguages,
    localeSuffix,
    onLocaleChange,
    getLocalePath,
  } = useGlobalLocale();
  const { t } = useTranslation('header', { lng: locale });

  const trackPath = useUtmTrackPath();

  const menuConfigs = [
    {
      label: t('intro.label'),
      list: [
        {
          label: t('intro.definition'),
          link: getLocalePath('/intro'),
        },
        {
          label: t('intro.cases'),
          link: getLocalePath('/use-cases'),
        },
      ],
    },
    { label: t('docs'), link: '/docs' + localeSuffix },
    {
      label: t('tutorials.label'),
      list: [
        {
          label: t('tutorials.bootcamp'),
          link: getLocalePath('/bootcamp'),
        },
        {
          label: t('tutorials.demo'),
          link: getLocalePath('/milvus-demos'),
        },
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
        {
          label: t('tools.sizing'),
          link: getLocalePath('/tools/sizing'),
        },
        {
          label: t('tools.backup'),
          link: GITHUB_MILVUS_BACKUP_LINK,
          rel: 'noopener noreferrer',
        },
        {
          label: t('tools.vts'),
          link: GITHUB_VTS_LINK,
          rel: 'noopener noreferrer',
        },
        {
          label: t('tools.deepSearcher'),
          link: GITHUB_DEEP_SEARCHER_LINK,
          rel: 'noopener noreferrer',
        },
        {
          label: t('tools.claudeContext'),
          link: GITHUB_CLAUDE_CONTEXT_LINK,
          rel: 'noopener noreferrer',
        },
      ],
    },
    { label: t('blog'), link: getLocalePath('/blog') },
    {
      label: t('community.label'),
      link: getLocalePath('/community'),
      list: [
        {
          label: t('community.officeHours'),
          link: MILVUS_OFFICE_HOURS_URL,
          rel: 'noopener noreferrer',
        },
        {
          label: t("community.slack"),
          link: MILVUS_SLACK_LINK,
          rel: 'noopener noreferrer',
        },
        {
          label: t('community.discord'),
          link: DISCORD_INVITE_URL,
          rel: 'noopener noreferrer',
        },
        {
          label: t('community.github'),
          link: GITHUB_MILVUS_COMMUNITY_LINK,
          rel: 'noopener noreferrer',
        },
        {
          label: t('community.more'),
          link: getLocalePath('/community'),
        },
      ],
    },
  ];

  return (
    <div className="bg-white border-b-black4 border-b-[1px] border-solid max-[1280px]:border-none">
      <div
        className={clsx(
          'hidden xl:flex h-[58px] px-10 items-center justify-between mx-auto',
          className
        )}
      >
        <div className="flex items-center gap-[40px] max-[1240px]:gap-[10px]">
          <LogoSection />

          <ul className="flex items-center list-none gap-[16px] max-[1080px]:gap-[10px]">
            {menuConfigs.map(config => {
              if (config.list) {
                return (
                  <li key={config.label} className="shrink-0">
                    <div className="group relative">
                      <button className="group flex items-center gap-[4px] text-[14px] font-[500] h-[21px] text-black2 hover:text-black1 cursor-pointer font-mono uppercase text-[#667176]">
                        <span className="inline-block leading-[16px]">
                          {config.label}
                        </span>
                        <DownArrowIcon
                          size={16}
                          color="rgb(0, 19, 26, 0.7)"
                          className="group-hover:rotate-180 transition-transform"
                        />
                      </button>
                      <div className="invisible absolute opacity-0 group-hover:visible group-hover:z-10 group-hover:opacity-100 pt-[12px]">
                        <ul className="flex flex-col items-stretch gap-[4px] bg-white py-[8px] -z-10 rounded-[4px] list-none shadow-nav-menu transition">
                          {config.list.map(item => (
                            <li key={item.label}>
                              <Link
                                href={item.link}
                                rel={item.rel}
                                className="flex items-center gap-[4px] text-[14px] leading-[40px] font-[400] px-[16px] no whitespace-nowrap cursor-pointer hover:bg-black/[0.04] font-mono uppercase text-[#667176]"
                                target={item.rel ? '_blank' : undefined}
                              >
                                {item.label}
                                {item.rel && <RightTopArrowIcon />}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              }
              return (
                <li key={config.label}>
                  <Link
                    href={config.link}
                    className="block text-[14px] leading-[21px] font-[500]  hover:text-black1 cursor-pointer font-mono uppercase text-black2"
                  >
                    {config.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex gap-[20px] max-[1240px]:gap-[12px] max-[1080px]:gap-[10px] items-center font-mono">
          {!disableLangSelector && (
            <LanguageSelector
              value={locale}
              onChange={onLocaleChange}
              disabled={disabled}
              disabledLanguages={disabledLanguages}
              hiddenSelectValue={false}
            />
          )}
          <a
            href={GITHUB_MILVUS_LINK}
            className={
              'h-9 rounded-md flex items-center basis-[77px] flex-shrink-0 flex-grow-0 px-[6px] py-[3px] transition duration-200 ease-in-out text-black hover:text-black2'
            }
            target="_blank"
          >
            <GitHubIcon />
            <span className="text-[12px] leading-[18px] ml-[2px] mr-[4px] whitespace-nowrap">
              {t('star')}
            </span>
            <span className="text-[12px] font-[500] leading-[18px]">
              {startNum}
            </span>
          </a>
          <Link
            href={getLocalePath('/contact')}
            className="text-[12px] font-[500] leading-[18px] text-black1 hover:text-black2 transition duration-200 ease-in-out whitespace-pre"
          >
            {t('contact')}
          </Link>
          <Link
            href={`${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=milvus_nav_right&utm_content=${trackPath}`}
            target="_blank"
          >
            <div className="h-9 px-3 py-1.5 rounded-md  bg-blue1 hover:bg-[#008DC8] justify-start items-center gap-1 inline-flex cursor-pointer transition duration-200 ease-in-out">
              <div className="text-center text-white text-sm font-medium leading-[21px] whitespace-nowrap">
                {t('start')}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
