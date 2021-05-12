import React from 'react';
import * as styles from './v2.module.less';

const Notification = props => {
  const { language } = props;

  return (
    <div className={styles.notificationV2}>
      <p>
        {language.v2.title}
        <a href="/v2" className={styles.link}>
          {language.v2.here}
        </a>
        &gt;
      </p>
    </div>
  );
};

export default Notification;
