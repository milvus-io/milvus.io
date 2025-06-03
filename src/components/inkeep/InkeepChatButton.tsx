import { useInkeepSettings } from '@/hooks/use-inkeep-settings';
import dynamic from 'next/dynamic';
import classes from '@/styles/inkeepButton.module.less';
import { useState } from 'react';
import { useCallback } from 'react';

const InkeepModalChat = dynamic(
  () => import('@inkeep/cxkit-react').then(mod => mod.InkeepModalChat),
  {
    ssr: false,
  }
);

export default function InkeepChatButtonContainer() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };
  const { baseSettings, aiChatSettings, searchSettings, modalSettings } =
    useInkeepSettings({
      isOpen: isOpen,
      onOpenChange: handleOpenChange,
    });

  const chatButtonProps = {
    baseSettings,
    aiChatSettings,
    searchSettings,
    modalSettings,
  };
  return (
    <>
      <button className={classes.inkeepChatButton} onClick={handleOpen}>
        Ask AI
        <img src="/inkeep/milvus-icon-white.png" alt="" />
      </button>
      <InkeepModalChat {...chatButtonProps} />
    </>
  );
}
