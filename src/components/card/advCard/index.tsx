import classes from './index.module.less';
import { useTranslation } from 'react-i18next';
import { LanguageEnum } from '@/components/language-selector';
import CustomButton from '@/components/customButton';
import { RightTopArrowIcon } from '@/components/icons';
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

const CN_CTA_LINK =
  'https://cloud.zilliz.com/signup?utm_source=partner&utm_medium=referral&utm_campaign=2024-09-30_display_milvus-docs_zilliz';

const MANAGE_MILVUS_CTA_LINK =
  'https://cloud.zilliz.com/signup?utm_source=partner&utm_medium=referral&utm_campaign=2024-10-17_display_manged-milvus-docs_milvusio';
const CLOUD_UTM_CTA_LINK =
  'https://cloud.zilliz.com/signup?utm_source=partner&utm_medium=referral&utm_campaign=2024-10-17_display_zilliz-milvus-docs_milvusio';

export default function CloudAdvertisementCard(props: {
  language?: LanguageEnum;
  className?: string;
}) {
  const { language = LanguageEnum.ENGLISH, className = '' } = props;
  const { t } = useTranslation('docs', { lng: language });
  const isCnAdv = language === LanguageEnum.CHINESE;

  const [random, setRandom] = useState(Math.random());

  const { enTitle, enCtaLink } = useMemo(() => {
    const manageMilvusTitle = t('advertise.titleA');
    const tryCloudTitle = t('advertise.titleB');
    const title = random > 0.5 ? manageMilvusTitle : tryCloudTitle;
    const ctaLink = random > 0.5 ? MANAGE_MILVUS_CTA_LINK : CLOUD_UTM_CTA_LINK;
    return {
      enTitle: title,
      enCtaLink: ctaLink,
    };
  }, [random]);

  useEffect(() => {
    const randomValue = Number(
      window.localStorage.getItem('A_B_TEST_RANDOM') ?? NaN
    );

    if (isNaN(randomValue)) {
      window.localStorage.setItem('A_B_TEST_RANDOM', `${random}`);
      return;
    }
    setRandom(randomValue);
  }, []);

  return (
    <>
      {isCnAdv ? (
        <div className={clsx(classes.advCardContainer, className)}>
          <h2 className={classes.advTitle}>{t('advertise.title')}</h2>
          <p className={classes.advAbstract}>{t('advertise.content')}</p>
          <CustomButton
            href={CN_CTA_LINK}
            endIcon={<RightTopArrowIcon />}
            className={classes.ctaButton}
          >
            {t('advertise.ctaLabel')}
          </CustomButton>
        </div>
      ) : (
        <div className={clsx(classes.advCardContainer, className)}>
          <h2 className={classes.advTitle}>{enTitle}</h2>
          <p className={classes.advAbstract}>{t('advertise.content')}</p>
          <CustomButton
            href={enCtaLink}
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
