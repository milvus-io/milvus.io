import { InkeepModalChat, InkeepChatButton } from '@inkeep/cxkit-react';
import { useInkeepSettings } from '@/hooks/use-inkeep-settings';

export default function InkeepChatButtonContainer() {
  const { baseSettings, aiChatSettings, searchSettings, modalSettings } =
    useInkeepSettings({
      isOpen: false,
      onOpenChange: () => {},
    });

  const chatButtonProps = {
    baseSettings,
    aiChatSettings,
    searchSettings,
    modalSettings,
  };
  return <InkeepChatButton {...chatButtonProps} />;
}
