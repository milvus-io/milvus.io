// Public list URLs must identify the same page with and without JavaScript.
export function referenceListPath(page = 1, topic = '', keyword = '') {
  const params = new URLSearchParams();
  if (topic) params.set('topic', topic);
  if (keyword.trim()) params.set('keyword', keyword.trim());
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return `/ai-quick-reference${query ? `?${query}` : ''}`;
}

export function referencePageIndex(value: unknown, total: number, pageSize: number) {
  if (value === undefined) return 1;
  // Reject arrays, fractions, signs and out-of-range pages instead of serving
  // the last page under arbitrarily many URLs (e.g. ?page=999999).
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return null;
  const page = Number(value);
  return Number.isSafeInteger(page) && page <= Math.max(1, Math.ceil(total / pageSize))
    ? page : null;
}
