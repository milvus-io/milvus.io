import type { NextApiRequest, NextApiResponse } from 'next';
import { generateSimpleFaqList } from '@/http/faq';
import { referencePageIndex } from '@/utils/ai-reference-query';
import topics from '../../../content/ai-quick-reference/topics.json';
import { AI_REFERENCE_PAGE_SIZE as DEFAULT_PAGE_SIZE } from '@/consts/faq';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // JSON listings are navigation data, not search landing pages.
    res.setHeader('X-Robots-Tag', 'noindex, follow');
    if (['topic', 'keyword'].some(key => req.query[key] !== undefined && typeof req.query[key] !== 'string')) {
      return res.status(400).json({ message: 'Invalid reference filter' });
    }
    const keyword = String(req.query.keyword || '')
      .trim()
      .toLowerCase();
    const topic = String(req.query.topic || '');
    if (topic && !topics.some(item => item.id === topic)) {
      return res.status(400).json({ message: 'Unknown reference topic' });
    }
    const list = await generateSimpleFaqList();
    const filteredList = list.filter(
      item =>
        (!topic || item.topic === topic) &&
        (!keyword || item.title.toLowerCase().includes(keyword))
    );
    const pageIndex = referencePageIndex(req.query.page, filteredList.length, DEFAULT_PAGE_SIZE);
    if (pageIndex === null) return res.status(400).json({ message: 'Invalid reference page' });
    const start = DEFAULT_PAGE_SIZE * (pageIndex - 1);

    res.setHeader(
      'Cache-Control',
      keyword
        ? 'public, s-maxage=3600, stale-while-revalidate=86400'
        : 'public, s-maxage=86400, stale-while-revalidate=604800'
    );
    res.status(200).json({
      list: filteredList.slice(start, start + DEFAULT_PAGE_SIZE),
      total: filteredList.length,
      pageIndex,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load AI Quick Reference list' });
  }
}
