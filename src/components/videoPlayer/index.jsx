import React, { useState } from 'react';
import * as styles from './index.module.css';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ videoSrc }) => {
  const [ready, setReady] = useState(false);

  return (
    <div className={styles.playerContainer}>
      <div className={styles.playerWrapper}>
        {!ready && (
          <span className={`${styles.loadingIcon} fas fa-spinner`}></span>
        )}
        <ReactPlayer
          controls={true}
          url={videoSrc}
          width="100%"
          height="100%"
          onReady={() => setReady(true)}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
