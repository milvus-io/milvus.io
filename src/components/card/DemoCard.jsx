import React from 'react';
import styles from './DemoCard.module.less';
import VideoPlayer from '../videoPlayer';
import InfoSubmitter from '../infoSubmitter';
import { useTranslation } from 'react-i18next';
import CustomButton from '@/components/customButton';

const UNIQUE_EMAIL_ID = 'UNIQUE_EMAIL_ID';

const DemoCard = ({
  href,
  videoSrc,
  cover,
  name,
  desc,
  index,
  handelOpenDialog,
  handleOpenSnackbar,
}) => {
  const { t } = useTranslation('demo');
  const submitCallback = (statusCode, unique_email_id, href) => {
    if (statusCode === 200) {
      window.localStorage.setItem(UNIQUE_EMAIL_ID, unique_email_id);
      handleOpenSnackbar({
        type: 'success',
        message: t('prompts.success'),
      });
      //
    } else {
      handleOpenSnackbar({
        type: 'warning',
        message: t('prompts.warning'),
      });
      window.localStorage.setItem(UNIQUE_EMAIL_ID, true);
    }
    window.location.href = href;
  };

  const handleWatchVideo = () => {
    const { innerWidth } = window;
    const clientWidth =
      innerWidth < 800
        ? 260
        : innerWidth < 1200
        ? innerWidth * 0.8
        : 1200 * 0.8;
    const content = () => (
      <VideoPlayer videoSrc={videoSrc} clientWidth={clientWidth} />
    );
    handelOpenDialog(content, name);
  };

  const handleSubmitEmail = () => {
    const { search } = window.location;
    const source = ['utm_source', 'utm_medium', 'utm_campaign'].every(v =>
      search.includes(v)
    )
      ? 'Ads: Reddit'
      : 'Milvus: demo';
    const isSubscribed = window.localStorage.getItem(UNIQUE_EMAIL_ID) || false;
    if (isSubscribed) {
      window.location.href = href;
      return;
    }
    const content = () => (
      <InfoSubmitter source={source} href={href} submitCb={submitCallback} />
    );
    handelOpenDialog(content, t('prompts.waiting'));
  };

  return (
    <div className={styles.demoCard}>
      <div className={styles.coverWrapper}>
        <img src={cover} alt={name} />
      </div>
      <div className={styles.contentWrapper}>
        <h3>{name}</h3>
        <p>{desc}</p>
        <div className={styles.btnGroup}>
          <CustomButton
            onClick={handleSubmitEmail}
            className={styles.tryBtn}
            variant="outlined"
          >
            Try Demo
          </CustomButton>

          {videoSrc && (
            <CustomButton
              className={styles.watchBtn}
              variant="text"
              onClick={handleWatchVideo}
              endIcon={
                <svg
                  width="14"
                  height="15"
                  viewBox="0 0 14 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.4668 6.85159C10.7334 7.05159 10.7334 7.45159 10.4668 7.65159L3.80009 12.6516C3.47047 12.8988 3.00009 12.6636 3.00009 12.2516V2.25159C3.00009 1.83956 3.47047 1.60437 3.80009 1.85159L10.4668 6.85159Z"
                    stroke="black"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              }
            >
              Watch Demo
            </CustomButton>
          )}
        </div>
      </div>
    </div>
  );
};
export default DemoCard;
