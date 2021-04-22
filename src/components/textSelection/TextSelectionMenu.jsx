import React, { useState, useEffect } from 'react';
import './textSelectionMenu.scss';
import git from '../../images/git.svg'
import { unstable_batchedUpdates } from 'react-dom';

const TextSelectionMenu = ({ language, options }) => {
  const { selectMenu } = language;
  const { styles, copy } = options;
  console.log(copy)
  const [style, setStyle] = useState({
    visibility: 'hidden',
    zIndex: -100,
  });
  const [title, setTitle] = useState('')

  useEffect(() => {
    unstable_batchedUpdates(() => {
      setStyle(styles);
      setTitle(copy)
    })
  }, [options]);

  return (
    <div className='pop-tool-wrapper' style={style} >
      <div className='bg-wrapper'>
        <div className="pop-tool-content" >
          {/* <div
          className="content-item"
        >
          <p className="icon-wrapper">
            <img src={comment} alt="comment-logo" />
          </p>
          <span>{selectMenu.comment}</span>
        </div>
        | */}
          <a href={`
              https://github.com/milvus-io/docs/issues/new?
              assignees=&labels=&template=change-request.md&title=&body=${title}`
            } 
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
  )
}

export default TextSelectionMenu