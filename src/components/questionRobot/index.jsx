import React, { useEffect, useState, useRef } from "react";
import * as styles from "./index.module.less";
import milvus from "../../images/milvus_logo.svg";
import { getFaq } from "../../http";
import WelcomBlock from "./welcomBlock";
import AnswerBlock from "./answerBlock";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import SvgIcon from "@mui/material/SvgIcon";

const BirdIcon = props => {
  return (
    <SvgIcon
      viewBox="0 0 80 80"
      // style={{ width: "64px", height: "64px", fill: "white" }}
      {...props}
    >
      <g clip-path="url(#clip0_1254_2064)">
        <rect width="80" height="80" rx="40" fill="#4FC4F9" />
        <path
          d="M69.2905 82.6433L84.2522 74.0224L78.5479 82.407L85.25 89.6409L69.2905 82.6433Z"
          fill="black"
        />
        <path
          d="M45.0062 74.5016C44.748 75.2685 44.5317 76.0489 44.3582 76.8394C44.1768 77.6186 44.0291 78.3978 43.8995 79.1771C43.6455 80.7355 43.4624 82.2879 43.3501 83.8343C43.1285 86.9364 43.1389 90.0508 43.3812 93.1514L44.2364 91.715C43.6118 92.115 43.0002 92.541 42.3912 92.9643L41.4867 93.6241L40.5951 94.3046C40.0068 94.7748 39.4237 95.2475 38.8561 95.754C38.2777 96.2611 37.7258 96.7978 37.2026 97.3618C37.9608 97.2349 38.7118 97.0675 39.4522 96.8605C40.1856 96.6683 40.9009 96.4397 41.6162 96.206L42.6737 95.8345L43.7103 95.4397C44.3997 95.1644 45.0917 94.8891 45.7655 94.5852L46.543 94.2397L46.6285 93.1514C46.8708 90.0508 46.8812 86.9364 46.6596 83.8343C46.5456 82.2758 46.3668 80.7174 46.1102 79.1771C45.9806 78.3978 45.8329 77.6186 45.6541 76.8394C45.4794 76.0492 45.2631 75.2689 45.0062 74.5016V74.5016Z"
          fill="black"
        />
        <path
          d="M56.9296 77.0989C56.6708 77.8658 56.4537 78.6462 56.2791 79.4366C56.0977 80.2159 55.9499 80.9951 55.8203 81.7743C55.5664 83.3328 55.3841 84.8973 55.2735 86.4679C55.1629 88.0385 55.1111 89.6022 55.118 91.1589C55.118 92.7174 55.1802 94.2888 55.3072 95.8525L56.1599 94.4213C55.5353 94.8213 54.9262 95.2473 54.3172 95.6707L53.4127 96.3304L52.5186 97.011C51.9328 97.4785 51.3471 97.9512 50.7821 98.4603C50.203 98.9656 49.6502 99.5006 49.1261 100.063C49.8832 99.935 50.6332 99.7677 51.373 99.5616C52.1091 99.3668 52.8244 99.1383 53.5371 98.9045L54.5945 98.5331L55.6312 98.1408C56.3205 97.8629 57.0125 97.5876 57.6889 97.2837L58.4664 96.9434L58.5546 95.8525C58.6815 94.294 58.7386 92.7356 58.7463 91.1589C58.7541 89.5823 58.6997 88.042 58.5882 86.4679C58.4768 84.8939 58.2954 83.351 58.0414 81.7743C57.9118 80.9951 57.7641 80.2159 57.5827 79.4366C57.4072 78.6462 57.1892 77.8658 56.9296 77.0989Z"
          fill="black"
        />
        <path
          d="M18 22.0803L43.2937 24.2123L47.5263 35.4459L26.0804 43.5262L18 22.0803Z"
          fill="black"
        />
        <path
          d="M55.6851 83.8516H70.3125C70.9565 83.8516 71.5742 83.5952 72.0296 83.1388C72.485 82.6823 72.7408 82.0633 72.7408 81.4178V46.0353C72.7408 39.2577 70.0552 32.7576 65.2744 27.9642C60.4936 23.1708 54.009 20.4765 47.2466 20.4737H47.1921C41.3235 20.4737 35.6953 22.8102 31.5455 26.9692C27.3958 31.1283 25.0645 36.7691 25.0645 42.6508V53.1549C25.0645 61.2976 28.2919 69.1067 34.0368 74.8644C39.7817 80.6222 47.5735 83.8568 55.698 83.8568L55.6851 83.8516Z"
          fill="white"
        />
        <path
          d="M49.1022 54.3788C45.7873 54.3788 43.1 51.6915 43.1 48.3765C43.1 45.0616 45.7873 42.3743 49.1022 42.3743C52.4172 42.3743 55.1045 45.0616 55.1045 48.3765C55.1045 51.6915 52.4172 54.3788 49.1022 54.3788Z"
          fill="#FFAEAE"
        />
        <circle cx="45.2823" cy="40.1917" r="8.73054" fill="black" />
        <circle cx="43.1011" cy="36.9178" r="3.27395" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_1254_2064">
          <rect width="80" height="80" rx="40" fill="white" />
        </clipPath>
      </defs>
    </SvgIcon>
  );
};

