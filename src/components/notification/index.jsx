import React from 'react';
import * as styles from './index.module.less';

const Notification = props => {
  const { version, language, locale } = props;
  const notificationLinksMap = {
    [version]:
      locale === 'en'
        ? `/docs/${version}/release_notes.md`
        : `/cn/docs/${version}/release_notes.md`,
    'v1.0.0':
      locale === 'en'
        ? '/docs/v1.0.0/announcement.md'
        : '/cn/docs/v1.0.0/announcement.md',
  };

  return (
    <div className={styles.notification}>
      <span>
        <span role="img" aria-label="" aria-labelledby="">
          👋
        </span>
        <a href={`${notificationLinksMap[version]}`}>
          {language.version} {version} {language.available}{' '}
          {typeof document !== 'undefined' &&
            document.body &&
            document.body.clientWidth > 1000 &&
            language.more}
        </a>
      </span>
    </div>
  );
};

export default Notification;
