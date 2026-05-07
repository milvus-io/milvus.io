import React, { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';

const InkeepModalSearchAndChat = dynamic(
  () => import('./InkeepModalSearchAndChat'),
  {
    ssr: false,
  }
);

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const InkeepCustomTriggerWrapper: React.FC<Props> = props => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <div className="inkeep-custom-trigger-wrapper">
      <div className={props.className} onClick={handleOpen}>
        {props.children}
      </div>
      {isOpen ? (
        <InkeepModalSearchAndChat
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
        />
      ) : null}
    </div>
  );
};
