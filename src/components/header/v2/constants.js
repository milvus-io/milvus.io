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

export const NAVLIST_EN = [
  {
    label: 'What is Milvus?',
    link: '/docs/overview.md',
    activeKey: null,
    isExternal: false,
  },
  {
    label: 'Documentation',
    link: '/docs/home',
    activeKey: '/docs',
    isExternal: false,
  },
  {
    label: 'Resources',
    link: null,
    isExternal: false,
    activeKey: null,
    subMenu: [
      {
        label: 'Bootcamp',
        link: '/bootcamp',
        isExternal: false,
        activeKey: 'bootcamp',
      },
      {
        label: 'Blog',
        link: 'https://zilliz.com/blog',
        isExternal: true,
        activeKey: null,
      },
      {
        label: 'Tools',
        link: 'https://github.com/milvus-io/milvus-insight',
        isExternal: true,
        activeKey: null,
      },
      {
        label: 'Video',
        link: 'https://www.youtube.com/channel/UCMCo_F7pKjMHBlfyxwOPw-g',
        isExternal: true,
        activeKey: null,
      },
    ],
  },
  {
    label: 'Community',
    link: '/community',
    activeKey: '/community',
    isExternal: false,
  },
];

export const NAVLIST_CN = [
  {
    label: '什么是 Milvus?',
    link: '/docs/overview.md',
    activeKey: null,
    isExternal: false,
  },
  {
    label: '文档',
    link: '/docs/home',
    activeKey: '/docs',
    isExternal: false,
  },
  {
    label: '资源',
    link: null,
    activeKey: null,
    isExternal: false,
    subMenu: [
      {
        label: '训练营',
        link: '/bootcamp',
        isExternal: false,
        activeKey: 'bootcamp',
      },
      {
        label: '博客',
        link: 'https://zilliz.com/blog',
        isExternal: true,
        activeKey: null,
      },
      {
        label: '工具',
        link: 'https://github.com/milvus-io/milvus-insight',
        isExternal: true,
        activeKey: null,
      },
      {
        label: '视频',
        link: 'https://www.youtube.com/channel/UCMCo_F7pKjMHBlfyxwOPw-g',
        isExternal: true,
        activeKey: null,
      },
    ],
  },
  {
    label: '社区',
    link: '/community',
    activeKey: '/community',
    isExternal: false,
  },
];
