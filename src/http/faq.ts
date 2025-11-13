import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { ABSOLUTE_BASE_URL } from '@/consts';
import {
  OriginalFAQDetailType,
  FAQDetailType,
  DemoTypeEnum,
} from '@/types/faq';

const FAQ_PATH = 'public/assets';
const FAQ_FILE_NAME = 'Milvus FAQ - Milvus FAQ.csv';

const faqCache: FAQDetailType[] = [];
const simpleFaqCache: Pick<FAQDetailType, 'title' | 'url'>[] = [];

const fileBasePath = path.join(process.cwd(), FAQ_PATH);

let faqPromise: Promise<FAQDetailType[]> | null = null;

export const getFAQs = async (): Promise<FAQDetailType[]> => {
  if (faqCache.length > 0) {
    return faqCache;
  }

  if (faqPromise) {
    return faqPromise;
  }

  const csvFilePath = path.join(fileBasePath, FAQ_FILE_NAME);

  faqPromise = new Promise((resolve, reject) => {
    const stream = fs.createReadStream(csvFilePath);
    const csvParser = csv({
      mapHeaders: ({ header }) => header.trim(),
      separator: ',',
    });

    const cleanup = () => {
      faqPromise = null;
      stream.destroy();
      csvParser.destroy();
    };

    const handleData = (row: OriginalFAQDetailType) => {
      if (row.Order !== undefined) {
        faqCache.push({
          id: row.URL,
          title: row.Questions,
          content: row.Answers,
          url: row.URL,
          description: row.Answers.slice(0, 120),
          canonical_rel: `${ABSOLUTE_BASE_URL}/ai-quick-reference/${row.URL}`,
          demo: (row.Demo?.match(/'([^']*)'/g)?.[0]?.slice(1, -1) ||
            '') as DemoTypeEnum,
          demoDescription: row.Demo_description || '',
        });
      }
    };

    const handleEnd = () => {
      cleanup();
      resolve(faqCache);
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

  return faqPromise;
};

let simpleFaqPromise: Promise<Pick<FAQDetailType, 'title' | 'url'>[]> | null =
  null;

export const generateSimpleFaqList = async (): Promise<
  Pick<FAQDetailType, 'title' | 'url'>[]
> => {
  if (simpleFaqCache.length > 0) {
    return simpleFaqCache;
  }

  if (simpleFaqPromise) {
    return simpleFaqPromise;
  }

  const csvFilePath = path.join(fileBasePath, FAQ_FILE_NAME);

  simpleFaqPromise = new Promise((resolve, reject) => {
    const stream = fs.createReadStream(csvFilePath);
    const csvParser = csv({
      mapHeaders: ({ header }) => header.trim(),
      separator: ',',
    });

    const cleanup = () => {
      simpleFaqPromise = null;
      stream.destroy();
      csvParser.destroy();
    };

    const handleData = (row: OriginalFAQDetailType) => {
      if (row.Order !== undefined) {
        simpleFaqCache.push({
          title: row.Questions,
          url: row.URL,
        });
      }
    };

    const handleEnd = () => {
      cleanup();
      resolve(simpleFaqCache);
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

  return simpleFaqPromise;
};

export const getFAQById = async (
  url: string
): Promise<{
  list: FAQDetailType[];
  item: FAQDetailType;
}> => {
  const faqs = await getFAQs();
  let curIndex = 0;

  const target = faqs.find((faq, index) => {
    if (faq.url === url) {
      curIndex = index;
      return true;
    }
    return false;
  });

  if (!target) {
    throw new Error(`FAQ with URL ${url} not found`);
  }

  return {
    list: faqs,
    item: { ...(target as FAQDetailType), curIndex },
  };
};
