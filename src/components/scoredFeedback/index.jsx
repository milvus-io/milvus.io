import React, { useState, useEffect } from 'react';
import { globalHistory } from '@reach/router';
import { readStatisData, writeStatisData } from '../../http/http';
import * as styles from './index.module.less';

const FEEDBACK_INFO = 'feedback_info';

const ScoredFeedback = ({ old, feedbackText }) => {
  const { pathname } = globalHistory.location;

  const [feedback, setFeedback] = useState('');
  const [isFeedback, setIsFeedback] = useState(true);

  const handleUpdateStatisData = async value => {
    const { statistic, sha } = await readStatisData();
    const info = statistic[value];

    const pathnameCount = statistic[value][pathname];
    const content = pathnameCount
      ? { ...statistic, [value]: { ...info, [pathname]: pathnameCount + 1 } }
      : { ...statistic, [value]: { ...info, [pathname]: 1 } };

    writeStatisData({
      sha,
      content: window.btoa(JSON.stringify(content)),
      message: 'update statistic data',
    });
  };

  const handleFeedback = val => {
    const feedbackInfoString = window.localStorage.getItem(FEEDBACK_INFO);
    try {
      const feedbackInfo = feedbackInfoString
        ? JSON.parse(feedbackInfoString)
        : [];

      feedbackInfo.push({
        md_id: old,
        feedback: val,
      });

      setTimeout(() => {
        setIsFeedback(true);
      }, 3000);

      // window.localStorage.setItem(FEEDBACK_INFO, JSON.stringify(feedbackInfo));
      setFeedback(val);
      handleUpdateStatisData(val);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      // make sure whether this doc has been feedbacked
      const feedbackInfoString = window.localStorage.getItem(FEEDBACK_INFO);
      const feedbackInfo = feedbackInfoString
        ? JSON.parse(feedbackInfoString)
        : [];

      const isFeedback = feedbackInfo.some(item => item.md_id === old);
      setIsFeedback(isFeedback);
    } catch (error) {
      console.log(error);
    }
  }, [old]);

  return (
    <div
      className={`${styles.feedbackWrapper} ${isFeedback ? styles.hide : ''}`}
    >
      <div
        className={`${styles.feedbackOptions} ${
          feedback !== '' ? styles.hideOptions : ''
        }`}
      >
        <span className={`${styles.text}`}>{feedbackText.text1}</span>
        <span
          className={`${styles.iconWrapper} ${styles.hoverLike}`}
          role="button"
          tabIndex={0}
          onClick={() => handleFeedback('like')}
          onKeyDown={() => handleFeedback('like')}
        >
          <i className="fas fa-thumbs-up"></i>
        </span>
        <span
          className={`${styles.iconWrapper} ${styles.hoverDislike}`}
          role="button"
          tabIndex={0}
          onClick={() => handleFeedback('dislike')}
          onKeyDown={() => handleFeedback('dislike')}
        >
          <i className="fas fa-thumbs-down"></i>
        </span>
      </div>

      <div
        className={`${styles.islikeWrapper} ${
          feedback !== '' ? styles.active : ''
        }`}
      >
        {feedback === 'like' ? (
          <span className={`${styles.iconWrapper} ${styles.like}`}>
            <i className="fas fa-thumbs-up"></i>
          </span>
        ) : (
          <span className={`${styles.iconWrapper} ${styles.dislike}`}>
            <i className="fas fa-thumbs-down"></i>
          </span>
        )}
        <span className={`${styles.text}`}>{feedbackText.text2}</span>
      </div>
    </div>
  );
};

export default ScoredFeedback;
