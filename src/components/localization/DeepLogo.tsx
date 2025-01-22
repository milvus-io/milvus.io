import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageEnum } from '@/types/localization';
import clsx from 'clsx';

import DeepLImg from '../../../public/images/docs/deepl.png';

type Props = {
  className?: string;
};

export const DeepLogo: FC<Props> = ({ className }) => {
  const { t, i18n } = useTranslation('docs');

  if (i18n.language === LanguageEnum.ENGLISH) {
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
