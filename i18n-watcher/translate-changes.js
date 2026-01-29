const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const os = require('os');

const { copyEnToBackup } = require('./utils');
const { CHANGES_DIR, LOCALE_DIR } = require('./const');

if (!fs.existsSync(CHANGES_DIR)) {
  fs.mkdirSync(CHANGES_DIR);
}

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: envFile });

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_ENDPOINT = 'https://api.deepl.com';
const TRANSLATE_PATH = '/v2/translate';
const DEEPL_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
};
const SOURCE_LANG = 'EN';

const TARGET_LANGUAGES = [
  'ZH',
  'ZH-HANT',
  'JA',
  'KO',
  'AR',
  'DE',
  'ES',
  'FR',
  'ID',
  'IT',
  'PT',
  'RU',
];

function getTargetPath(targetLang, file) {
  const lang = targetLang === 'ZH' ? 'cn' : targetLang;
  return path.join(LOCALE_DIR, lang.toLowerCase(), file);
}

async function translateText(text, targetLang) {
  try {
    const isArray = Array.isArray(text);
    const texts = isArray ? text : [text];

    const res = await axios.post(
      DEEPL_ENDPOINT + TRANSLATE_PATH,
      {
        text: texts,
        source_lang: SOURCE_LANG,
        target_lang: targetLang.toUpperCase(),
        tag_handling: 'html',
      },
      {
        headers: DEEPL_HEADERS,
      }
    );
    const { translations } = res.data || {};
    return isArray
      ? translations.map(item => item.text)
      : translations.map(item => item.text).join('\n');
  } catch (err) {
    const errorMessage =
      chalk.red('Error translating text: ') +
      `${text} to ${targetLang}, message: ${err.response?.data?.message}`;
    console.error(errorMessage);
    return text;
  }
}

async function processChanges() {
  const files = fs.readdirSync(CHANGES_DIR);
  console.info(chalk.yellow(`Processing ${files.length} change files...`));

  for (const file of files) {
    console.info(chalk.yellow(`Start Processing ${file}...`));
    const changes = JSON.parse(
      fs.readFileSync(path.join(CHANGES_DIR, file), 'utf8')
    );

    for (const targetLang of TARGET_LANGUAGES) {
      const targetPath = getTargetPath(targetLang, file);

      let targetContent = {};
      if (fs.existsSync(targetPath)) {
        targetContent = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
      }

      // handle add and modify
      for (const [key, value] of Object.entries({
        ...changes.added,
        ...changes.modified,
      })) {
        const translated = await translateText(value, targetLang);
        console.info(
          chalk.cyan(`Translate【${value}】to ${targetLang}: ${translated}`)
        );
        const keys = key.split('.');
        let current = targetContent;

        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = translated;
      }

      // handle delete
      for (const key of Object.keys(changes.deleted ?? {})) {
        const keys = key.split('.');
        let current = targetContent;

        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) break;
          current = current[keys[i]];
        }

        delete current[keys[keys.length - 1]];
      }

      // write to file
      fs.writeFileSync(
        targetPath,
        JSON.stringify(targetContent, null, 2) + os.EOL
      );
    }

    // clear changes
    fs.unlinkSync(path.join(CHANGES_DIR, file));
    console.info(chalk.green(`Completed process ${file}.`));
  }

  // update cache
  copyEnToBackup();
  console.info(chalk.green(`Processing completed.`));
}

function bootstrap() {
  try {
    processChanges();
  } catch (err) {
    console.error(err);
  }
}

bootstrap();
