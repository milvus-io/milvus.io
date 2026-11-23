const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const { dirname, join, resolve } = require('node:path');
const { DATE_INDEX_PATH } = require('../src/server/content-freshness');

const sources = {
  'src/docs': [
    ':(glob)localization/**/site/**/*.md',
    ':(glob)API_Reference/**/*.md',
    ':(glob)API_Reference/**/*.mdx',
    ':(glob)API_Reference/**/*.html',
    ':(glob)API_Reference_MDX/**/*.mdx',
  ],
  'src/blogs': [':(glob)blog/en/*.md', ':(glob)localization/blog/*/*.md'],
};

function indexRepository(repo, pathspecs) {
  const cwd = join(process.cwd(), repo);
  if (!fs.existsSync(join(cwd, '.git'))) return;

  const status = spawnSync('git', ['rev-parse', '--show-prefix', '--git-path', 'shallow'], {
    cwd,
    encoding: 'utf8',
  });
  // Docker builds reuse the index generated on the host. Submodule .git
  // pointers in the build context cannot resolve to the host's Git data.
  if (status.status !== 0 || !status.stdout.startsWith('\n')) return;

  const shallowPath = resolve(cwd, status.stdout.trim());
  const shallowCommits = new Set(fs.existsSync(shallowPath)
    ? fs.readFileSync(shallowPath, 'utf8').trim().split('\n')
    : []);
  const history = execFileSync('git', [
    'log', '--first-parent', '--diff-merges=first-parent', '--no-renames',
    '--diff-filter=AMT', '--format=%x00%H %cI', '--name-only', '-z',
    '--', ...pathspecs,
  ], { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

  const dates = new Map();
  const fields = history.split('\0');
  let date;
  for (let i = 0; i < fields.length; i += 1) {
    if (fields[i] === '') {
      const [commit, timestamp] = (fields[++i] || '').split(' ');
      // A shallow boundary looks like a root commit that changed every file.
      date = timestamp && !shallowCommits.has(commit)
        ? new Date(timestamp).toISOString()
        : undefined;
      continue;
    }

    const file = fields[i].replace(/^\n/, '');
    if (date && !dates.has(file) && fs.existsSync(join(cwd, file))) {
      dates.set(file, date);
    }
  }

  return dates;
}

const indexed = Object.entries(sources).map(([repo, paths]) => [repo, indexRepository(repo, paths)]);
if (process.argv.includes('--require-history')) {
  const missing = indexed.filter(([, dates]) => !dates?.size).map(([repo]) => repo);
  if (missing.length) {
    throw new Error(`No usable Git modification dates in ${missing.join(', ')}`);
  }
}

if (indexed.some(([, dates]) => dates)) {
  const index = fs.existsSync(DATE_INDEX_PATH)
    ? JSON.parse(fs.readFileSync(DATE_INDEX_PATH, 'utf8'))
    : {};
  for (const [repo, dates] of indexed) {
    if (!dates) continue;
    for (const file of Object.keys(index)) {
      if (file.startsWith(`${repo}/`)) delete index[file];
    }
    for (const [file, date] of dates) index[`${repo}/${file}`] = date;
    console.log(`[content-freshness] Indexed ${dates.size} files in ${repo}`);
  }
  fs.mkdirSync(dirname(DATE_INDEX_PATH), { recursive: true });
  fs.writeFileSync(DATE_INDEX_PATH, `${JSON.stringify(index)}\n`);
} else if (!fs.existsSync(DATE_INDEX_PATH)) {
  console.warn('[content-freshness] Git history and date index unavailable. Using frontmatter dates.');
}
