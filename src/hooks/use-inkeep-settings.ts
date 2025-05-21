import type {
  InkeepAIChatSettings,
  InkeepSearchSettings,
  InkeepBaseSettings,
  InkeepModalSettings,
  ToolFunction,
} from '@inkeep/cxkit-react';
import { salesSignalType, detectedSalesSignal } from '@/utils/inkeep';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { CONTACT_SALES_URL } from '@/consts/externalLinks';
import { useMemo } from 'react';

type InkeepSharedSettings = {
  baseSettings: InkeepBaseSettings;
  aiChatSettings: InkeepAIChatSettings;
  searchSettings: InkeepSearchSettings;
  modalSettings: InkeepModalSettings;
};

const validSalesSignalTypes: string[] = salesSignalType.options.map(
  option => option.value
);

const INKEEP_PRIMARY_COLOR = '#4DB7EF';

export const useInkeepSettings = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}): InkeepSharedSettings => {
  const baseSettings: InkeepBaseSettings = {
    apiKey: process.env.NEXT_PUBLIC_INKEEP_API_KEY,
    // integrationId: process.env.NEXT_PUBLIC_INKEEP_INTEGRATION_ID,
    // organizationId: process.env.NEXT_PUBLIC_INKEEP_ORGANIZATION_ID,
    primaryBrandColor: INKEEP_PRIMARY_COLOR,
    theme: {
      styles: [
        {
          key: 'custom-styles',
          type: 'link',
          value: '/inkeep/inkeep-overrides.css',
        },
      ],
    },
  };

  const modalSettings: InkeepModalSettings = useMemo(() => {
    return {
      isOpen: isOpen,
      onOpenChange: () => {
        console.log('open', open);
      },
    };
  }, [isOpen, onOpenChange]);

  const searchSettings: InkeepSearchSettings = {
    tabs: ['Docs', 'Blog'],
  };

  const aiChatSettings: InkeepAIChatSettings = {
    chatSubjectName: 'Milvus',
    aiAssistantAvatar:
      'https://milvus.io/icons/icon-48x48.png?v=587ea7d315fa8ebc198a8c112e054ef6',
    getHelpOptions: [
      {
        name: 'Discord',
        action: {
          type: 'open_link',
          url: 'https://milvus.io/discord',
        },
        icon: {
          builtIn: 'FaDiscord',
        },
      },
      {
        name: 'Github',
        action: {
          type: 'open_link',
          url: 'https://github.com/milvus-io/milvus',
        },
        icon: {
          builtIn: 'FaGithub',
        },
      },
    ],
    exampleQuestions: [
      "What's new in Milvus 2.5?",
      'How to use full text search in Milvus?',
      'How do I perform hybrid search and how does it work?',
    ],
    getTools: () => [
      {
        type: 'function',
        function: {
          name: 'detectSalesSignal',
          description:
            'Identify when users express interest in potentially purchasing a product.',
          parameters: zodToJsonSchema(detectedSalesSignal),
        },
        renderMessageButtons: ({ args }) => {
          // If any valid sales signal is detected, show a demo scheduling option
          if (args.type && validSalesSignalTypes.includes(args.type)) {
            return [
              {
                label: 'Talk to sales',
                icon: { builtIn: 'LuCalendar' },
                action: {
                  type: 'open_link',
                  url: CONTACT_SALES_URL,
                },
              },
            ];
          }
          return [];
        },
      } as ToolFunction<{ type: string }>,
    ],
  };

  return {
    baseSettings,
    aiChatSettings,
    searchSettings,
    modalSettings,
  };
};
