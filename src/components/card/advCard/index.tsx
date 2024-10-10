import classes from './index.module.less';
import { useTranslation } from 'react-i18next';
import { LanguageEnum } from '@/components/language-selector';
import CustomButton from '@/components/customButton';
import { RightTopArrowIcon } from '@/components/icons';

const DISPLAY_ADV_LANGUAGES = [LanguageEnum.CHINESE];

export default function CloudAdvertisementCard(props: {
  language: LanguageEnum;
}) {
  const { language } = props;

  const { t } = useTranslation('docs', { lng: language });

  const ctaLink =
    language === LanguageEnum.ENGLISH
      ? 'https://cloud.zilliz.com/signup?utm_source=partner&utm_medium=referral&utm_campaign=2024-09-30_display_milvus-docs_zilliz'
      : 'https://cloud.zilliz.com.cn/signup?utm_source=milvus&utm_medium=cta';
  const isDisplayAdv = DISPLAY_ADV_LANGUAGES.includes(language);

  return (
    <>
      {isDisplayAdv && (
        <div className={classes.advCardContainer}>
          <h2 className={classes.advTitle}>{t('advertise.title')}</h2>
          <p className={classes.advAbstract}>{t('advertise.content')}</p>
          <CustomButton
            href={ctaLink}
            endIcon={<RightTopArrowIcon />}
            className={classes.ctaButton}
          >
            {t('advertise.ctaLabel')}
          </CustomButton>
        </div>
      )}
    </>
  );
}
