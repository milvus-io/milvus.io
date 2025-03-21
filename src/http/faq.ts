import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { ABSOLUTE_BASE_URL } from '@/consts';

interface OriginalFAQDetailType {
  Order: number;
  Questions: string;
  Answers: string;
  URL: string;
  Meta_title: string;
}

export interface FAQDetailType {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  canonical_rel: string;
}

const FAQ_PATH = 'public/assets';
const FAQ_FILE_NAME = 'Milvus FAQ - Milvus FAQ.csv';

const faqCache: FAQDetailType[] = [];
const simpleFaqCache: Pick<FAQDetailType, 'title' | 'url'>[] = [];

const fileBasePath = path.join(process.cwd(), FAQ_PATH);

export const getFAQs = async (): Promise<FAQDetailType[]> => {
  if (faqCache.length > 0) {
    return faqCache;
  }
  const csvFilePath = path.join(fileBasePath, FAQ_FILE_NAME);
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(
        csv({
          mapHeaders: ({ header }) => header.trim(),
          separator: ',',
        })
      )
      .on('data', (row: OriginalFAQDetailType) => {
        if (row.Order !== undefined) {
          faqCache.push({
            id: row.URL,
            title: row.Questions,
            content: row.Answers,
            url: row.URL,
            description: row.Answers.slice(0, 120),
            canonical_rel: `${ABSOLUTE_BASE_URL}/ai-quick-reference/${row.URL}`,
          });
        }
      })
      .on('end', () => {
        resolve(faqCache);
      })
      .on('error', error => {
        reject(error);
      });
  });
};

export const generateSimpleFaqList = async (): Promise<
  Pick<FAQDetailType, 'title' | 'url'>[]
> => {
  if (simpleFaqCache.length > 0) {
    return simpleFaqCache;
  }
  const csvFilePath = path.join(fileBasePath, FAQ_FILE_NAME);
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(
        csv({
          mapHeaders: ({ header }) => header.trim(),
          separator: ',',
        })
      )
      .on('data', (row: OriginalFAQDetailType) => {
        if (row.Order !== undefined) {
          simpleFaqCache.push({
            title: row.Questions,
            url: row.URL,
          });
        }
      })
      .on('end', () => {
        resolve(simpleFaqCache);
      })
      .on('error', error => {
        reject(error);
      });
  });
};

export const getFAQById = async (
  url: string
): Promise<FAQDetailType | null> => {
  const faqs = await getFAQs();
  let target: FAQDetailType | null = null;

  faqs.forEach((faq, index) => {
    if (faq.url === url) {
      target = faq;
    }
  });

  return target ? { ...(target as FAQDetailType) } : null;
};
