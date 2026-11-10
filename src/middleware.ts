import { NextRequest, NextResponse } from 'next/server';

// Keep old bookmarks, API calls and cached client navigation from reviving
// the deleted collections. This also applies when Next runs without Nginx.
export function middleware(request: NextRequest) {
  const api = /\/api\/(?:ai-quick-reference|learn-ai-and-vectordb)(?:\/|$)/i.test(request.nextUrl.pathname);
  return new NextResponse(
    api
      ? JSON.stringify({ message: 'This section has been permanently removed.' })
      : '<!doctype html><html lang="en"><head><meta name="robots" content="noindex"><title>410 Gone | Milvus</title></head><body><main><h1>410 Gone</h1><p>This section has been permanently removed.</p><p><a href="https://milvus.io/docs">Milvus documentation</a></p></main></body></html>',
    {
      status: 410,
      headers: {
        'Content-Type': api ? 'application/json; charset=utf-8' : 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex',
        'Cache-Control': 'public, max-age=300',
      },
    }
  );
}

export const config = {
  matcher: [
    '/ai-quick-reference/:path*',
    '/:lang(en|zh-hant|zh|ja|jp|fr|ko|ru|de|es|pt|it|ar|id|cn)/ai-quick-reference/:path*',
    '/api/ai-quick-reference/:path*',
    '/:lang(en|zh-hant|zh|ja|jp|fr|ko|ru|de|es|pt|it|ar|id|cn)/api/ai-quick-reference/:path*',
    '/images/ai-reference/:path*',
    '/:lang(en|zh-hant|zh|ja|jp|fr|ko|ru|de|es|pt|it|ar|id|cn)/images/ai-reference/:path*',
    '/assets/milvus-faq.csv',
    '/learn-ai-and-vectordb/:path*',
    '/:lang(en|zh-hant|zh|ja|jp|fr|ko|ru|de|es|pt|it|ar|id|cn)/learn-ai-and-vectordb/:path*',
    '/api/learn-ai-and-vectordb/:path*',
    '/:lang(en|zh-hant|zh|ja|jp|fr|ko|ru|de|es|pt|it|ar|id|cn)/api/learn-ai-and-vectordb/:path*',
    '/assets/learn-ai.csv',
  ],
};
