import React from 'react';
import './index.scss';

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
    <div className="notification">
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
      {/* <Marquee velocity={screenWidth > 1000 ? 60 : 20}>
        <span style={{ marginRight: "400px" }}>
          <span role="img" aria-label="" aria-labelledby="">
            👋
          </span>
          <a href={`/docs/${version}/release_notes.md`}>
            {language.version} {version} {language.available}{" "}
            {typeof document !== "undefined" &&
              document.body &&
              document.body.clientWidth > 1000 &&
              language.more}
          </a>
        </span>

        <span style={{ marginRight: "400px" }}>
          <span role="img" aria-label="" aria-labelledby="">
            👋
          </span>
          <a
            href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ"
            target="_blank"
            rel="noopener noreferrer"
          >
            {language.join}{" "}
            {typeof document !== "undefined" &&
              document.body &&
              document.body.clientWidth > 1000 &&
              language.interact}
          </a>
        </span>
      </Marquee> */}
    </div>
  );
};

export default Notification;
