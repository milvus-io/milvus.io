import React from 'react';
import * as styles from './index.module.less';

const StepCard = props => {
  const { title, content, stepNum } = props;

  return (
    <div className={styles.stepCardWrapper}>
      <div className={styles.numberWrapper}>{stepNum}</div>
      <div className={styles.contentWrapper}>
        <p className="title"></p>
      </div>
    </div>
  );
};
