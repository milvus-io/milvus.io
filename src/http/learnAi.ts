import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { ABSOLUTE_BASE_URL } from '@/consts';
import { OriginalLearnAiType, LearnAiDetailType } from '@/types/learnAi';

const LEARN_AI_PATH = 'public/assets';
const LEARN_AI_FILE_NAME = 'learn-ai.csv';

const learnAiCache: LearnAiDetailType[] = [];
const simpleLearnAiCache: Pick<LearnAiDetailType, 'title' | 'url'>[] = [];

const fileBasePath = path.join(process.cwd(), LEARN_AI_PATH);

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

let learnAiPromise: Promise<LearnAiDetailType[]> | null = null;

export const getLearnAiArticles = async (): Promise<LearnAiDetailType[]> => {
  if (learnAiCache.length > 0) {
    return learnAiCache;
  }

  if (learnAiPromise) {
    return learnAiPromise;
  }

  const csvFilePath = path.join(fileBasePath, LEARN_AI_FILE_NAME);

  learnAiPromise = new Promise((resolve, reject) => {
    const stream = fs.createReadStream(csvFilePath);
    const csvParser = csv({
      mapHeaders: ({ header }) => header.trim(),
      separator: ',',
    });

    const cleanup = () => {
      learnAiPromise = null;
      stream.destroy();
      csvParser.destroy();
    };

    const handleData = (row: OriginalLearnAiType) => {
      if (row.id !== undefined) {
        const url = generateSlug(row.title);
        const description = row.content.replace(/[#*`\[\]]/g, '').slice(0, 120);

        learnAiCache.push({
          id: row.id,
          title: row.title,
          content: row.content,
          url,
          description,
          meta_title: row.title,
          meta_description: description,
          meta_keywords: row.meta_keywords || '',
          canonical_rel: `${ABSOLUTE_BASE_URL}/learn-ai-and-vectordb/${url}`,
        });
      }
    };

    const handleEnd = () => {
      cleanup();
      resolve(learnAiCache);
    };

    const handleError = (error: Error) => {
      cleanup();
      reject(error);
    };

    stream
      .pipe(csvParser)
      .on('data', handleData)
      .on('end', handleEnd)
      .on('error', handleError);

    stream.on('error', handleError);
  });

  return learnAiPromise;
};

let simpleLearnAiPromise: Promise<
  Pick<LearnAiDetailType, 'title' | 'url'>[]
> | null = null;

export const generateSimpleLearnAiList = async (): Promise<
  Pick<LearnAiDetailType, 'title' | 'url'>[]
> => {
  if (simpleLearnAiCache.length > 0) {
    return simpleLearnAiCache;
  }

  if (simpleLearnAiPromise) {
    return simpleLearnAiPromise;
  }

  const csvFilePath = path.join(fileBasePath, LEARN_AI_FILE_NAME);

  simpleLearnAiPromise = new Promise((resolve, reject) => {
    const stream = fs.createReadStream(csvFilePath);
    const csvParser = csv({
      mapHeaders: ({ header }) => header.trim(),
      separator: ',',
    });

    const cleanup = () => {
      simpleLearnAiPromise = null;
      stream.destroy();
      csvParser.destroy();
    };

    const handleData = (row: OriginalLearnAiType) => {
      if (row.id !== undefined) {
        simpleLearnAiCache.push({
          title: row.title,
          url: generateSlug(row.title),
        });
      }
    };

    const handleEnd = () => {
      cleanup();
      resolve(simpleLearnAiCache);
    };

    const handleError = (error: Error) => {
      cleanup();
      reject(error);
    };

    stream
      .pipe(csvParser)
      .on('data', handleData)
      .on('end', handleEnd)
      .on('error', handleError);

    stream.on('error', handleError);
  });

  return simpleLearnAiPromise;
};

export const getLearnAiById = async (
  url: string
): Promise<{
  list: LearnAiDetailType[];
  item: LearnAiDetailType;
}> => {
  const articles = await getLearnAiArticles();
  let curIndex = 0;

  const target = articles.find((article, index) => {
    if (article.url === url) {
      curIndex = index;
      return true;
    }
    return false;
  });

  if (!target) {
    throw new Error(`Learn AI article with URL ${url} not found`);
  }

  return {
    list: articles,
    item: { ...target, curIndex },
  };
};
