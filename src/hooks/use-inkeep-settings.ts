import type {
  InkeepAIChatSettings,
  InkeepSearchSettings,
  InkeepBaseSettings,
  InkeepModalSettings,
  ToolFunction,
} from '@inkeep/cxkit-react';
import {
  answerConfidence,
  provideAnswerConfidenceSchema,
  salesSignalType,
  detectedSalesSignal,
  supportSignalType,
  detectedSupportSignal,
} from '@/utils/inkeep';
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
      {
        name: 'Contact Us',
        action: {
          type: 'open_link',
          url: 'https://zilliz.com/contact-sales?contact_sales_traffic_source=milvusBot',
        },
        icon: {
          builtIn: 'IoMail',
        },
      },
    ],
    exampleQuestions: [
      "What's new in Milvus 2.6?",
      'Architecture changes',
      'Analyzers and Tokenizers',
      'Embedding & Reranking Functions',
      'Pharse Match',
    ],
    getTools: () => [
      // {
      //   type: 'function',
      //   function: {
      //     name: 'provideAnswerConfidence',
      //     description:
      //       'Determine how confident the AI assistant was and whether or not to escalate to humans.',
      //     parameters: zodToJsonSchema(provideAnswerConfidenceSchema),
      //   },
      //   renderMessageButtons: ({ args }) => {
      //     const confidence = args.answerConfidence;
      //     if (['not_confident', 'no_sources', 'other'].includes(confidence)) {
      //       return [
      //         {
      //           label: 'New Issue',
      //           icon: { builtIn: 'IoHelpBuoyOutline' },
      //           action: {
      //             type: 'open_link',
      //             url: 'https://github.com/milvus-io/milvus/issues',
      //           },
      //         },
      //       ];
      //     }
      //     return [];
      //   },
      // } as ToolFunction<{
      //   answerConfidence: string;
      //   explanation: string;
      // }>,
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
                label: 'Contact Sales',
                icon: { builtIn: 'LuCalendar' },
                action: {
                  type: 'open_link',
                  url: `${CONTACT_SALES_URL}?contact_sales_traffic_source=milvusBot`,
                },
              },
            ];
          }
          return [];
        },
      } as ToolFunction<{ type: string }>,
      {
        type: 'function',
        function: {
          name: 'detectSupportSignal',
          description:
            'Detect whether the user is requesting technical support or reporting an issue.',
          parameters: zodToJsonSchema(detectedSupportSignal),
        },
        renderMessageButtons: ({ args }) => {
          const signal = args?.type;
          if (
            [
              'technical_issue',
              'deployment_and_setup',
              'system_operations',
              'data_and_performance',
              'integration_and_solutions',
              'ai_low_confidence_or_docs_missing',
              'direct_support_request',
            ].includes(signal)
          ) {
            return [
              {
                label: 'Talk to Us',
                icon: { builtIn: 'IoHelpBuoyOutline' },
                action: {
                  type: 'open_link',
                  url: 'https://meetings.hubspot.com/chloe-williams1/milvus-office-hour',
                },
              },
            ];
          }
          return [];
        },
      } as ToolFunction<{
        type: string;
        explanation: string;
      }>,
    ],
  };

  return {
    baseSettings,
    aiChatSettings,
    searchSettings,
    modalSettings,
  };
};
