import dynamic from 'next/dynamic';
import classes from '@/styles/inkeepButton.module.css';
import { useState } from 'react';

const InkeepModalChat = dynamic(() => import('./InkeepModalChat'), {
  ssr: false,
});

export default function InkeepChatButtonContainer() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };
  return (
    <>
      <button
        className={classes.inkeepChatButton}
        id="inkeep-chat-button"
        onClick={handleOpen}
        aria-label="Ask AI chat"
      >
        Ask AI
        <img
          src="/inkeep/milvus-icon-white.png"
          alt="Ask AI"
          width={24}
          height={24}
        />
      </button>
      {isOpen ? (
        <InkeepModalChat isOpen={isOpen} onOpenChange={handleOpenChange} />
      ) : null}
    </>
  );
}
