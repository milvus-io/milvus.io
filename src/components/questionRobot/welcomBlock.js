import React from 'react';
import iconBird from '/images/milmil_logo.svg';

const WelcomBlock = ({ version = 2, setInit = () => {} }) => {
  const initQuestions = {
    1: [
      'How to set index_file_size',
      'The limit to the number of partitions',
      'Deploy Enterprise Manager',
      'How to choose a Milvus index',
    ],
    2: [
      'How to install Milvus?',
      'What are the factors affecting recall?',
      'Can multiple indexes be created in a collection?',
      'The limit to the number of partitions.',
    ],
  };

  const raiseQuestion = q => {
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
          {initQuestions[version].map((question, index) => {
            return (
              <button
                key={`${question}-${index}`}
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

export default WelcomBlock;
