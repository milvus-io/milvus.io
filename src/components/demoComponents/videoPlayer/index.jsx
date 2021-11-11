import React, { useState } from 'react';
import * as styles from './index.module.less';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ clientWidth, videoSrc, hideVideoDialog }) => {
  const [ready, setReady] = useState(false);

  return (
    <div
      style={{
        width: `${clientWidth}px`,
        height: `${clientWidth / 2.2 + 40}px`,
        overflow: 'hidden',
      }}
      className={styles.playerContainer}
    >
      <div className={styles.closeBtnWrapper}>
        <span
          className={styles.iconWrapper}
          role="button"
          tabIndex="-1"
          onClick={hideVideoDialog}
          onKeyDown={hideVideoDialog}
        >
          <i className="fas fa-times"></i>
        </span>
      </div>
      <div className={styles.playerWrapper}>
        {!ready && <i className={`${styles.loadingIcon} fas fa-spinner`}></i>}
        <ReactPlayer
          controls={true}
          url={videoSrc}
          width={clientWidth}
          height={clientWidth / 2.2}
          onReady={() => setReady(true)}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
