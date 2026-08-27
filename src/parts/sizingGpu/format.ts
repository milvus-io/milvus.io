const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
const EMPTY = '—';

/**
 * Byte formatting for the GPU tab. Kept separate from `unitBYTE2Any` because
 * the design calls for two decimals on every unit above bytes.
 */
export const formatGpuBytes = (value: number) => {
  if (!Number.isFinite(value) || value < 0) {
    return EMPTY;
  }
  if (value === 0) {
    return '0 B';
  }

  let size = value;
  let index = 0;
  while (size >= 1024 && index < BYTE_UNITS.length - 1) {
    size /= 1024;
    index += 1;
  }

  const rendered = index === 0 ? `${Math.round(size)}` : size.toFixed(2);
  return `${rendered} ${BYTE_UNITS[index]}`;
};

/**
 * Thousands grouping without `toLocaleString`, so the server and the browser
 * always produce the same string regardless of the available ICU data.
 */
export const formatGpuNumber = (value: number) => {
  if (!Number.isFinite(value)) {
    return EMPTY;
  }

  const rounded = Math.round(value);
  const sign = rounded < 0 ? '-' : '';
  return sign + `${Math.abs(rounded)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
