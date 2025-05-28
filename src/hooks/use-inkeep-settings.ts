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
  onOpenChange: (param: boolean) => void;
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
          type: 'style',
          value: `
          .ikp-ai-chat-footer__footer {
  align-items: center;
}

.ikp-tagline {
  align-items: center;
  position: relative;
}

.ikp-tagline > div {
  display: none;
}

.ikp-tagline > a > div:before {
  content: 'By';
  font-weight: normal;
}

.ikp-tagline:after {
  content: '';
  margin-left: 1.35rem;
  width: 54px;
  height: 22px;
  background: url('/inkeep/zilliz-grayscale.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.ikp-tagline:before {
  content: '&';
  position: absolute;
  right: 54px;
  color: #889096;
  margin-left: 0.35rem;
  margin-right: 0.35rem;
  font-size: 0.875rem;
  font-weight: 600;
  transform: translateY(-50%);
  top: 50%;
}

.ikp-content-parser__text > code {
  color: #fff !important;
}

          `,
        },
      ],
    },
  };

  const modalSettings: InkeepModalSettings = useMemo(() => {
    return {
      isOpen: isOpen,
      onOpenChange: onOpenChange,
    };
  }, [isOpen, onOpenChange]);

  const searchSettings: InkeepSearchSettings = {
    tabs: ['Docs', 'Blog'],
  };

  const aiChatSettings: InkeepAIChatSettings = {
    chatSubjectName: 'Milvus',
    // aiAssistantAvatar: '/inkeep/milvus-icon-white.png',
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
