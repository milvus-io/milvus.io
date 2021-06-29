import React, { useEffect, useState, useRef } from 'react';
import * as styles from './index.module.less';
import iconBird from '../../images/v2/icon_bird.svg';
import milvus from '../../images/v2/milvus.svg';
import { getFaq } from '../../http/http';

const ChatItem = ({ chat = {} }) => {
  const [title, content, isLink] = chat;
  const [expand, setExpand] = useState(false);

  const answer = expand ? (
    <>
      {`A: ${content}`}
      <button
        onClick={() => {
          setExpand(false);
        }}
      >
        Collapse
        <i className={`fas fa-chevron-up`}></i>
      </button>
    </>
  ) : (
    <button
      onClick={() => {
        setExpand(true);
      }}
    >
      See Answers
      <i className={`fas fa-chevron-down`}></i>
    </button>
  );
  return (
    <div key={title} className={styles.chatCard}>
      <span className={styles.chatTitle}>{title}</span>
      {isLink ? (
        <a href={content} target="_blank" rel="noopener noreferrer">
          See on Github
          <i className={`fab fa-github`}></i>
        </a>
      ) : (
        answer
      )}
    </div>
  );
};

const WelcomBlock = ({ version = 2, setInit = () => {} }) => {
  const initQuestions = {
    1: [
      'How to set index_file_size',
      'The limit to the number of partitions',
      'Deploy Enterprise Manager',
      'How to choose a Milvus index',
    ],
    2: [
      'The way to install milvus.',
      'What are the factors affecting recall?',
      'Can multiple indexes be created in a collection?',
      'The limit to the number of partitions.',
    ],
  };

  const raiseQuestion = q => {
    console.log(q);
    setInit(q);
  };

  return (
    <>
      <img src={iconBird} alt="icon" />
      <div>
        Hi, I'm your chatbot MilMil, ask me anything about Milvus version{' '}
        {version}.x!
        <br />
        <br />
        You may want to know:
        <div>
          {initQuestions[version].map(question => {
            return (
              <button
                onClick={() => {
                  raiseQuestion(question);
                }}
              >
                {question}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

const AnswerBlock = ({ chat = [], setCurrent = () => {}, index = 0 }) => {
  const [expandBlock, setExpandBlock] = useState(false);

  const expandAnswers = () => {
    setExpandBlock(true);
    setCurrent(index);
  };

  if (expandBlock) {
    return (
      <>
        <img src={iconBird} alt="icon" />
        <div>
          Hi! Here are related disscussion that might help you:
          {chat.value.map((chatEntry, index) => (
            <ChatItem key={`${chatEntry.title}-${index}`} chat={chatEntry} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <img src={iconBird} alt="icon" />
      <div>
        Hi! Here are related disscussion that might help you:
        {chat.value.slice(0, 3).map((chatEntry, index) => (
          <ChatItem key={`${chatEntry.title}-${index}`} chat={chatEntry} />
        ))}
        <button onClick={() => expandAnswers()}>
          See More
          <i className={`fas fa-chevron-down`}></i>
        </button>
      </div>
    </>
  );
};

const QuestionRobot = () => {
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState([{ state: 0 }]);
  const [chatNum, setChatNum] = useState(0);
  const [locked, setLocked] = useState(0);
  const [version, setVersion] = useState(2);
  const [currentExpand, setCurrentExpand] = useState(0);
  const [initQuestion, setInitQuestion] = useState('');

  const inputEl = useRef(null);
  const containerEl = useRef(null);

  const toggle = () => {
    setOpen(!open);
  };

  const sendRequest = v => {
    setChats([...chats].concat({ value: v, state: 100 }));
    setLocked(true);
    getFaq({
      headers: {
        secretCode: 'milvus-faq-131492-knowledge-search',
      },
      params: {
        question: v,
        version,
      },
    })
      .then(res => {
        if (res?.data?.response) {
          setChats(
            [...chats].concat([
              { value: v, state: 100 },
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
  };

  const keyPress = e => {
    const v = inputEl.current.value;
    if ((e.key === 'Enter' || e.target.tagName === 'BUTTON') && v && !locked) {
      sendRequest(v);
    }
  };

  useEffect(() => {
    const hrefs = window.location.href.split('docs/v');
    if (hrefs[1] && (hrefs[1].startsWith('0') || hrefs[1].startsWith('1'))) {
      setVersion(1);
    } else {
      setVersion(2);
    }
  }, []);

  useEffect(() => {
    if (initQuestion) {
      sendRequest(initQuestion);
    }
  }, [initQuestion]);

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
  }, [currentExpand]);

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
                    <WelcomBlock version={version} setInit={setInitQuestion} />
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
          onClick={onMaskClick}
          role="button"
          tabIndex={0}
          onKeyDown={onMaskClick}
        ></div>
      )}
    </div>
  );
};

export default QuestionRobot;
