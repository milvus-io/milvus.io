import React, { useState } from 'react';
import FeedbackModal from '../feedbackModal';
import iconBird from '../../images/v2/icon_bird.svg';
import * as styles from './index.module.less';

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

const AnswerBlock = ({ chat = [], setCurrent = () => {}, index = 0 }) => {
  const [expandBlock, setExpandBlock] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const contact = {
    dialog: {
      title: 'We will follow up on your question',
      desc: 'Please leave your question here and we will be in touch.',
      placeholder1: 'Your Email*',
      placeholder2: 'Your Question*',
      submit: 'Submit',
      invalid: 'please input valid email and your question',
    },
  };

  const expandAnswers = () => {
    setExpandBlock(true);
    setCurrent(index);
  };

  if (expandBlock) {
    return (
      <>
        <img src={iconBird} alt="icon" />
        <div>
          Hi! Here are some related questions that might help:
          {chat.value.map((chatEntry, index) => (
            <ChatItem key={`${chatEntry.title}-${index}`} chat={chatEntry} />
          ))}
          <div className={styles.feedback}>
            Didn't find an answer?
            <button onClick={() => setShowModal(true)}>
              Put in your feedback here.
            </button>
            {showModal && (
              <FeedbackModal setShowModal={setShowModal} contact={contact} />
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <img src={iconBird} alt="icon" />
      <div>
        Hi! Here are some related questions that might help:
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

export default AnswerBlock;
