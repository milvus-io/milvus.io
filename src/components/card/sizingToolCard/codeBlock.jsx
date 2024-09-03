import hljs from 'highlight.js';
import React from 'react';
import * as classes from './index.module.less';
import clsx from 'clsx';
import { HELM_CONFIG_FILE_NAME, OPERATOR_CONFIG_FILE_NAME } from './constants';
import { useTranslation } from 'react-i18next';
import { useCopyCode } from '@/hooks/enhanceCodeBlock';

const HighlightBlock = ({ type }) => {
  const content =
    type === 'helm'
      ? `
helm repo add milvus https://zilliztech.github.io/milvus-helm/
helm repo update
helm install my-release milvus/milvus -f ${HELM_CONFIG_FILE_NAME}.yml
    `
      : `
helm repo add milvus-operator https://zilliztech.github.io/milvus-operator/
helm repo update milvus-operator
helm -n milvus-operator upgrade --install milvus-operator milvus-operator/milvus-operator
kubectl create -f ${OPERATOR_CONFIG_FILE_NAME}.yml
    `;

  const { t } = useTranslation();
  const highlightCode = hljs.highlightAuto(content);

  useCopyCode([content]);

  return (
    <pre className={classes.guideWrapper}>
      <code
        className={clsx('hljs', classes.codeWrapper)}
        dangerouslySetInnerHTML={{ __html: highlightCode.value }}
      ></code>

      <button className={clsx('copy-code-btn', classes.copyButton)}></button>
    </pre>
  );
};

export default HighlightBlock;
