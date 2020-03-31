import React, { useState } from "react";
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
        <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">
          Join the Milvus Slack channel here
        </a>
        {typeof document !== 'undefined' &&
          document.body &&
          document.body.clientWidth > 1000 &&
          "to interact with our community!"}

      </div>
    </div>
  )
}

export default Notification;
