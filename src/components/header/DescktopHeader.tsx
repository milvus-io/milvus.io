import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import clsx from 'clsx';
import {
  MILVUS_CODELAB_LINK,
  MILVUS_VIDEO_LINK,
  GITHUB_ATTU_LINK,
  GITHUB_MILVUS_CLI_LINK,
  GITHUB_MILVUS_BACKUP_LINK,
  CLOUD_SIGNUP_LINK,
} from '@/consts/links';
import { DownArrowIcon } from '@/components/icons';

import { LogoSection } from './Logos';

type Props = { className?: string };

export default function DesktopHeader(props: Props) {
  const { className } = props;
  const { t } = useTranslation('header');

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

  return (
    <div className="bg-white border-b border-solid border-gray-300">
      <div
        className={clsx(
          'hidden tablet:flex h-[76px] px-10 items-center justify-between max-w-[1440px] mx-auto',
          className
        )}
      >
        <LogoSection lightMode={true} />

        <ul className="flex items-center list-none gap-[16px]">
          {menuConfigs.map(config => {
            if (config.list) {
              return (
                <li key={config.label} className="shrink-0">
                  <div className="group relative">
                    <button className="group flex items-center gap-[4px] text-[14px] font-[500] font-['Inter'] h-[21px] px-[6px] text-[#00131A] hover:opacity-70 cursor-pointer">
                      <span className="inline-block leading-[16px]">
                        {config.label}
                      </span>
                      <DownArrowIcon
                        size={16}
                        className="group-hover:rotate-180 transition-transform"
                      />
                    </button>
                    <ul className="flex flex-col items-stretch gap-[4px] bg-white py-[8px] absolute invisible -z-10 opacity-0 rounded-[4px] list-none shadow-nav-menu transition group-hover:visible group-hover:z-10 group-hover:opacity-100">
                      {config.list.map(item => (
                        <li key={item.label}>
                          <Link
                            href={item.link}
                            rel={item.rel}
                            className="block text-[14px] leading-[40px] font-[400] px-[16px] text-black no whitespace-nowrap cursor-pointer hover:bg-black/[0.04]"
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
                <Link
                  href={config.link}
                  className="block text-[14px] leading-[21px] font-[500] px-[6px] text-[#00131A] hover:opacity-70 cursor-pointer"
                >
                  {config.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div>
          <Link href="/docs" target="_blank">
            <div className="h-9 px-3 py-1.5 rounded-md border border-solid border-gray-300 hover:border-slate-950 justify-start items-center gap-1 inline-flex cursor-pointer transition">
              <div className="text-center text-slate-950 text-sm font-medium leading-[21px]">
                {t('start')}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
