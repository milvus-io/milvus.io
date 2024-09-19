import React from 'react';
import { i18n } from './i18n';
import { getBaseUrl, isControlPlane } from './utils';
import styles from './RestSpace.module.css';
import { Admonition } from './Admonition';
import { CodeBlock } from './CodeBlock';

export const BaseURL = ({ endpoint, lang, target }) => {
  const { server, children, prompt } = getBaseUrl(endpoint, lang, target);
  return (
    <>
      <section>
        <section className={styles.sectionHeader}>
          <span>
            {isControlPlane(endpoint)
              ? 'Base URL'
              : i18n[lang]['title.cluster.endpoint']}
          </span>
        </section>
        <div style={{ margin: '1rem 0' }}>
          <p>{i18n[lang]['base.url.format.prompt']}</p>
          <p className={styles.paramName} style={{ fontSize: '0.9rem' }}>
            {server}
          </p>
        </div>
      </section>
      <section className={styles.exampleContainer}>
        <CodeBlock className="language-shell" children={children} />
      </section>
    </>
  );
};
