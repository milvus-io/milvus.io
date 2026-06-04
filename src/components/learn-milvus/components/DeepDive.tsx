import Link from 'next/link';
import { useTranslation, Trans } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import type { FaqItem } from './LearnMilvusSeo';
import styles from '../learnMilvus.module.css';

type PageKey = 'metric' | 'ivf' | 'hnsw' | 'diskann';

export interface DeepDiveSection {
  titleKey: string;
  paragraphKeys?: string[];
  listKeys?: string[];
}

interface DeepDiveProps {
  sections: DeepDiveSection[];
  /** i18n key of the docs call-to-action paragraph, rendered with <docs> / <docsExplained> links */
  docsCtaKey?: string;
  docsHref?: string;
  docsExplainedHref?: string;
  faq?: FaqItem[];
  /** Other learn-milvus pages to cross-link */
  related?: PageKey[];
}

const TRANS_COMPONENTS = {
  strong: <strong key="strong" />,
  em: <em key="em" />,
  code: <code key="code" className={styles.codeInline} />,
};

export default function DeepDive(props: DeepDiveProps) {
  const { sections, docsCtaKey, docsHref, docsExplainedHref, faq, related } =
    props;
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('learnMilvus', { lng: locale });

  const ctaComponents = {
    ...TRANS_COMPONENTS,
    docs: <a key="docs" href={docsHref} />,
    docsExplained: <a key="docsExplained" href={docsExplainedHref} />,
  };

  return (
    <div className={styles.deepDive}>
      {sections.map(section => (
        <section key={section.titleKey} className={styles.explainer}>
          <h2 className={styles.deepDiveTitle}>{t(section.titleKey)}</h2>
          {section.paragraphKeys?.map(key => (
            <p key={key} className={styles.explainerLead}>
              <Trans t={t} i18nKey={key} components={TRANS_COMPONENTS} />
            </p>
          ))}
          {section.listKeys && (
            <ul>
              {section.listKeys.map(key => (
                <li key={key}>
                  <Trans t={t} i18nKey={key} components={TRANS_COMPONENTS} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {faq && faq.length > 0 && (
        <section className={styles.explainer}>
          <h2 className={styles.deepDiveTitle}>{t('common.faqTitle')}</h2>
          {faq.map(item => (
            <div key={item.question} className={styles.faqItem}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
          {docsCtaKey && (
            <p className={styles.takeaway}>
              <Trans t={t} i18nKey={docsCtaKey} components={ctaComponents} />
            </p>
          )}
        </section>
      )}

      {related && related.length > 0 && (
        <section>
          <h2 className={styles.deepDiveRelatedTitle}>
            {t('common.relatedTitle')}
          </h2>
          <div className={styles.homeGrid}>
            {related.map(key => (
              <Link
                key={key}
                href={`/learn-milvus/${key}`}
                className={styles.homeCard}
              >
                <h3>{t(`home.cards.${key}.title`)}</h3>
                <p>{t(`home.cards.${key}.desc`)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
