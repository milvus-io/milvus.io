import React, { useState, useEffect } from "react";
import "./index.scss";

let timer = null
const Notification = props => {
  const { version } = props
  const [showSlack, setShowSlack] = useState(true)
  useEffect(() => {
    if (timer) return
    timer = setInterval(() => {
      setShowSlack(v => !v)
    }, 15000)
    return (() => {
      clearInterval(timer)
    })
  }, [])
  return (
    <div className="notification">
      <div className={`wrapper ${!showSlack && "slack-hide"}`}>
        <span role="img" aria-label="" aria-labelledby="">
          👋
        </span>
        <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ"
          target="_blank"
          rel="noopener noreferrer"
        >
          Join the Milvus Slack channel here
        </a>
        {typeof document !== "undefined" &&
          document.body &&
          document.body.clientWidth > 1000 &&
          "to interact with our community!"}
      </div>
      <div className={`wrapper version ${!showSlack && "version-show"}`}>
        <span role="img" aria-label="" aria-labelledby="">
          👋
        </span>
        <a href={`/docs/${version}/releases/release_notes.md`}>
          Version {version} is now available!
        </a>
        {typeof document !== "undefined" &&
          document.body &&
          document.body.clientWidth > 1000 &&
          "Read about the new features and fixes."}
      </div>
    </div>
  );
};

export default Notification;
