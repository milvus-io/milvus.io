import type { MetricType } from '../algorithms/metrics';
import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import styles from '../learnMilvus.module.css';

interface Props {
  value: MetricType;
  onChange: (m: MetricType) => void;
}

export default function MetricSwitch({ value, onChange }: Props) {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('learnMilvus', { lng: locale });

  const METRICS: { key: MetricType; label: string; desc: string }[] = [
    { key: 'L2', label: 'L2', desc: t('metric.l2SwitchDesc') },
    { key: 'COSINE', label: 'Cosine', desc: t('metric.cosineSwitchDesc') },
    { key: 'IP', label: 'IP', desc: t('metric.ipSwitchDesc') },
  ];

  return (
    <div className={styles.metricSwitch}>
      {METRICS.map((m) => (
        <button
          key={m.key}
          className={`${styles.metricBtn} ${value === m.key ? styles.metricBtnActive : ''}`}
          onClick={() => onChange(m.key)}
          title={m.desc}
        >
          <span className={styles.metricLabel}>{m.label}</span>
          <span className={styles.metricDesc}>{m.desc}</span>
        </button>
      ))}
    </div>
  );
}
