import React, { useState, useEffect, useRef } from 'react';
import './index.scss';
import comment from '../../images/comment.svg'
import git from '../../images/git.svg'

const TextSelectionMenu = ({ options }) => {

  const [style, setStyle] = useState({
    display: 'none'
  });
  const [container, item1, item2] = [useRef(null), useRef(null), useRef(null)]

  useEffect(() => {
    setStyle(options)
  }, [options]);

  const handleClick = e => {
    e.stopPropagation();
    if (![container, item1, item2].includes(e.target)) {
      setStyle({
        display: 'none'
      })
    }
  }

  return (
    <div className='pop-tool-wrapper' style={style} ref={container}>
      <div className="pop-tool-content" onClick={e => handleClick(e)}>
        <div className="content-item" ref={item1}>
          <p className="icon-wrapper">
            <img src={comment} alt="comment-logo" />
          </p>
          <span>Comment</span>
        </div>
        |
        <div className="content-item" ref={item2}>
          <p className="icon-wrapper">
            <img src={git} alt="git-logo" />
          </p>
          <span>Github</span>
        </div>
      </div>
      <div className="delta"></div>
    </div>
  )
}

export default TextSelectionMenu