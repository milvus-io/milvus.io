import { InkeepModalSearchAndChat as InkeepModalSearchAndChatComponent } from '@inkeep/cxkit-react';
import { useInkeepSettings } from '@/hooks/use-inkeep-settings';

export default function InkeepModalSearchAndChat({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const settings = useInkeepSettings({
    isOpen,
    onOpenChange,
  });

  return <InkeepModalSearchAndChatComponent {...settings} />;
}
