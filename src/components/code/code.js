import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './code.scss';

const Code = ({ duration, html, content }) => {
  const [copied, setCopied] = useState(false);

  const onButtonClick = async () => {
    copyToClipboard(content);
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

        <div className="button-copy-wrapper">
          <i class="fa fa-clone" aria-hidden="true"></i>
          <button onClick={onButtonClick} className="button-copy">
            {copied ? `Copied` : `Copy`}
          </button>
        </div>
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
