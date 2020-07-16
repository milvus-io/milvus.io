import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './code.scss';

const Code = ({ duration, html, content, locale }) => {
  const [copied, setCopied] = useState(false);

  const buttonTextMap = {
    en: {
      true: 'Copied',
      false: 'Copy',
    },
    cn: {
      true: '已复制',
      false: '复制',
    },
  };

  const formatContent = (content) => {
    const code = content
      .split('\n')
      .filter((item) => item[0] !== '#')
      .map((str) => {
        const invalidItems = ['$', '>>>'];
        return str
          .split(' ')
          .filter((s) => !invalidItems.includes(s))
          .join(' ');
      })
      .join('\n');

    return code;
  };

  const onButtonClick = async () => {
    const code = formatContent(content);
    copyToClipboard(code);
    setCopied(true);
    await delay(duration);
    setCopied(false);
  };

  const copyToClipboard = (content) => {
    const el = document.createElement(`textarea`);
    el.value = content;
    el.setAttribute(`readonly`, ``);
    el.style.position = `absolute`;
    el.style.left = `-9999px`;
    document.body.appendChild(el);
    el.select();
    document.execCommand(`copy`);
    document.body.removeChild(el);
  };

  const delay = (duration) =>
    new Promise((resolve) => setTimeout(resolve, duration));

  return (
    <>
      <section className="wrapper">
        <div dangerouslySetInnerHTML={{ __html: html }}></div>
        <button className="button-copy" onClick={onButtonClick}>
          <i className="fa fa-clone button-copy-icon" aria-hidden="true"></i>
          {buttonTextMap[locale][copied]}
        </button>
      </section>
    </>
  );
};

Code.prototypes = {
  duration: PropTypes.number,
  html: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

Code.defaultProps = {
  duration: 3000,
};

export default Code;
