import dynamic from 'next/dynamic';
import { InkeepChatButtonProps } from '@inkeep/widgets';
import { useInkeepSettings } from '@/hooks/use-inkeep-settings';

const ChatButton = dynamic(
  () => import('@inkeep/widgets').then(mod => mod.InkeepChatButton),
  {
    ssr: false,
  }
);

function InkeepChatButton() {
  const { baseSettings, aiChatSettings, searchSettings, modalSettings } =
    useInkeepSettings();

  const chatButtonProps: InkeepChatButtonProps = {
    stylesheetUrls: ['/inkeep/inkeep-overrides.css'],
    chatButtonBgColor: '#00a1ea',
    baseSettings,
    aiChatSettings,
    searchSettings,
    modalSettings,
  };

  return <ChatButton {...chatButtonProps} />;
}

export default function InkeepChatButtonContainer() {
  const displayInkeep = process.env.NEXT_PUBLIC_IS_PREVIEW === 'preview';

  console.log('inkeep key--', process.env.NEXT_PUBLIC_INKEEP_API_KEY);
  console.log(
    'test var---',
    process.env.NEXT_PUBLIC_TEST_VAR,
    process.env.NEXT_PUBLIC_TEST_VAR2
  );
  console.log('displayInkeep', process.env.NEXT_PUBLIC_IS_PREVIEW);

  return <>{displayInkeep ? <InkeepChatButton /> : null}</>;
}
