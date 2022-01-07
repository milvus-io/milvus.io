import React from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";
import { Helmet } from "react-helmet";
import * as styles from "./index.module.less";

const Share = (props) => {
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

      <TwitterShareButton url={url} title={quote}>
        <TwitterIcon size="30" borderRadius={50} />
      </TwitterShareButton>
      <FacebookShareButton url={url} quote={quote}>
        <FacebookIcon size="30" borderRadius={50} />
      </FacebookShareButton>
      <LinkedinShareButton url={url} title={quote}>
        <LinkedinIcon size="30" borderRadius={50} />
      </LinkedinShareButton>
    </div>
  );
};

export default Share;
