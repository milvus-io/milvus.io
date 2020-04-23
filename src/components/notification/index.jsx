import React from "react";
import "./index.scss";

const Notification = props => {
  // const [state, setState] = useState(true);
  // const closeState = () => {
  //   setState(false);
  // };
  return (
    <div className="notification">
      <div className="wrapper">
        <span role="img" aria-label="" aria-labelledby="">
          👋
        </span>
        <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">
          Join the Milvus Slack channel here
        </a>
        {typeof document !== "undefined" &&
          document.body &&
          document.body.clientWidth > 1000 &&
          "to interact with our community!"}
      </div>
    </div>
  );
};

export default Notification;
