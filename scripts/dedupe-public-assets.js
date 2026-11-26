const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const targetDir = process.argv[2] || 'public';

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

if (!fs.existsSync(targetDir)) {
  process.exit(0);
}

const files = walk(targetDir).sort();
const seen = new Map();
let linkedCount = 0;
let savedBytes = 0;

for (const file of files) {
  const stat = fs.lstatSync(file);
  if (!stat.isFile() || stat.size === 0) continue;

  const hash = crypto
    .createHash('sha256')
    .update(fs.readFileSync(file))
    .digest('hex');
  const key = `${stat.size}:${hash}`;
  const canonical = seen.get(key);

  if (!canonical) {
    seen.set(key, { path: file, ino: stat.ino, dev: stat.dev });
    continue;
  }

  if (canonical.dev === stat.dev && canonical.ino === stat.ino) {
    continue;
  }

  // Replace duplicate with a hardlink to the first copy so Docker/OCI tar
  // layers store the payload only once while every URL remains a normal file.
  const tmpPath = `${file}.dedupe.${process.pid}.tmp`;
  fs.linkSync(canonical.path, tmpPath);
  fs.renameSync(tmpPath, file);
  linkedCount += 1;
  savedBytes += stat.size;
}

console.log(
  `[dedupe-public-assets] ${targetDir}: hardlinked ${linkedCount} duplicate files, saved ${(
    savedBytes / 1048576
  ).toFixed(1)} MB`
);
