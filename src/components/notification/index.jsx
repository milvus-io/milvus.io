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
          Join the Milvus Slack channel here to interact with our community!
        </a>
        {/* {typeof document !== 'undefined' &&
          document.body &&
          document.body.clientWidth > 1000 &&
          "to interact with our community!"}
        <svg
          className="close-notification-btn"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          onClick={closeState}
        >
          <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
        </svg> */}
      </div>
    </div>
  )
}

export default Notification;
