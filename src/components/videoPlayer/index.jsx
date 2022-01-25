import React, { useState } from 'react';
import * as styles from './index.module.less';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ clientWidth, videoSrc }) => {
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
      <div className={styles.playerWrapper}>
        {!ready && <span className={`${styles.loadingIcon} fas fa-spinner`}></span>}
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
