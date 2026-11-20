import type { NextApiRequest, NextApiResponse } from 'next';
import { resolveMarkdown } from '../../../server/markdown-negotiation';

export default function markdown(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Vary', 'Accept');
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).end();
  }

  const parts = req.query.path;
  const result = Array.isArray(parts) && resolveMarkdown(parts);
  if (!result) return res.status(404).end();

  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Link', `<${result.canonical}>; rel="canonical"`);
  return res.status(200).send(result.body);
}
