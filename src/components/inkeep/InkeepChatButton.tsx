import dynamic from 'next/dynamic';
import { InkeepChatButtonProps } from '@inkeep/widgets';
import { useInkeepSettings } from '@/hooks/use-inkeep-settings';

const ChatButton = dynamic(
  () => import('@inkeep/widgets').then(mod => mod.InkeepChatButton),
  {
    ssr: false,
  }
);

export function InkeepChatButton() {
  const { baseSettings, aiChatSettings, searchSettings, modalSettings } =
    useInkeepSettings();

  const chatButtonProps: InkeepChatButtonProps = {
    baseSettings,
    aiChatSettings,
    searchSettings,
    modalSettings,
  };

  return <ChatButton {...chatButtonProps} />;
}
