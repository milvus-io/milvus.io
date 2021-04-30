import React from 'react';
import './v2.scss';

const Notification = props => {
  const { language, locale } = props;
  // // const screenWidth = useMobileScreen();
  // const notificationLinksMap = {
  //   [version]:
  //     locale === 'en'
  //       ? `/docs/${version}/release_notes.md`
  //       : `/cn/docs/${version}/release_notes.md`,
  //   'v1.0.0':
  //     locale === 'en'
  //       ? '/docs/v1.0.0/announcement.md'
  //       : '/cn/docs/v1.0.0/announcement.md',
  // };

  return (
    <div className="notification-v2">
      <p>
        {language.v2.title}
        <a href="/docs/v1.0.0/overview.md" className="link">
          {language.v2.here}
        </a>
        &gt;
      </p>
    </div>
  );
};

export default Notification;
