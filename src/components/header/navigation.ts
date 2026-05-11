import { useMemo } from 'react';
import { TFunction } from 'i18next';

import {
  CLOUD_SIGNUP_LINK,
  DISCORD_INVITE_URL,
  GITHUB_ATTU_LINK,
  GITHUB_CLAUDE_CONTEXT_LINK,
  GITHUB_DEEP_SEARCHER_LINK,
  GITHUB_MILVUS_BACKUP_LINK,
  GITHUB_MILVUS_CLI_LINK,
  GITHUB_MILVUS_COMMUNITY_LINK,
  GITHUB_VTS_LINK,
  MILVUS_VIDEO_LINK,
} from '@/consts/links';
import { MILVUS_OFFICE_HOURS_URL } from '@/consts/externalLinks';

export type HeaderNavItem = {
  label: string;
  href?: string;
  rel?: string;
  external?: boolean;
  children?: HeaderNavItem[];
};

type HeaderNavItemsParams = {
  t: TFunction;
  getLocalePath: (path: string) => string;
};

export const useHeaderNavItems = ({
  t,
  getLocalePath,
}: HeaderNavItemsParams): HeaderNavItem[] => {
  return useMemo(
    () => [
      {
        label: t('intro.label'),
        children: [
          {
            label: t('intro.definition'),
            href: getLocalePath('/intro'),
          },
          {
            label: t('intro.cases'),
            href: getLocalePath('/use-cases'),
          },
        ],
      },
      { label: t('docs'), href: getLocalePath('/docs') },
      {
        label: t('tutorials.label'),
        children: [
          {
            label: t('tutorials.bootcamp'),
            href: getLocalePath('/bootcamp'),
          },
          {
            label: t('tutorials.demo'),
            href: getLocalePath('/milvus-demos'),
          },
          {
            label: t('tutorials.video'),
            href: MILVUS_VIDEO_LINK,
            rel: 'noopener noreferrer',
            external: true,
          },
        ],
      },
      {
        label: t('tools.label'),
        children: [
          {
            label: t('tools.attu'),
            href: GITHUB_ATTU_LINK,
            rel: 'noopener noreferrer',
            external: true,
          },
          {
            label: t('tools.cli'),
            href: GITHUB_MILVUS_CLI_LINK,
            rel: 'noopener noreferrer',
            external: true,
          },
          {
            label: t('tools.sizing'),
            href: getLocalePath('/tools/sizing'),
          },
          {
            label: t('tools.backup'),
            href: GITHUB_MILVUS_BACKUP_LINK,
            rel: 'noopener noreferrer',
            external: true,
          },
          {
            label: t('tools.vts'),
            href: GITHUB_VTS_LINK,
            rel: 'noopener noreferrer',
            external: true,
          },
          {
            label: t('tools.deepSearcher'),
            href: GITHUB_DEEP_SEARCHER_LINK,
            rel: 'noopener noreferrer',
            external: true,
          },
          {
            label: t('tools.claudeContext'),
            href: GITHUB_CLAUDE_CONTEXT_LINK,
            rel: 'noopener noreferrer',
            external: true,
          },
        ],
      },
      { label: t('blog'), href: getLocalePath('/blog') },
      {
        label: t('community.label'),
        href: getLocalePath('/community'),
        children: [
          {
            label: t('community.officeHours'),
            href: MILVUS_OFFICE_HOURS_URL,
            rel: 'noopener noreferrer',
            external: true,
          },
          {
            label: t('community.discord'),
            href: DISCORD_INVITE_URL,
            rel: 'noopener noreferrer',
            external: true,
          },
          {
            label: t('community.github'),
            href: GITHUB_MILVUS_COMMUNITY_LINK,
            rel: 'noopener noreferrer',
            external: true,
          },
          {
            label: t('community.more'),
            href: getLocalePath('/community'),
          },
        ],
      },
    ],
    [getLocalePath, t]
  );
};

export const getCloudSignupUrl = (trackPath: string) => {
  const utmContent = trackPath ? `&utm_content=${trackPath}` : '';
  return `${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=milvus_nav_right${utmContent}`;
};
