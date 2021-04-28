import React, { useState, useEffect } from 'react';
import './textSelectionMenu.scss';
import git from '../../images/git.svg';

const TextSelectionMenu = ({ language, options }) => {
  const { selectMenu } = language;
  const { styles, copy } = options;
  const [style, setStyle] = useState({
    visibility: 'hidden',
    zIndex: -100,
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
    <div className='pop-tool-wrapper' style={style} >
      <div className='bg-wrapper'>
        <div className="pop-tool-content" >
          <a href={`https://github.com/milvus-io/milvus/issues/new?assignees=&labels=&template=documentation-request.md&title=${title}&body=${body}`}
            target='_blank'
            rel="noopener noreferrer"
            className="content-item"
          >
            <p className="icon-wrapper">
              <img src={git} alt="git-logo" />
            </p>
            <span>{selectMenu.github}</span>
          </a>
        </div>
      </div>

    </div>
  );
};

export default TextSelectionMenu;