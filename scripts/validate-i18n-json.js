#!/usr/bin/env node
// Every locale bundle is parsed eagerly by src/i18n/<locale>/index.ts, so a
// malformed or missing file breaks the whole locale at build time. This gate
// keeps all locales structurally identical to the English reference bundle.
const fs = require('fs');
const path = require('path');

const i18nDir = path.resolve(__dirname, '../src/i18n');
const referenceLocale = 'en';

const listJsonFiles = locale =>
  fs
    .readdirSync(path.join(i18nDir, locale))
    .filter(file => file.endsWith('.json'))
    .sort();

const locales = fs
  .readdirSync(i18nDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .sort();

const failures = [];
const referenceFiles = listJsonFiles(referenceLocale);

locales.forEach(locale => {
  const files = listJsonFiles(locale);
  if (locale !== referenceLocale && files.join() !== referenceFiles.join()) {
    failures.push(
      `${locale}: locale files differ from ${referenceLocale} (missing: ${
        referenceFiles.filter(file => !files.includes(file)).join(', ') || 'none'
      }; extra: ${files.filter(file => !referenceFiles.includes(file)).join(', ') || 'none'})`
    );
  }
  files.forEach(file => {
    const filePath = path.join(i18nDir, locale, file);
    try {
      const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        failures.push(`${locale}/${file}: expected a JSON object at the top level`);
      }
    } catch (error) {
      failures.push(`${path.relative(process.cwd(), filePath)}: ${error.message}`);
    }
  });
});

if (failures.length) {
  console.error(`i18n JSON validation failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(
  `i18n JSON validation passed: ${locales.length} locales, ${
    locales.length * referenceFiles.length
  } files`
);
