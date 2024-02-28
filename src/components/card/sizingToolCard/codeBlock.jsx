import hljs from 'highlight.js';
import React from 'react';
import * as classes from './index.module.less';
import clsx from 'clsx';
import { HELM_CONFIG_FILE_NAME, OPERATOR_CONFIG_FILE_NAME } from './constants';
import { useCodeCopy } from '../../../hooks/doc-dom-operation';
import { useTranslation } from 'react-i18next';

const HighlightBlock = ({ type }) => {
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

  const { t } = useTranslation();
  const highlightCode = hljs.highlight(content, { language: 'yml' });

  useCodeCopy(
    {
      copy: t('v3trans.copyBtn.copyLabel'),
      copied: t('v3trans.copyBtn.copiedLabel'),
    },
    ['yml']
  );

  return (
    <pre className={classes.guideWrapper}>
      <code
        className={clsx('hljs', classes.codeWrapper)}
        dangerouslySetInnerHTML={{ __html: highlightCode.value }}
      ></code>
    </pre>
  );
};

export default HighlightBlock;
