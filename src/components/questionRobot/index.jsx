import React, { useEffect, useState, useRef } from 'react';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import clsx from 'clsx';
import * as styles from './index.module.less';
import './index.less';
import milvus from '../../images/milvus_logo.svg';
import { getFaq } from '../../http';
import WelcomBlock from './welcomBlock';
import AnswerBlock from './answerBlock';

const BirdIcon = props => {
  return (
    <SvgIcon
      viewBox="0 0 80 80"
      // style={{ width: "64px", height: "64px", fill: "white" }}
      {...props}
    >
      <g clipPath="url(#clip0_1254_2064)">
        <rect width="80" height="80" rx="40" fill="#4FC4F9" />
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
        <circle
          id="milmil_eye"
          cx="43.1011"
          cy="36.9178"
          r="3.27395"
          fill="white"
        />
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
  const [question, setQuestion] = useState('');

  const inputEl = useRef(null);
  const containerEl = useRef(null);
  const chatCopy = useRef(null);
  chatCopy.current = [...chats];

  const keyPress = e => {
    const v = inputEl.current.value;
    if ((e.key === 'Enter' || e.target.tagName === 'BUTTON') && v && !locked) {
      setQuestion(v);
    }
  };

  // check if doc version changed
  useEffect(() => {
    const hrefs = window.location.href.split('docs/v');
    if (hrefs[1] && (hrefs[1].startsWith('0') || hrefs[1].startsWith('1'))) {
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
          console.log('err', err);
          setLocked(false);
        });
      if (inputEl && inputEl.current) {
        inputEl.current.value = '';
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
        className={clsx('milmil_btn', styles.openBtn)}
      >
        <BirdIcon className={styles.openBtnIcon} />
      </IconButton>
      <Modal open={open} onClose={handleClose}>
        <div className={styles.dialog}>
          <div className={styles.dialogHeader}>
            Search engine powerd by{' '}
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
            <button onClick={keyPress}>{''}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuestionRobot;
