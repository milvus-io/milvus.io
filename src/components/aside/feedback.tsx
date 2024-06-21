import styles from './index.module.less';
import { ThumbUpIcon, ThumbDownIcon } from '../icons';
import type { DialogPropsType } from './index';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Typography, InputLabel } from '@mui/material';

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
}) {
  const { t } = useTranslation('docs');
  const { handleUpdateDialog } = props;

  const commentString = useRef<string>('');
  const [feedbackStatus, setFeedbackStatus] = useState({
    like: false,
    dislike: false,
  });

  const updateComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    commentString.current = e.target.value;
  };

  const handleLike = () => {
    const data = {
      like: true,
      comment: '',
    };
    setFeedbackStatus(v => ({
      ...v,
      like: true,
    }));
    window.dataLayer = window.dataLayer || [];
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
    let data = {
      like: false,
      comment: '',
    };

    if (withComment) {
      data.comment = commentString.current;
    }

    window.dataLayer = window.dataLayer || [];
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
    setFeedbackStatus(v => ({
      ...v,
      dislike: true,
    }));

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

  return (
    <div className={styles.feedbackWrapper}>
      <h4 className={styles.feedbackTitle}>{t('feedback.title')}</h4>
      <p className={styles.feedbackDesc}>{t('feedback.prompt')}</p>

      <div className={styles.feedbackBtnsWrapper}>
        <button
          className={styles.feedbackBtn}
          onClick={handleLike}
          disabled={feedbackStatus.like}
        >
          <ThumbUpIcon />
        </button>
        <button
          className={styles.feedbackBtn}
          onClick={e => {
            handleDisLike(e);
          }}
          disabled={feedbackStatus.dislike}
        >
          <ThumbDownIcon />
        </button>
      </div>
    </div>
  );
}
