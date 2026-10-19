import { ABSOLUTE_BASE_URL } from '@/consts';
import {
  OriginalFAQDetailType,
  FAQDetailType,
  DemoTypeEnum,
} from '@/types/faq';
import {
  loadPublishedFaqRows,
  publication,
} from '@/server/ai-reference-catalog';

let faqPromise: Promise<FAQDetailType[]> | null = null;

export const getFAQs = (): Promise<FAQDetailType[]> => {
  if (!faqPromise) {
    faqPromise = loadPublishedFaqRows()
      .then((rows: OriginalFAQDetailType[]) =>
        rows
          .map(row => ({
            id: row.URL,
            title: row.Questions,
            content: row.Answers,
            url: row.URL,
            topic: publication[row.URL].topic,
            description: row.Answers.slice(0, 120),
            canonical_rel: `${ABSOLUTE_BASE_URL}/ai-quick-reference/${row.URL}`,
            demo: (row.Demo?.match(/'([^']*)'/g)?.[0]?.slice(1, -1) ||
              '') as DemoTypeEnum,
            demoDescription: row.Demo_description || '',
          }))
          .sort(
            (a, b) =>
              Number(publication[b.url].status === 'source-checked') -
              Number(publication[a.url].status === 'source-checked')
          )
      )
      .catch((error: Error) => {
        faqPromise = null;
        throw error;
      });
  }
  return faqPromise!;
};

export const generateSimpleFaqList = async (): Promise<
  Pick<FAQDetailType, 'title' | 'url' | 'topic'>[]
> => (await getFAQs()).map(({ title, url, topic }) => ({ title, url, topic }));

export const getFAQById = async (
  url: string
): Promise<{
  list: FAQDetailType[];
  item: FAQDetailType;
}> => {
  const faqs = await getFAQs();
  const curIndex = faqs.findIndex(faq => faq.url === url);
  if (curIndex < 0) throw new Error(`FAQ with URL ${url} not found`);
  return { list: faqs, item: { ...faqs[curIndex], curIndex } };
};
