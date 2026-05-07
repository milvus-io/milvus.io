import { InkeepModalChat as InkeepModalChatComponent } from '@inkeep/cxkit-react';
import { useInkeepSettings } from '@/hooks/use-inkeep-settings';

export default function InkeepModalChat({
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

  return <InkeepModalChatComponent {...settings} />;
}
