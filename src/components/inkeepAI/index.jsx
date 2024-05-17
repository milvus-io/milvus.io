import React, { useEffect, useRef } from 'react';

const baseSettings = {
  apiKey: '93b596da0a7c5f8311c1f9b203d679608c1c49b583717223',
  integrationId: 'clw8uf5c1000qtf8xz54n0202',
  organizationId: 'org_65QNdLOXbmjSjta4',
  primaryBrandColor: '#4DB7EF',
  chatButtonPillText: 'Ask Milvus AI',
};
const aiChatSettings = {
  chatSubjectName: 'Milvus',
  botAvatarSrcUrl:
    'https://milvus.io/icons/icon-48x48.png?v=587ea7d315fa8ebc198a8c112e054ef6',
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

export const ChatButton = () => {
  const chatButtonRef = useRef(null);

  useEffect(() => {
    const loadInkeepEmbed = async () => {
      const inkeepEmbed = await import('@inkeep/widgets-embed');

      const inkeepChatButtonProps = {
        chatButtonType: 'ICON_TEXT', // default. Alternatives are 'ICON_TEXT_SHORTCUT' and 'ICON'
        baseSettings: {
          ...baseSettings,
        },
        modalSettings: {
          // optional typeof InkeepModalSettings
        },
        searchSettings: {
          // optional typeof InkeepSearchSettings
        },
        aiChatSettings: aiChatSettings,
      };

      const inkeep = inkeepEmbed.Inkeep(baseSettings);

      chatButtonRef.current = inkeep.embed({
        componentType: 'ChatButton',
        targetElement: '#chat-button',
        properties: inkeepChatButtonProps,
      });
    };

    loadInkeepEmbed();
  }, []);

  return <div id="chat-button"></div>;
};
