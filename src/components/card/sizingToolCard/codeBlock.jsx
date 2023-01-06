import hljs from 'highlight.js';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import React, { useState } from 'react';
import * as classes from './index.module.less';
import clsx from 'clsx';
import {
  RESET_COPIED_TIME,
  HELM_CONFIG_FILE_NAME,
  OPERATOR_CONFIG_FILE_NAME,
} from './constants';

const HighlightBlock = ({ type }) => {
  const [copied, setCopied] = useState(false);
  const content =
    type === 'helm'
      ? `
helm repo add milvus https://milvus-io.github.io/milvus-helm/
helm repo update
helm install my-release milvus/milvus -f ${HELM_CONFIG_FILE_NAME}.yml
    `
      : `
helm repo add milvus-operator https://milvus-io.github.io/milvus-operator/
helm repo update milvus-operator
helm -n milvus-operator upgrade --install milvus-operator milvus-operator/milvus-operator
kubectl create -f ${OPERATOR_CONFIG_FILE_NAME}.yml
    `;

  const handleCopyCode = () => {
    if (!navigator?.clipboard || copied) {
      return;
    }
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, RESET_COPIED_TIME);
    });
  };

  const highlightCode = hljs.highlight(content, { language: 'yml' });
  return (
    <pre className={classes.guideWrapper}>
      <code
        className={clsx('hljs', classes.codeWrapper)}
        dangerouslySetInnerHTML={{ __html: highlightCode.value }}
      ></code>
      <IconButton className={classes.copyBtn} onClick={handleCopyCode}>
        {copied ? <CheckIcon /> : <ContentCopyIcon />}
      </IconButton>
    </pre>
  );
};

export default HighlightBlock;
