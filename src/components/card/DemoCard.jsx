import React from "react";
import * as styles from "./DemoCard.module.less";
import VideoPlayer from "../videoPlayer";
import InfoSubmitter from "../infoSubmitter";
import { useWindowSize } from "../../http/hooks";

const UNIQUE_EMAIL_ID = "UNIQUE_EMAIL_ID";

const DemoCard = ({
  href,
  videoSrc,
  cover,
  name,
  desc,
  index,
  handelOpenDialog,
  handleOpenSnackbar,
}) => {
  const currentSize = useWindowSize();

  const isMobile = ["phone", "tablet"].includes(currentSize);

  const submitCallback = (statusCode, unique_email_id, href) => {
    if (statusCode === 200) {
      window.localStorage.setItem(UNIQUE_EMAIL_ID, unique_email_id);
      handleOpenSnackbar({
        type: "success",
        message: "Thank you, you have been added to our mailing list!",
      });
      //
    } else {
      handleOpenSnackbar({
        type: "warning",
        message: "This email is already subscribed!",
      });
      window.localStorage.setItem(UNIQUE_EMAIL_ID, true);
    }
    window.location.href = href;
  };

  const handleWatchVideo = () => {
    const { innerWidth } = window;
    const clientWidth =
      innerWidth < 800
        ? 260
        : innerWidth < 1200
        ? innerWidth * 0.8
        : 1200 * 0.8;
    const content = () => (
      <VideoPlayer videoSrc={videoSrc} clientWidth={clientWidth} />
    );
    handelOpenDialog(content, name);
  };

  const handleSubmitEmail = () => {
    const { search } = window.location;
    const source = ["utm_source", "utm_medium", "utm_campaign"].every((v) =>
      search.includes(v)
    )
      ? "Ads：Reddit"
      : "Milvus：demo";

    const content = () => (
      <InfoSubmitter source={source} href={href} submitCb={submitCallback} />
    );
    handelOpenDialog(content, "Before you go...");
  };

  return (
    <div className={styles.demoCard}>
      {index % 2 !== 0 && !isMobile ? (
        <>
          <div className={styles.contentWrapper}>
            <h3>{name}</h3>
            <p>{desc}</p>
            <div className={styles.btnGroup}>
              <button
                className={`customButton containedBtn ${styles.tryBtn}`}
                onClick={handleSubmitEmail}
              >
                Try Demo
              </button>

              <button
                className={`customButton textBtn ${styles.watchBtn}`}
                onClick={handleWatchVideo}
              >
                Watch Demo
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="m10 16.5 6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                    fill="white"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div className={styles.coverWrapper}>
            <img src={cover} alt={name} />
          </div>
        </>
      ) : (
        <>
          <div className={styles.coverWrapper}>
            <img src={cover} alt={name} />
          </div>
          <div className={styles.contentWrapper}>
            <h3>{name}</h3>
            <p>{desc}</p>
            <div className={styles.btnGroup}>
              <button
                className={`customButton containedBtn ${styles.tryBtn}`}
                onClick={handleSubmitEmail}
              >
                Try Demo
              </button>

              <button
                className={`customButton textBtn ${styles.watchBtn}`}
                onClick={handleWatchVideo}
              >
                Watch Demo
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="m10 16.5 6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                    fill="white"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default DemoCard;
