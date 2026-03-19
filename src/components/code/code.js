import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as styles from './code.module.css';
import CheckIcon from '@mui/icons-material/Check';
import Tooltip from '@mui/material/Tooltip';
import { formatCodeContent } from '@/utils/code';

const RESET_COPIED_TIME = 3000;

const Code = ({ html, content, tooltip = {} }) => {
  const [isCopied, setIsCopied] = useState(false);

  const { copy: copyText = 'copy', copied: copiedText = 'copied' } = tooltip;

  const onButtonClick = e => {
    if (isCopied || !navigator?.clipboard) {
      return;
    }
    const code = formatCodeContent(content);
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, RESET_COPIED_TIME);
    });
  };

  return (
    <>
      <div
        className={`${styles.codeSection}`}
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>

      <Tooltip title={isCopied ? copiedText : copyText} arrow placement="top">
        <button className={styles.copyBtn} onClick={onButtonClick}>
          {isCopied ? <CheckIcon /> : <Copy />}
        </button>
      </Tooltip>
    </>
  );
};

Code.prototypes = {
  html: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
};

export default Code;
