import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const ALLOWED_BOTS = [
  /Googlebot/i,
  /Bingbot/i,
  /DuckDuckBot/i,
  /BaiduSpider/i,
  /YandexBot/i,
  /Slurp/i,
  /Applebot/i,
  /FacebookExternalHit/i,
  /Twitterbot/i,
  /LinkedInBot/i,
  /WhatsApp/i,
  /TelegramBot/i,
  /Slackbot/i,
  /PetalBot/i,
  /Sogou/i,
  /360Spider/i,
  /YisouSpider/i,
  /Bytespider/i,
  /archive\.org_bot/i,
  /ia_archiver/i,
  /SemrushBot/i,
  /AhrefsBot/i,
  /DotBot/i,
  /MJ12bot/i,
];

const BLOCKED_UA = [
  /HeadlessChrome/i,
  /node-fetch/i,
  /Go-http-client/i,
  /curl/i,
  /wget/i,
  /python/i,
  /axios/i,
  /Java\//i,
  /PHP/i,
  /Ruby/i,
  /httpclient/i,
];

const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /fetcher/i,
  /harvester/i,
  /collector/i,
];

const JS_CHALLENGE_COOKIE_NAME = 'milvus_challenge';
const JS_CHALLENGE_COOKIE_MAX_AGE = 3600;

function generateChallengeToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const ua = request.headers.get('user-agent') || '';

  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  if (BLOCKED_UA.some(r => r.test(ua))) {
    return new NextResponse('Blocked User-Agent', { status: 403 });
  }

  if (ALLOWED_BOTS.some(r => r.test(ua))) {
    return NextResponse.next();
  }

  if (BOT_PATTERNS.some(r => r.test(ua))) {
    return new NextResponse('Bot not allowed', { status: 403 });
  }

  const cookie = request.cookies.get(JS_CHALLENGE_COOKIE_NAME);

  if (!cookie || !cookie.value || cookie.value.length < 10) {
    const token = generateChallengeToken();
    const response = NextResponse.next();
    response.cookies.set(JS_CHALLENGE_COOKIE_NAME, token, {
      path: '/',
      maxAge: JS_CHALLENGE_COOKIE_MAX_AGE,
      sameSite: 'lax',
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)', { source: '/' }],
};
