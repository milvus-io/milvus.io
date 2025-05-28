import React, { useCallback, useState } from 'react';
import { useInkeepSettings } from '@/hooks/use-inkeep-settings';
import dynamic from 'next/dynamic';

const InkeepModalSearchAndChat = dynamic(
  () => import('@inkeep/cxkit-react').then(mod => mod.InkeepModalSearchAndChat),
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

  const settings = useInkeepSettings({
    isOpen,
    onOpenChange: handleOpenChange,
  });

  return (
    <div className="inkeep-custom-trigger-wrapper">
      <div className={props.className} onClick={handleOpen}>
        {props.children}
      </div>
      <InkeepModalSearchAndChat {...settings} />
    </div>
  );
};
