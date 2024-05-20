import React, { useEffect, useRef } from 'react';
import milvusWhite from '../../images/milvus-icon-white.png';

const aiChatSettings = {
  chatSubjectName: 'Milvus',
  botAvatarSrcUrl:
    'https://milvus.io/icons/icon-48x48.png?v=587ea7d315fa8ebc198a8c112e054ef6',
  botAvatarDarkSrcUrl: milvusWhite,
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
    const baseSettings = {
      apiKey: process.env.GATSBY_INKEEP_API_KEY,
      integrationId: process.env.GATSBY_INKEEP_INTEGRATION_ID,
      organizationId: process.env.GATSBY_INKEEP_ORGANIZATION_ID,
      primaryBrandColor: '#4DB7EF',
      chatButtonPillText: 'Ask Milvus AI',
    };

    const loadInkeepEmbed = async () => {
      const inkeepEmbed = await import('@inkeep/widgets-embed');

      const inkeepChatButtonProps = {
        stylesheetUrls: ['/inkeep/inkeep-overrides.css'],
        chatButtonType: 'ICON_TEXT', // default. Alternatives are 'ICON_TEXT_SHORTCUT' and 'ICON'
        chatButtonBgColor: '#00a1ea',
        baseSettings: {
          ...baseSettings,
        },
        modalSettings: {
          // optional typeof InkeepModalSettings
        },
        searchSettings: {
          // optional typeof InkeepSearchSettings
        },
        aiChatSettings: {
          ...aiChatSettings,
        },
      };

      const inkeep = inkeepEmbed.Inkeep(baseSettings);

      chatButtonRef.current = inkeep.embed({
        componentType: 'ChatButton',
        properties: inkeepChatButtonProps,
      });
    };

    const inkeepPortals = document.getElementsByTagName("inkeep-portal");
    // because gatsby unmounts the Layout component when the page changes, this check makes sure to only load the chat once.
    if (!inkeepPortals.length) {
      loadInkeepEmbed();
    }
  }, []);

  return (
    null
  );
};
