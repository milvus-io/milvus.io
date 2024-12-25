import React, { useState } from 'react';
import { useInkeepSettings } from '@/hooks/use-inkeep-settings';
import dynamic from 'next/dynamic';

interface Props {
  className?: string;
  children: React.ReactNode;
}

const Trigger = dynamic(
  () => import('@inkeep/widgets').then(mod => mod.InkeepCustomTrigger),
  {
    ssr: false,
  }
);

export const InkeepCustomTriggerWrapper: React.FC<Props> = props => {
  const [isOpen, setIsOpen] = useState(false);
  const settings = useInkeepSettings();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <div className="inkeep-custom-trigger-wrapper">
      <div className={props.className} onClick={handleOpen}>
        {props.children}
      </div>
      <Trigger
        {...settings}
        stylesheetUrls={['/inkeep/inkeep-overrides.css']}
        isOpen={isOpen}
        onClose={handleClose}
      />
    </div>
  );
};
