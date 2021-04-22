import React, { useState, useEffect } from 'react';
import './textSelectionMenu.scss';
import comment from '../../images/comment.svg'
import git from '../../images/git.svg'

const TextSelectionMenu = ({language, options, showDialog }) => {
  const {selectMenu} = language
  const [style, setStyle] = useState({
    visibility: 'hidden',
    zIndex: -100,
  });

  useEffect(() => {
    setStyle(options)
  }, [options]);

  return (
    <div className='pop-tool-wrapper' style={style} >
      <div className="pop-tool-content" >
        <div 
          className="content-item" 
          role='button'
          tabIndex={-1} 
          onClick={showDialog} 
          onKeyDown={showDialog}
        >
          <p className="icon-wrapper">
            <img src={comment} alt="comment-logo" />
          </p>
          <span>{selectMenu.comment}</span>
        </div>
        |
        <a href="https://github.com/milvus-io/milvus" className="content-item">
          <p className="icon-wrapper">
            <img src={git} alt="git-logo" />
          </p>
          <span>{selectMenu.github}</span>
        </a>
      </div>
      <div className="delta"></div>
    </div>
  )
}

export default TextSelectionMenu