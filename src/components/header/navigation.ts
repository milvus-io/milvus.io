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
  getMilvusSlackLink,
  MILVUS_VIDEO_LINK,
} from '@/consts/links';
import { MILVUS_OFFICE_HOURS_URL } from '@/consts/externalLinks';
import { LanguageEnum } from '@/types/localization';

export type HeaderNavItem = {
  label: string;
  href?: string;
  rel?: string;
  external?: boolean;
  activePaths?: string[];
  children?: HeaderNavItem[];
};

const LOCALE_PREFIX_REGEX =
  /^\/(zh-hant|zh|ja|ko|fr|de|es|it|pt|ru|id|ar)(?=\/|$)/;

const normalizeExactPathname = (pathname: string) => {
  const clean = pathname.split(/[?#]/)[0] || '';
  if (!clean) {
    return '';
  }
  return clean.length > 1 && clean.endsWith('/') ? clean.slice(0, -1) : clean;
};

const normalizePathname = (pathname: string) => {
  const clean = normalizeExactPathname(pathname);
  if (!clean) {
    return '';
  }
  const withoutLocale = clean.replace(LOCALE_PREFIX_REGEX, '') || '/';
  return withoutLocale.length > 1 && withoutLocale.endsWith('/')
    ? withoutLocale.slice(0, -1)
    : withoutLocale;
};

export const isHeaderNavItemActive = (
  item: HeaderNavItem,
  pathname: string
): boolean => {
  if (!item.activePaths?.length || !pathname) {
    return false;
  }
  const normalized = normalizePathname(pathname);
  if (!normalized) {
    return false;
  }
  return item.activePaths.some(
    prefix => normalized === prefix || normalized.startsWith(`${prefix}/`)
  );
};

export const isHeaderNavLinkCurrent = (
  item: HeaderNavItem,
  pathname: string
): boolean => {
  if (!item.href || item.external || !pathname) {
    return false;
  }
  const normalizedTarget = normalizeExactPathname(item.href);
  const normalizedCurrent = normalizeExactPathname(pathname);
  return Boolean(normalizedTarget) && normalizedTarget === normalizedCurrent;
};

type HeaderNavItemsParams = {
  t: TFunction;
  locale: LanguageEnum;
  getLocalePath: (path: string) => string;
};

export const useHeaderNavItems = ({
  t,
  locale,
  getLocalePath,
}: HeaderNavItemsParams): HeaderNavItem[] => {
  return useMemo(
    () => [
      {
        label: t('intro.label'),
        activePaths: ['/intro', '/use-cases', '/solutions', '/compare'],
        children: [
          {
            label: t('intro.definition'),
            href: getLocalePath('/intro'),
          },
          {
            label: t('intro.cases'),
            href: getLocalePath('/use-cases'),
          },
          {
            label: t('nav.solutions'),
            href: getLocalePath('/solutions').startsWith('/zh/') ? '/zh/solutions' : '/solutions',
          },
          {
            label: t('nav.compare'),
            href: getLocalePath('/compare').startsWith('/zh/') ? '/zh/compare' : '/compare',
          },
        ],
      },
      {
        label: t('docs'),
        href: getLocalePath('/docs'),
        activePaths: ['/docs', '/api-reference'],
      },
      {
        label: t('tutorials.label'),
        activePaths: ['/bootcamp', '/milvus-demos'],
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
            rel: 'noopener',
            external: true,
          },
        ],
      },
      {
        label: t('tools.label'),
        activePaths: ['/tools', '/learn-milvus'],
        children: [
          {
            label: t('nav.learnMilvus'),
            href: getLocalePath('/learn-milvus'),
          },
          {
            label: t('tools.attu'),
            href: GITHUB_ATTU_LINK,
            rel: 'noopener',
            external: true,
          },
          {
            label: t('tools.cli'),
            href: GITHUB_MILVUS_CLI_LINK,
            rel: 'noopener',
            external: true,
          },
          {
            label: t('tools.sizing'),
            href: getLocalePath('/tools/sizing'),
          },
          {
            label: t('tools.backup'),
            href: GITHUB_MILVUS_BACKUP_LINK,
            rel: 'noopener',
            external: true,
          },
          {
            label: t('tools.vts'),
            href: GITHUB_VTS_LINK,
            rel: 'noopener',
            external: true,
          },
          {
            label: t('tools.deepSearcher'),
            href: GITHUB_DEEP_SEARCHER_LINK,
            rel: 'noopener',
            external: true,
          },
          {
            label: t('tools.claudeContext'),
            href: GITHUB_CLAUDE_CONTEXT_LINK,
            rel: 'noopener',
            external: true,
          },
        ],
      },
      {
        label: t('blog'),
        href: getLocalePath('/blog'),
        activePaths: ['/blog'],
      },
      {
        label: t('community.label'),
        href: getLocalePath('/community'),
        activePaths: ['/community'],
        children: [
          {
            label: t('community.officeHours'),
            href: MILVUS_OFFICE_HOURS_URL,
            rel: 'noopener',
            external: true,
          },
          {
            label: t('community.slack'),
            href: getMilvusSlackLink(locale),
            rel: 'noopener',
            external: true,
          },
          {
            label: t('community.discord'),
            href: DISCORD_INVITE_URL,
            rel: 'noopener',
            external: true,
          },
          {
            label: t('community.github'),
            href: GITHUB_MILVUS_COMMUNITY_LINK,
            rel: 'noopener',
            external: true,
          },
          {
            label: t('community.more'),
            href: getLocalePath('/community'),
          },
        ],
      },
    ],
    [getLocalePath, locale, t]
  );
};

export const getCloudSignupUrl = (trackPath: string) => {
  const utmContent = trackPath ? `&utm_content=${trackPath}` : '';
  return `${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=milvus_nav_right${utmContent}`;
};
