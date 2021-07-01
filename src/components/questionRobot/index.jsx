import React, { useEffect, useState, useRef } from 'react';
import * as styles from './index.module.less';
import milvus from '../../images/v2/milvus.svg';
import { getFaq } from '../../http/http';
import WelcomBlock from './welcomBlock';
import AnswerBlock from './answerBlock';

const QuestionRobot = () => {
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

  const toggle = () => {
    setOpen(!open);
  };

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

  const onMaskClick = () => {
    setOpen(false);
  };

  return (
    <div className={styles.robot}>
      {open && (
        <div className={styles.dialog}>
          <div className={styles.dialogHeader}>
            Search Engine powerd by{' '}
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
              placeholder="Ask Milvus Anything..."
              onKeyPress={keyPress}
            />
            <button onClick={keyPress}>{''}</button>
          </div>
        </div>
      )}
      <button
        onClick={toggle}
        className={`${styles.openBtn} ${open && styles.close}`}
      >
        {''}
      </button>
      {open && (
        <div
          className={styles.mask}
          role="presentation"
          onClick={onMaskClick}
        />
      )}
    </div>
  );
};

export default QuestionRobot;
