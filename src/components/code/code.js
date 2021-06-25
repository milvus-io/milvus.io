import React from 'react';
import PropTypes from 'prop-types';
import * as styles from './code.module.less';

const Code = ({ html, content, locale }) => {
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

  const handleButtonsContent = () => {
    document.querySelectorAll('.btn-copy-text').forEach(item => {
      const isCurrentElement =
        item.parentNode.previousSibling.innerHTML === html;

      // change button text
      item.textContent = buttonTextMap[locale][isCurrentElement];
      // change button icon
      item.nextSibling.className = isCurrentElement
        ? `${styles.icon} fa fa-check`
        : `${styles.icon} far fa-clone`;
    });
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

  const onButtonClick = () => {
    handleButtonsContent();
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
    <section className={styles.codeWrapper}>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>

      <button className={styles.btn} onClick={onButtonClick}>
        <span className={`${styles.text} btn-copy-text`}>
          {locale === 'en' ? 'Copy' : '复制'}
        </span>
        <i className={`${styles.icon} far fa-clone`} aria-hidden="true"></i>
      </button>
    </section>
  );
};

Code.prototypes = {
  html: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
};

export default Code;
