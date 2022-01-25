import React from "react";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share";
import { Helmet } from "react-helmet";
import * as styles from "./index.module.less";
import twitterIcon from "../../images/blog/twitter.svg";
import linkedinIcon from "../../images/blog/linkedin.svg";
import facebookIcon from "../../images/blog/facebook.svg";

const Share = props => {
  const { url, quote, desc, image, wrapperClass, vertical = false } = props;

  return (
    <div
      className={`${wrapperClass} ${styles.share}`}
      style={{ flexDirection: vertical ? "column" : "row" }}
    >
      <Helmet>
        <meta name="description" content={desc} />

        <meta property="og:title" content={quote}></meta>
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={quote} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={image} />
      </Helmet>
      <LinkedinShareButton url={url} title={quote}>
        <img src={linkedinIcon} alt="twitter" className={styles.icon} />
      </LinkedinShareButton>
      <TwitterShareButton url={url} title={quote}>
        <img src={twitterIcon} alt="twitter" className={styles.icon} />
      </TwitterShareButton>
      <FacebookShareButton url={url} quote={quote}>
        <img src={facebookIcon} alt="twitter" className={styles.icon} />
      </FacebookShareButton>
    </div>
  );
};

export default Share;
