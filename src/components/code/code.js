import React from 'react';
import PropTypes from 'prop-types';
import * as styles from './code.module.less';

const Code = ({ html, content, locale }) => {
  const handleButtonsContent = e => {
    if (Array.from(e.target.classList)[2] === 'fa-check') {
      return;
    }

    document.querySelectorAll('.btn-copy').forEach(item => {
      item.classList.remove('fa');
      item.classList.remove('fa-check');
      item.classList.add('far');
      item.classList.add('fa-clone');
    });
    // copy icon
    e.target.classList.toggle('far');
    e.target.classList.toggle('fa-clone');
    // copied icon
    e.target.classList.toggle('fa');
    e.target.classList.toggle('fa-check');
  };

  const formatContent = content => {
    const code = content
      .split('\n')
      .filter(item => item[0] !== '#')
      .map(str => {
        const invalidItems = ['$', '>>>'];
        return str
          .split(' ')
          .filter(s => !invalidItems.includes(s))
          .join(' ');
      })
      .join('\n');

    return code;
  };

  const onButtonClick = e => {
    handleButtonsContent(e);
    const code = formatContent(content);
    copyToClipboard(code);
  };

  const copyToClipboard = content => {
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

  return (
    <>
      <div
        className={`${styles.codeSection}`}
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>

      <button className={styles.copyBtn} onClick={onButtonClick}>
        <i
          className={`btn-copy ${styles.icon} far fa-clone`}
          aria-hidden="true"
        ></i>
      </button>
    </>
  );
};

Code.prototypes = {
  html: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
};

export default Code;
