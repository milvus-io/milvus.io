import styles from '../learnMilvus.module.css';

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  hint?: string;
  display?: (v: number) => string;
}

export default function ParamSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  hint,
  display,
}: Props) {
  return (
    <div className={styles.paramSlider}>
      <div className={styles.paramSliderHeader}>
        <span className={styles.paramSliderLabel}>{label}</span>
        <span className={styles.paramSliderValue}>
          {display ? display(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && <div className={styles.paramSliderHint}>{hint}</div>}
    </div>
  );
}
