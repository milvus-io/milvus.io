const fs = require('node:fs');
const { isAbsolute, join, relative } = require('node:path');

const DATE_INDEX_PATH = join(process.cwd(), 'content/git-last-modified.json');
let gitDates;

function toISODate(value) {
  if (!(value instanceof Date) && typeof value !== 'string') return;
  // Some blog posts use unpadded dates. Normalize them before parsing so
  // Node interprets date-only values in UTC on every build host.
  const dateOnly = typeof value === 'string' &&
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value.trim());
  const normalized = dateOnly
    ? `${dateOnly[1]}-${dateOnly[2].padStart(2, '0')}-${dateOnly[3].padStart(2, '0')}`
    : value;
  const iso = new Date(normalized).toJSON();
  if (iso && (!dateOnly || iso.startsWith(normalized))) return iso;
}

function getContentLastModified(filePath, frontMatter = {}) {
  if (!gitDates) {
    gitDates = fs.existsSync(DATE_INDEX_PATH)
      ? JSON.parse(fs.readFileSync(DATE_INDEX_PATH, 'utf8'))
      : {};
  }
  const source = isAbsolute(filePath)
    ? relative(process.cwd(), filePath)
    : filePath;
  const candidates = [
    frontMatter.dateModified, frontMatter.lastModified, frontMatter.lastmod,
    frontMatter.updatedAt, frontMatter.updated_at,
  ];
  for (const candidate of candidates) {
    const date = toISODate(candidate);
    if (date) return date;
  }

  const committed = toISODate(gitDates[source]);
  const published = toISODate(frontMatter.datePublished) ?? toISODate(frontMatter.date);
  // A scheduled article may have been committed before its publication date.
  if (committed && published) return committed > published ? committed : published;
  return committed ?? published;
}

function readContentFrontMatter(filePath) {
  try {
    return require('gray-matter')(fs.readFileSync(filePath, 'utf8')).data;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

module.exports = { DATE_INDEX_PATH, getContentLastModified, readContentFrontMatter };
