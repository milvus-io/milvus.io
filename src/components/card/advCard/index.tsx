import classes from './index.module.less';
import { useTranslation } from 'react-i18next';
import { LanguageEnum } from '@/types/localization';
import CustomButton from '@/components/customButton';
import { RightTopArrowIcon } from '@/components/icons';
import { use, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import useUtmTrackPath from '@/hooks/use-utm-track-path';
import { CLOUD_SIGNUP_LINK, CN_CLOUD_SIGNUP_LINK } from '@/consts';

export default function CloudAdvertisementCard(props: {
  language?: LanguageEnum;
  className?: string;
  customAdvConfig?: {
    advTitle: string;
    advContent: string;
    advCtaLabel: string;
    advCtaLink: string;
  };
}) {
  const {
    language = LanguageEnum.ENGLISH,
    className = '',
    customAdvConfig,
  } = props;
  const { t } = useTranslation('docs', { lng: language });
  const isCnAdv = language === LanguageEnum.CHINESE;

  const trackPath = useUtmTrackPath();
  const [random, setRandom] = useState(Math.random());
  const { advTitle, advContent, advCtaLabel, advCtaLink } =
    customAdvConfig || {};

  const { enTitle, enCtaLink, ctaLabel, advertiseContent } = useMemo(() => {
    const title = advTitle || t('advertise.titleA');
    const ctaLink =
      advCtaLink ||
      `${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=milvus_right_card&utm_content=${trackPath}`;
    const ctaLabel = advCtaLabel || t('advertise.ctaLabel');
    const advertiseContent = advContent || t('advertise.content');
    return {
      enTitle: title,
      enCtaLink: ctaLink,
      advertiseContent,
      ctaLabel,
    };
  }, [random, advTitle, advContent, advCtaLabel, advCtaLink, t, trackPath]);

  const cnCloudLink = useMemo(() => {
    return `${CN_CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=milvus_right_card&utm_content=${trackPath}`;
  }, [trackPath]);

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

  const renderZillizLogo = () => {
    return (
      <div
        className={classes.logo}
        style={{ backgroundImage: `url(/images/home/zilliz-logo.png)` }}
      />
    );
  };

  return (
    <>
      {isCnAdv ? (
        <div className={clsx(classes.advCardContainer, className)}>
          {renderZillizLogo()}
          <h2 className={classes.advTitle}>{t('advertise.title')}</h2>
          <p className={classes.advAbstract}>{t('advertise.content')}</p>
          <CustomButton
            href={cnCloudLink}
            endIcon={<RightTopArrowIcon />}
            className={classes.ctaButton}
          >
            {t('advertise.ctaLabel')}
          </CustomButton>
        </div>
      ) : (
        <div className={clsx(classes.advCardContainer, className)}>
          {renderZillizLogo()}
          <h2 className={classes.advTitle}>{enTitle}</h2>
          <p className={classes.advAbstract}>{advertiseContent}</p>
          <CustomButton
            href={enCtaLink}
            endIcon={<RightTopArrowIcon />}
            className={classes.ctaButton}
          >
            {ctaLabel}
          </CustomButton>
        </div>
      )}
    </>
  );
}
