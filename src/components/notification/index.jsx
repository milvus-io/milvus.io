import React from "react";
import "./index.scss";
import Marquee, { Motion, randomIntFromInterval } from "react-marquee-slider";

const Notification = (props) => {
  const { version } = props;

  return (
    <div className="notification">
      <Marquee velocity={80} >
        <span style={{ marginRight: "400px" }}>
          <span role="img" aria-label="" aria-labelledby="">
            👋
          </span>
          <a href={`/docs/${version}/releases/release_notes.md`}>
            Version {version} is now available!{" "}
            {typeof document !== "undefined" &&
              document.body &&
              document.body.clientWidth > 1000 &&
              "Read about the new features and fixes."}
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
            Join the Milvus Slack channel here{" "}
            {typeof document !== "undefined" &&
              document.body &&
              document.body.clientWidth > 1000 &&
              "to interact with our community!"}
          </a>
        </span>
      </Marquee>


    </div>
  );
};

export default Notification;
