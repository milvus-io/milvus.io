import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageEnum } from '@/types/localization';
import clsx from 'clsx';

import DeepLImg from '../../../public/images/docs/deepl.png';

type Props = {
  className?: string;
  lang?: LanguageEnum;
};

export const DeepLogo: FC<Props> = ({
  className,
  lang = LanguageEnum.ENGLISH,
}) => {
  // Driven by the page's locale, not `i18n.language`: the latter is always `en`
  // on the server, so this block rendered nothing server-side and a paragraph
  // client-side — a hydration mismatch on every translated page.
  const { t } = useTranslation('docs', { lng: lang });

  if (lang === LanguageEnum.ENGLISH) {
    return null;
  }

  return (
    <p
      className={clsx(
        `flex items-center text-[#042B48] opacity-50 text-[11px] font-400`,
        className
      )}
    >
      <span className="mr-[6px]">{t('translate.by')}</span>
      <img src={DeepLImg.src} height={16} alt="DeepL" />
    </p>
  );
};
