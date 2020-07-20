import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './query-modal.scss';

const QueryModal = ({ locale, setShowModal }) => {
  const [url, setUrl] = useState('');
  const [host, setHost] = useState('');
  const [username, setUsername] = useState('');

  const i18nMap = {
    en: {
      save: 'Save',
      reset: 'Reset',
      url: 'Enter the URL of the Console editor',
      host: 'cURL host',
      username: 'cURL username',
      hint: 'Or install',
    },
    cn: {
      save: '保存',
      reset: '重置',
      url: '输入Sense编辑器的URL',
      host: 'cURL主办',
      username: 'cURL用户名',
      hint: '或安装',
    },
  };

  const onUrlChange = (event) => setUrl(event.target.value);
  const onHostChange = (event) => setHost(event.target.value);
  const onUsernameChange = (event) => setUsername(event.target.value);

  const onCloseClick = () => setShowModal(false);
  const onResetClick = () => setUsername('');
  const onSaveClick = () => {
    console.log('url', url, 'host', host, 'username', username);
  };

  return (
    <>
      <section className="query-wrapper">
        <button className="query-button-close" onClick={onCloseClick}>
          ×
        </button>

        <form className="query-form">
          <label className="query-label" htmlFor="url">
            {i18nMap[locale]['url']}
          </label>
          <input
            className="query-input"
            value={url}
            id="url"
            onChange={onUrlChange}
          />
          <label className="query-label" htmlFor="host">
            {i18nMap[locale]['host']}
          </label>
          <input
            className="query-input"
            value={host}
            id="host"
            onChange={onHostChange}
          />
          <label className="query-label" htmlFor="username">
            {i18nMap[locale]['username']}
          </label>
          <input
            className="query-input"
            value={username}
            onChange={onUsernameChange}
            id="username"
          />
        </form>

        <div className="query-button-wrapper">
          <button className="query-button" onClick={onSaveClick}>
            {i18nMap[locale]['save']}
          </button>
          <button className="query-button" onClick={onResetClick}>
            {i18nMap[locale]['reset']}
          </button>
        </div>
      </section>
    </>
  );
};

QueryModal.prototype = {
  locale: PropTypes.string.isRequired,
};

export default QueryModal;
