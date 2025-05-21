import { InkeepModalChat } from '@inkeep/cxkit-react';
import { useInkeepSettings } from '@/hooks/use-inkeep-settings';

function InkeepChatButton() {
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

  return <InkeepModalChat {...chatButtonProps} />;
}

export default function InkeepChatButtonContainer() {
  return <InkeepChatButton />;
}
