import React from 'react';
import './v2.scss';

const Notification = props => {
  const { language } = props;

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
