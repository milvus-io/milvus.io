const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const matter = require('gray-matter');
const publication = require('../../content/ai-quick-reference/publication.json');
const topics = require('../../content/ai-quick-reference/topics.json');

function contentHash(row) {
  const fields = [row.Questions, row.Answers, row.Tag];
  if (row.Demo || row.Demo_description) {
    fields.push(row.Demo, row.Demo_description);
  }
  return createHash('sha256').update(fields.join('\n')).digest('hex');
}

function validateRows(rows, catalog = publication) {
  const seen = new Set();
  const topicIds = new Set(topics.map(topic => topic.id));
  for (const row of rows) {
    const slug = row.URL;
    if (!slug || !row.Questions?.trim() || !row.Answers?.trim()) {
      throw new Error(`Empty AI reference fields: ${slug || '(missing URL)'}`);
    }
    if (seen.has(slug)) throw new Error(`Duplicate AI reference URL: ${slug}`);
    seen.add(slug);
    const record = catalog[slug];
    if (!record || record.status !== 'source-checked') {
      throw new Error(`Unapproved or retired AI reference URL: ${slug}`);
    }
    if (!topicIds.has(record.topic) || row.Tag !== record.topic) {
      throw new Error(`Invalid AI reference publication record: ${slug}`);
    }
    if (/contentReference\[|oaicite|\uE200cite\uE202/.test(row.Answers)) {
      throw new Error(`Unresolved AI reference citation: ${slug}`);
    }
    if (
      (row.Demo || row.Demo_description) &&
      (!['RAG', 'hybrid search', 'multimodal image search'].includes(row.Demo) ||
        typeof row.Demo_description !== 'string' ||
        !row.Demo_description.trim())
    ) {
      throw new Error(`Invalid AI reference demo metadata: ${slug}`);
    }
    if (record.sha256 !== contentHash(row)) {
      throw new Error(`AI reference content changed without review: ${slug}`);
    }
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(record.checkedAt || '') ||
      !Array.isArray(record.sources) ||
      !record.sources.length ||
      record.sources.some(
        source =>
          !/^https:\/\//.test(source) || !row.Answers.includes(`](${source})`)
      )
    ) {
      throw new Error(`Missing AI reference source evidence: ${slug}`);
    }
    for (const match of row.Answers.matchAll(
      /\]\(\/ai-quick-reference\/([^)#?]+)[^)]*\)/g
    )) {
      if (catalog[match[1]]?.status !== 'source-checked') {
        throw new Error(
          `AI reference links to a non-canonical page: ${slug} -> ${match[1]}`
        );
      }
    }
  }
  for (const [slug, record] of Object.entries(catalog)) {
    if (record.status === 'source-checked' && !seen.has(slug)) {
      throw new Error(`Published AI reference missing from content: ${slug}`);
    }
    if (
      record.status === 'merged' &&
      catalog[record.target]?.status !== 'source-checked'
    ) {
      throw new Error(`AI reference merge target is not canonical: ${slug}`);
    }
  }
  return rows;
}

let pending;
function loadPublishedFaqRows() {
  if (!pending) {
    pending = Promise.resolve()
      .then(() => {
        if (
          fs.existsSync(
            path.join(process.cwd(), 'public/assets/milvus-faq.csv')
          )
        ) {
          throw new Error('Legacy AI reference CSV must not be republished');
        }
        const directory = path.join(
          process.cwd(),
          'content/ai-quick-reference/pages'
        );
        const rows = fs
          .readdirSync(directory)
          .filter(file => file.endsWith('.md'))
          .map(file => {
            const { data, content } = matter(
              fs.readFileSync(path.join(directory, file), 'utf8')
            );
            if (publication[data.slug]?.file !== file) {
              throw new Error(`Unapproved AI reference content file: ${file}`);
            }
            return {
              Order: data.order,
              URL: data.slug,
              Questions: data.title,
              Answers: content.trim() + '\n',
              Tag: data.topic,
              Demo: data.demo ?? '',
              Demo_description: data.demoDescription ?? '',
            };
          })
          .sort((a, b) => a.Order - b.Order);
        return validateRows(rows);
      })
      .catch(error => {
        pending = undefined;
        throw error;
      });
  }
  return pending;
}

function selectRelated(items, slug, topic, limit = 4) {
  const related = publication[slug]?.related || [];
  return related
    .map(url => items.find(item => item.url === url))
    .filter(Boolean)
    .slice(0, limit);
}

module.exports = {
  publication,
  topics,
  contentHash,
  validateRows,
  loadPublishedFaqRows,
  selectRelated,
};
