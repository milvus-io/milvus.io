import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './query-modal.scss';

const QueryModal = ({ locale, setShowModal }) => {
  const [url, setUrl] = useState('http://localhost:8000/app/dev_tools/console');
  const [host, setHost] = useState('localhost:8000');

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
  const onCloseClick = () => setShowModal(false);
  const onSaveClick = () => {};

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
        </form>

        <div className="query-button-wrapper">
          <button className="query-button" onClick={onSaveClick}>
            {i18nMap[locale]['save']}
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
