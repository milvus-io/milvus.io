import React, { useState } from 'react';
import './commentDialog.scss';
import close from '../../images/close.svg';

const CommentDialog = ({ open=false, hideDialog }) => {
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setMessage(e.target.value);

  };
  const handleSendComment = () => {
    if (!message.length) return;
  };
  const handleHideDialog = () => {
    hideDialog();
    setMessage('');
  };

  return (
    <div className={`${open ? 'show' : ''} comment-wrapper`}>
      <div className="comment-header">
        <p className="title">Comment</p>
        <i
          role='button'
          tabIndex={0}
          className="icon-wrapper"
          onClick={handleHideDialog}
          onKeyDown={handleHideDialog}
        >
          <img src={close} alt="close-button" />
        </i>
      </div>
      <div className="comment-body">
        <textarea
          className="text-area"
          placeholder='Leave a message'
          rows="10"
          value={message}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="comment-footer">
        <span
          tabIndex={0}
          role='button'
          className={`${!message.length ? 'disabled' : ''} button`}
          onClick={handleSendComment}
          onKeyDown={handleSendComment}
        >Send</span>
        <span
          tabIndex={0}
          role='button'
          className='button cancel-btn'
          onClick={handleHideDialog}
          onKeyDown={handleHideDialog}
        >Cancle</span>
      </div>
    </div>
  )
}

export default CommentDialog