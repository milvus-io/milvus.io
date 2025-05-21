import React, { useCallback, useState } from 'react';
import { useInkeepSettings } from '@/hooks/use-inkeep-settings';
import { InkeepModalSearchAndChat } from '@inkeep/cxkit-react';

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const InkeepCustomTriggerWrapper: React.FC<Props> = props => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const settings = useInkeepSettings({
    isOpen,
    onOpenChange: handleOpen,
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
