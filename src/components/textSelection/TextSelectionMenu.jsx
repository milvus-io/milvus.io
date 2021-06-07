import React, { useState, useEffect } from 'react';
import * as moduleStyle from './textSelectionMenu.module.less';
import git from '../../images/git.svg';

const TextSelectionMenu = ({ language, options, locale }) => {
  const { selectMenu } = language;
  const { styles, copy } = options;
  const [style, setStyle] = useState({
    visibility: 'hidden',
    zIndex: -100,
    width: `${locale === 'cn' ? '156px' : '179px'}`
  });
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');

  // longest title string length about qual 96
  // 'I have a issue about ' = 21
  // rest = 75
  useEffect(() => {
    const tempStr = copy.length < 75 ? copy : copy.substring(0, 72) + '...';
    setStyle(styles);
    setBody(copy);
    setTitle(`I have a issue about  "${tempStr}"`);
  }, [copy, styles]);
  return (
    <div className={moduleStyle.popToolWrapper} style={style}>
      <div className={moduleStyle.bgWrapper}>
        <a
          href={`https://github.com/milvus-io/milvus/issues/new?assignees=&labels=&template=documentation-request.md&title=${title}&body=${body}`}
          target="_blank"
          rel="noopener noreferrer"
          className={moduleStyle.contentItem}
        >
          <p className={moduleStyle.iconWrapper}>
            <img src={git} alt="git-logo" />
          </p>
          <span className={moduleStyle.text}>{selectMenu.github}</span>
        </a>
      </div>
    </div>
  );
};

export default TextSelectionMenu;
