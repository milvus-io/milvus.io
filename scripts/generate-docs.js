const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getIndexTemplate = (
  version,
  lang
) => `import { LanguageEnum } from '@/types/localization';
import { createDocHomeProps } from '@/components/localization/CreateDocHomeProps';
import { DocHomepage } from '@/components/localization/DocHome';

export default DocHomepage;

export const getStaticProps = async () => {
  const getPageStaticProps = createDocHomeProps(${lang}, '${version}');
  return getPageStaticProps();
};
`;

const getDetailTemplate = (
  version,
  lang
) => `import { GetStaticProps } from 'next';
import { LanguageEnum } from '@/types/localization';
import { DocDetailPage } from '@/components/localization/DocDetail';
import { createDocDetailProps } from '@/components/localization/CreateDocDetailProps';

export default DocDetailPage;

export const getStaticPaths = () => {
  const { getPageStaticPaths } = createDocDetailProps(
    ${lang},
    '${version}'
  );
  return getPageStaticPaths();
};

export const getStaticProps: GetStaticProps = async context => {
  const { getPageStaticProps } = createDocDetailProps(
    ${lang},
    '${version}'
  );
  return getPageStaticProps(context);
};
`;

async function generateDocs() {
  try {
    // input docs version
    const version = await new Promise(resolve => {
      rl.question('Please input new docs version: ', answer => {
        resolve(answer.trim());
      });
    });

    if (!version) {
      throw new Error('Version cannot be empty!');
    }

    const docsDir = path.join(process.cwd(), 'src', 'pages', 'docs', version);
    const arDocsDir = path.join(
      process.cwd(),
      'src',
      'pages',
      'docs',
      'ar',
      version
    );
    const deDocsDir = path.join(
      process.cwd(),
      'src',
      'pages',
      'docs',
      'de',
      version
    );
    const esDocsDir = path.join(
      process.cwd(),
      'src',
      'pages',
      'docs',
      'es',
      version
    );
    const frDocsDir = path.join(
      process.cwd(),
      'src',
      'pages',
      'docs',
      'fr',
      version
    );
    const idDocsDir = path.join(
      process.cwd(),
      'src',
      'pages',
      'docs',
      'id',
      version
    );
    const itDocsDir = path.join(
      process.cwd(),
      'src',
      'pages',
      'docs',
      'it',
      version
    );
    const jaDocsDir = path.join(
      process.cwd(),
      'src',
      'pages',
      'docs',
      'ja',
      version
    );
    const koDocsDir = path.join(
      process.cwd(),
      'src',
      'pages',
      'docs',
      'ko',
      version
    );
    const ptDocsDir = path.join(
      process.cwd(),
      'src',
      'pages',
      'docs',
      'pt',
      version
    );
    const ruDocsDir = path.join(
      process.cwd(),
      'src',
      'pages',
      'docs',
      'ru',
      version
    );
    const zhDocsDir = path.join(
      process.cwd(),
      'src',
      'pages',
      'docs',
      'zh',
      version
    );
    const zhHantDocsDir = path.join(
      process.cwd(),
      'src',
      'pages',
      'docs',
      'zh-hant',
      version
    );

    const dirs = [
      docsDir,
      arDocsDir,
      deDocsDir,
      esDocsDir,
      frDocsDir,
      idDocsDir,
      itDocsDir,
      jaDocsDir,
      koDocsDir,
      ptDocsDir,
      ruDocsDir,
      zhDocsDir,
      zhHantDocsDir,
    ];

    const langs = [
      'LanguageEnum.ENGLISH',
      'LanguageEnum.ARABIC',
      'LanguageEnum.GERMAN',
      'LanguageEnum.SPANISH',
      'LanguageEnum.FRANCE',
      'LanguageEnum.INDONESIAN',
      'LanguageEnum.ITALIAN',
      'LanguageEnum.JAPANESE',
      'LanguageEnum.KOREAN',
      'LanguageEnum.PORTUGUESE',
      'LanguageEnum.RUSSIAN',
      'LanguageEnum.CHINESE',
      'LanguageEnum.CHINESE_TW',
    ];

    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      const lang = langs[i];

      if (!fs.existsSync(dir)) {
        // Create dir
        fs.mkdirSync(dir, { recursive: true });
      }

      // Create index.tsx
      const indexTemplate = getIndexTemplate(version, lang);
      fs.writeFileSync(path.join(dir, 'index.tsx'), indexTemplate);
      // Create [id].tsx
      const detailTemplate = getDetailTemplate(version, lang);
      fs.writeFileSync(path.join(dir, '[id].tsx'), detailTemplate);
    }

    console.log(
      `Successfully created the document directory and files for version ${version}!`
    );
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    rl.close();
  }
}

generateDocs();
