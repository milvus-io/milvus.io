import clsx from 'clsx';
import classes from './index.module.css';

export interface SizingTabOption<T extends string> {
  value: T;
  label: string;
  badge?: string;
}

interface SizingTabsProps<T extends string> {
  options: SizingTabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  hint?: string;
  className?: string;
  /** Shared prefix for the tab/panel ids, so panels can point back at a tab. */
  idPrefix?: string;
}

export const sizingTabId = (idPrefix: string, value: string) =>
  `${idPrefix}-tab-${value}`;

export const sizingTabPanelId = (idPrefix: string, value: string) =>
  `${idPrefix}-panel-${value}`;

export function SizingTabs<T extends string>(props: SizingTabsProps<T>) {
  const {
    options,
    value,
    onChange,
    hint,
    className,
    idPrefix = 'sizing',
  } = props;

  return (
    <div className={className}>
      <div className={classes.tabs} role="tablist">
        {options.map(option => (
          <button
            key={option.value}
            id={sizingTabId(idPrefix, option.value)}
            type="button"
            role="tab"
            aria-selected={option.value === value}
            aria-controls={sizingTabPanelId(idPrefix, option.value)}
            tabIndex={option.value === value ? 0 : -1}
            className={clsx(classes.tab, {
              [classes.tabActive]: option.value === value,
            })}
            onClick={() => onChange(option.value)}
          >
            {option.label}
            {option.badge && (
              <span className={classes.tabBadge}>{option.badge}</span>
            )}
          </button>
        ))}
      </div>
      {hint && <div className={classes.hint}>{hint}</div>}
    </div>
  );
}
