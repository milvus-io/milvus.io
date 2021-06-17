import git from '../../../images/v2/github.svg';

export const LANGUAGES = [
  {
    label: '中文',
    value: 'cn',
  },
  {
    label: 'English',
    value: 'en',
  },
];

export const NAVLIST = [
  {
    label: 'What is milvus?',
    link: '/docs/overview.md',
    isExternal: false,
  },
  {
    label: 'Documentation',
    link: '/docs/home',
    keyWord: 'docs',
    isExternal: false,
  },
  {
    label: 'Blog',
    link: 'https://blog.milvus.io/',
    isExternal: true,
  },
  {
    label: 'Contribute',
    link: '/community',
    keyWord: 'community',
    isExternal: false,
  },
  {
    label: 'Github',
    link: 'https://github.com/milvus-io/milvus/',
    isExternal: true,
    icon: git,
  },
];
