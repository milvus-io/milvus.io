import React, { useState, useEffect, useRef } from 'react';
import './index.scss';
import comment from '../../images/comment.svg'
import git from '../../images/git.svg'

const TextSelectionMenu = ({ options }) => {
  const { target, ...styles } = options
  const [style, setStyle] = useState({
    display: 'none'
  });
  const [container, commentItem, gitItem] = [useRef(null), useRef(null), useRef(null)]

  useEffect(() => {
    if ([container.current, commentItem.current, gitItem.current].includes(target)) {
      return
    }
    setStyle(styles)

  }, [options]);

  const handleClick = e => {
    e.stopPropagation();

  }

  return (
    <div className='pop-tool-wrapper' style={style} ref={container}>
      <div className="pop-tool-content" onClick={e => handleClick(e)}>
        <div className="content-item" ref={commentItem}>
          <p className="icon-wrapper">
            <img src={comment} alt="comment-logo" />
          </p>
          <span>Comment</span>
        </div>
        |
        <div className="content-item" ref={gitItem}>
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