const QuestionRobot = props => {
  const { trans } = props;

  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState([{ state: 0 }]);
  const [chatNum, setChatNum] = useState(0);
  const [locked, setLocked] = useState(0);
  const [version, setVersion] = useState(2);
  const [currentExpand, setCurrentExpand] = useState(0);
  const [question, setQuestion] = useState("");

  const inputEl = useRef(null);
  const containerEl = useRef(null);
  const chatCopy = useRef(null);
  chatCopy.current = [...chats];

  const keyPress = e => {
    const v = inputEl.current.value;
    if ((e.key === "Enter" || e.target.tagName === "BUTTON") && v && !locked) {
      setQuestion(v);
    }
  };

  // check if doc version changed
  useEffect(() => {
    const hrefs = window.location.href.split("docs/v");
    if (hrefs[1] && (hrefs[1].startsWith("0") || hrefs[1].startsWith("1"))) {
      setVersion(1);
    } else {
      setVersion(2);
    }
  }, []);

  // raise a new question
  useEffect(() => {
    if (question) {
      setChats([...chatCopy.current].concat({ value: question, state: 100 }));
      setLocked(true);
      getFaq({
        params: {
          question,
          version,
        },
      })
        .then(res => {
          if (res?.data?.response) {
            setChats(
              [...chatCopy.current].concat([
                { value: res.data.response.slice(0, 5), state: 1 },
              ])
            );
          }
          setLocked(false);
        })
        .catch(err => {
          console.log("err", err);
          setLocked(false);
        });
      if (inputEl && inputEl.current) {
        inputEl.current.value = "";
      }
    }
  }, [question, version]);

  // scroll when new chat entry created
  useEffect(() => {
    if (chats.length !== chatNum) {
      setChatNum(chats.length);
      if (containerEl && containerEl.current) {
        containerEl.current.scrollTop = containerEl.current.scrollHeight;
      }
    }
  }, [chats, chatNum]);

  // scroll when last answer is expand
  useEffect(() => {
    if (currentExpand + 1 === chats.length) {
      if (containerEl && containerEl.current) {
        containerEl.current.scrollTop = containerEl.current.scrollHeight;
      }
    }
  }, [currentExpand, chats]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className={styles.robot}>
      <IconButton
        aria-label="open"
        size="large"
        onClick={handleOpen}
        disableFocusRipple
        disableRipple
        className={styles.openBtn}
      >
        <BirdIcon className={styles.openBtnIcon} />
      </IconButton>
      <Modal open={open} onClose={handleClose}>
        <div className={styles.dialog}>
          <div className={styles.dialogHeader}>
            Search engine powerd by{" "}
            <img src={milvus} className={styles.logo} alt="logo" />
          </div>
          <div ref={containerEl} className={styles.dialogContent}>
            {chats.map((chat, index) => {
              if (chat.state === 0) {
                return (
                  <div
                    key={`${index}-${chat.state}`}
                    className={styles.serverChat}
                  >
                    <WelcomBlock version={version} setInit={setQuestion} />
                  </div>
                );
              } else if (chat.state === 1) {
                return (
                  <div
                    key={`${index}-${chat.state}`}
                    className={styles.serverChat}
                  >
                    <AnswerBlock
                      chat={chat}
                      index={index}
                      setCurrent={setCurrentExpand}
                      trans={trans}
                    />
                  </div>
                );
              }
              return (
                <div key={`${index}-${chat.state}`} className={styles.myChat}>
                  {chat.value}
                </div>
              );
            })}
          </div>
          <div className={styles.dialogInput}>
            <input
              ref={inputEl}
              placeholder="Ask MilMil Anything..."
              onKeyPress={keyPress}
            />
            <button onClick={keyPress}>{""}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuestionRobot;
