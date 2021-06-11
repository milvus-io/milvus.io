
import React, { useEffect, useState, useRef } from 'react';
import * as styles from './index.module.less';
import iconBird from '../../images/v2/icon_bird.svg';
import milvus from '../../images/v2/milvus.svg';
import { getFaq } from '../../http/http';


const ChatItem = ({ chat = [] }) => {
  const [title, content, isLink] = chat;
  const [expand, setExpand] = useState(false);

  const answer = expand ? (
    <>
      {`A: ${content}`}
      <button className={styles.answer} onClick={() => { setExpand(false) }}>
        Collapse
      <i className={`fas fa-chevron-up`}></i>
      </button>
    </>
  ) : (
    <button className={styles.answer} onClick={() => { setExpand(true) }}>
      See Answers
      <i
        className={`fas fa-chevron-down`}
      ></i>
    </button>
  );
  return (
    <div key={title} className={styles.chatCard}>
      <span className={styles.chatTitle}>{title}</span>
      {isLink ? (
        <a className={styles.chatAnswer} href={content} target="_blank" rel="noopener noreferrer">
          See on Github
          <i
            className={`fab fa-github`}
          ></i>
        </a>
      ) : answer}
    </div>
  );
}

const QuestionRobot = () => {
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [chatNum, setChatNum] = useState(0);
  const [locked, setLocked] = useState(0);

  const inputEl = useRef(null);
  const containerEl = useRef(null);

  const toggle = () => {
    setOpen(!open);
  }

  const keyPress = e => {
    const v = inputEl.current.value;
    if ((e.key === 'Enter' || e.target.tagName == "BUTTON") && v && !locked) {
      setChats([...chats].concat({ value: v, state: 0 }));
      setLocked(true);
      getFaq({
        params: {
          question: v,
          version: 1
        },
      }).then(res => {
        if (res?.data?.response) {
          setChats([...chats].concat([
            { value: v, state: 0 },
            { value: res.data.response.slice(0, 5), state: 1 }
          ]));
        }
        setLocked(false);
      }).catch(err => {
        console.log("err", err);
        setLocked(false);
      })
      inputEl.current.value = '';
    }
  }

  const expandAnswers = (index) => {
    const expandedChats = [...chats];
    expandedChats[index]['state'] = 2;
    setChats(expandedChats);
  }

  useEffect(() => {
    if (chats.length !== chatNum) {
      setChatNum(chats.length);
      if (containerEl) {
        containerEl.current.scrollTop = containerEl.current.scrollHeight;
      }
    }
  }, [chats])

  return (
    <div className={styles.robot}>
      {open && (
        <div className={styles.dialog}>
          <div className={styles.dialogHeader}>Search Engine powerd by <img src={milvus} className={styles.logo} /></div>
          <div ref={containerEl} className={styles.dialogContent}>
            {chats.map((chat, index) => {
              if (chat.state === 0) {
                return <div key={`${index}${chat.state}`} className={styles.myChat}>{chat.value}</div>
              } else if (chat.state === 1) {
                return (
                  <div key={`${index}${chat.state}`} className={styles.serverChat}>
                    <img src={iconBird} />
                    <div>
                      Hi! Here are related disscussion that might help you:
                      {
                        chat.value.slice(0, 3).map(chatEntry =>
                          <ChatItem chat={chatEntry} />
                        )
                      }
                      <button onClick={() => expandAnswers(index)}>
                        See More
                        <i
                          className={`fas fa-chevron-down`}
                        ></i>
                      </button>
                    </div>
                  </div>
                )
              } else {
                return (
                  <div key={`${index}${chat.state}`} className={styles.serverChat}>
                    <img src={iconBird} />
                    <div>
                      Hi! Here are related disscussion that might help you:
                      {chat.value.map(chatEntry =>
                      <ChatItem chat={chatEntry} />
                    )}
                    </div>
                  </div>
                )
              }
            })}
          </div>
          <div className={styles.dialogInput}>
            <input ref={inputEl} placeholder="Ask Milvus Anything..." onKeyPress={keyPress} />
            <button onClick={keyPress}></button>
          </div>
        </div>
      )}
      <button onClick={toggle} className={`${styles.openBtn} ${open && styles.close}`}></button>
    </div>
  );
};

export default QuestionRobot;
