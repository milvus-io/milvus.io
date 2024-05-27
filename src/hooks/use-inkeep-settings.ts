import type {
  InkeepAIChatSettings,
  InkeepSearchSettings,
  InkeepWidgetBaseSettings,
  InkeepModalSettings,
} from '@inkeep/widgets';

type InkeepSharedSettings = {
  baseSettings: InkeepWidgetBaseSettings;
  aiChatSettings: InkeepAIChatSettings;
  searchSettings: InkeepSearchSettings;
  modalSettings: InkeepModalSettings;
};

const INKEEP_PRIMARY_COLOR = '#4DB7EF';

export const useInkeepSettings = (): InkeepSharedSettings => {
  const baseSettings: InkeepWidgetBaseSettings = {
    apiKey: process.env.NEXT_PUBLIC_INKEEP_API_KEY,
    integrationId: process.env.NEXT_PUBLIC_INKEEP_INTEGRATION_ID,
    organizationId: process.env.NEXT_PUBLIC_INKEEP_ORG_ID,
    primaryBrandColor: INKEEP_PRIMARY_COLOR,
  };

  const modalSettings: InkeepModalSettings = {
    // optional settings
  };

  const searchSettings: InkeepSearchSettings = {
    // optional settings
  };

  const aiChatSettings: InkeepAIChatSettings = {
    chatSubjectName: 'Milvus',
    botAvatarSrcUrl:
      'https://milvus.io/icons/icon-48x48.png?v=587ea7d315fa8ebc198a8c112e054ef6',
    botAvatarDarkSrcUrl: '/inkeep/milvus-icon-white.png',
    getHelpCallToActions: [
      {
        name: 'Discord',
        url: 'https://milvus.io/discord',
        icon: {
          builtIn: 'FaDiscord',
        },
      },
      {
        name: 'Github',
        url: 'https://github.com/milvus-io/milvus',
        icon: {
          builtIn: 'FaGithub',
        },
      },
    ],
    quickQuestions: [
      'What are some techniques for increasing embedding speeds?',
      'How do I perform hybrid search and how does it work?',
      'What is re-ranking and are there built in ways to do that?',
    ],
  };

  return { baseSettings, aiChatSettings, searchSettings, modalSettings };
};
