import type { NextApiRequest, NextApiResponse } from 'next';
import { generateSimpleFaqList } from '@/http/faq';

const DEFAULT_PAGE_SIZE = 99;

const normalizePageIndex = (
  page: string | string[] | undefined,
  total: number
) => {
  const pageIndex = Number(Array.isArray(page) ? page[0] : page || 1);
  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PAGE_SIZE));

  if (!Number.isFinite(pageIndex) || pageIndex < 1) {
    return 1;
  }

  return Math.min(Math.floor(pageIndex), totalPages);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const keyword = String(req.query.keyword || '').trim().toLowerCase();
    const list = await generateSimpleFaqList();
    const filteredList = keyword
      ? list.filter(item => item.title.toLowerCase().includes(keyword))
      : list;
    const pageIndex = normalizePageIndex(req.query.page, filteredList.length);
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
