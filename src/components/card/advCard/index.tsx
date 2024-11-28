import classes from './index.module.less';
import { useTranslation } from 'react-i18next';
import { LanguageEnum } from '@/components/language-selector';
import CustomButton from '@/components/customButton';
import { RightTopArrowIcon } from '@/components/icons';
import clsx from 'clsx';

const CN_CTA_LINK =
  'https://cloud.zilliz.com.cn/signup?utm_source=partner&utm_medium=referral&utm_campaign=2024-09-30_display_milvus-docs_zilliz';
const EN_CTA_LINK =
  'https://cloud.zilliz.com/signup?utm_source=partner&utm_medium=referral&utm_campaign=2024-10-17_display_manged-milvus-docs_milvusio';

export default function CloudAdvertisementCard(props: {
  language?: LanguageEnum;
  className?: string;
}) {
  const { language = LanguageEnum.ENGLISH, className = '' } = props;
  const { t } = useTranslation('docs', { lng: language });
  const isCn = language === LanguageEnum.CHINESE;
  const customButtonLink = isCn ? CN_CTA_LINK : EN_CTA_LINK;

  return (
    <div className={clsx(classes.advCardContainer, className)}>
      <h2 className={classes.advTitle}>{t('advertise.title')}</h2>
      <p className={classes.advAbstract}>{t('advertise.content')}</p>
      <CustomButton
        href={customButtonLink}
        endIcon={<RightTopArrowIcon />}
        className={classes.ctaButton}
      >
        {t('advertise.ctaLabel')}
      </CustomButton>
    </div>
  );
}
