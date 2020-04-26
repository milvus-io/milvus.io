import React from "react";
import "./index.scss";

// let timer = null;
const Notification = (props) => {
  const { version } = props;
  // const [showSlack, setShowSlack] = useState(false);
  // // useEffect(() => {
  // //   if (timer) return;
  // //   timer = setInterval(() => {
  // //     setShowSlack((v) => !v);
  // //   }, 3000);
  // //   return () => {
  // //     clearInterval(timer);
  // //   };
  // // }, []);
  return (
    <div className="notification">
      <marquee text="swetha">
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

        <span>
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
      </marquee>
    </div>
  );
};

export default Notification;
