import React, { useState, useEffect } from 'react';
import { globalHistory } from '@reach/router';
import { readStatisData, writeStatisData } from '../../http/http';
import { LikeSvg } from './svgComponent';
import { DislikeSvg } from './svgComponent';
import * as styles from './index.module.less';

const FEEDBACK_INFO = 'feedback_info';
let feedbackInfo = {};

const ScoredFeedback = ({ old, feedbackText }) => {
  const { pathname } = globalHistory.location;

  const [feedback, setFeedback] = useState('');
  const [isShowOption, setIsShowOption] = useState(true);

  const handleUpdateStatisData = async value => {
    const { statistic, sha } = await readStatisData();
    const info = statistic[value];

    const pathnameCount = pathname in info ? info[pathname] + 1 : 1;
    const content = {
      ...statistic,
      [value]: { ...info, [pathname]: pathnameCount },
    };

    writeStatisData({
      sha,
      content: window.btoa(JSON.stringify(content)),
      message: 'update statistic data',
    });
  };

  const handleFeedback = val => {
    if (val === feedback) {
      return;
    }
    // feedbackInfo: {'a-path': 'like','b-path':'dislike'}
    Object.assign(feedbackInfo, { [old]: val });

    setIsShowOption(false);
    setTimeout(() => {
      setIsShowOption(true);
    }, 3000);
    window.localStorage.setItem(FEEDBACK_INFO, JSON.stringify(feedbackInfo));
    setFeedback(val);
    handleUpdateStatisData(val);
  };

  useEffect(() => {
    try {
      // make sure whether this doc has been feedbacked
      const feedbackInfoString = window.localStorage.getItem(FEEDBACK_INFO);
      feedbackInfo = feedbackInfoString ? JSON.parse(feedbackInfoString) : {};
      const feedbackDetail = feedbackInfo[old];
      if (feedbackDetail) {
        setFeedback(feedbackDetail);
      }
    } catch (error) {
      console.log(error);
    }
  }, [old]);

  return (
    <div className={styles.feedbackWrapper}>
      <div
        className={`${styles.feedbackOptions} ${
          !isShowOption ? styles.hideOption : ''
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
          <LikeSvg color={feedback === 'like' ? '#4fc4f9' : '#545454'} />
        </span>
        <span
          className={`${styles.iconWrapper} ${styles.hoverDislike}`}
          role="button"
          tabIndex={0}
          onClick={() => handleFeedback('dislike')}
          onKeyDown={() => handleFeedback('dislike')}
        >
          <DislikeSvg color={feedback === 'dislike' ? '#f25c05' : '#445454'} />
        </span>
      </div>

      <div
        className={`${styles.islikeWrapper} ${
          !isShowOption ? styles.showResult : ''
        }`}
      >
        {feedback === 'like' ? (
          <span className={`${styles.iconWrapper} ${styles.like}`}>
            <LikeSvg />
          </span>
        ) : (
          <span className={`${styles.iconWrapper} ${styles.dislike}`}>
            <DislikeSvg />
          </span>
        )}
        <span className={`${styles.text}`}>{feedbackText.text2}</span>
      </div>
    </div>
  );
};

export default ScoredFeedback;
