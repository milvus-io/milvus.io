import styles from './index.module.less';
import { ThumbUpIcon, ThumbDownIcon } from '../icons';
import type { DialogPropsType } from './index';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Typography, InputLabel } from '@mui/material';
import { useRouter } from 'next/router';
import { LanguageEnum } from '@/types/localization';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const FeedbackComment: React.FC<{
  onUpdateComment: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ onUpdateComment }) => {
  const { t } = useTranslation('docs');
  return (
    <div>
      <Typography
        classes={{
          root: styles.dialogSubTitle,
        }}
      >
        {t('feedback.comment.desc')}
      </Typography>
      <InputLabel
        id="extra-comment-label"
        classes={{
          root: styles.inputLabel,
        }}
      >
        {t('feedback.comment.inputLabel')}
      </InputLabel>
      <TextField
        id="extra-comment"
        multiline
        rows={4}
        fullWidth
        classes={{
          root: styles.customInputField,
        }}
        onChange={onUpdateComment}
      />
    </div>
  );
};

export default function FeedbackSection(props: {
  handleUpdateDialog: (params: DialogPropsType) => void;
  lang?: LanguageEnum;
}) {
  const { asPath } = useRouter();
  const { handleUpdateDialog, lang = LanguageEnum.ENGLISH } = props;
  const { t } = useTranslation('docs', { lng: lang });

  const commentString = useRef<string>('');
  const [feedbackStatus, setFeedbackStatus] = useState(false);

  const updateComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    commentString.current = e.target.value;
  };

  const handleLike = () => {
    window.dataLayer = window.dataLayer || [];
    const location = window.location.href;
    const data = {
      like: true,
      comment: '',
      location,
    };
    setFeedbackStatus(true);

    window.dataLayer.push({
      event: 'milvus_doc_feedback',
      feedback: JSON.stringify(data),
      feedback_time: Date.now(),
    });
  };

  const handleSendDislike = (
    e: React.MouseEvent<HTMLButtonElement>,
    withComment: boolean
  ) => {
    window.dataLayer = window.dataLayer || [];
    const location = window.location.href;
    let data = {
      like: false,
      comment: '',
      location,
    };

    if (withComment) {
      data.comment = commentString.current;
    }

    window.dataLayer.push({
      event: 'milvus_doc_feedback',
      feedback: JSON.stringify(data),
      feedback_time: Date.now(),
    });
    handleUpdateDialog({
      open: false,
      children: <></>,
      title: '',
      actions: undefined,
    });
  };

  const handleDisLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    setFeedbackStatus(true);

    handleUpdateDialog({
      open: true,
      title: t('feedback.comment.title'),
      children: <FeedbackComment onUpdateComment={updateComment} />,
      actions: (
        <>
          <button
            onClick={e => {
              handleSendDislike(e, false);
            }}
          >
            {t('feedback.comment.cancel')}
          </button>
          <button
            onClick={e => {
              handleSendDislike(e, true);
            }}
          >
            {t('feedback.comment.send')}
          </button>
        </>
      ),
    });
  };

  useEffect(() => {
    // reset feedback status when route changes
    setFeedbackStatus(false);
  }, [asPath]);

  return (
    <div className={styles.feedbackWrapper}>
      <h5 className={styles.feedbackTitle}>{t('feedback.title')}</h5>
      {feedbackStatus ? (
        <p className={styles.thanks}>{t('feedback.thanks')}</p>
      ) : (
        <>
          <p className={styles.feedbackDesc}>{t('feedback.prompt')}</p>

          <div className={styles.feedbackBtnsWrapper}>
            <button
              className={styles.feedbackBtn}
              onClick={handleLike}
              disabled={feedbackStatus}
            >
              <ThumbUpIcon />
            </button>
            <button
              className={styles.feedbackBtn}
              onClick={e => {
                handleDisLike(e);
              }}
              disabled={feedbackStatus}
            >
              <ThumbDownIcon />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
