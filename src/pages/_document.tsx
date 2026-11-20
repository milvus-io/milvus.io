import { Html, Head, Main, NextScript } from 'next/document';
import { getFallbackResources, resources } from '@/i18n/server';
import { getTextDirection } from '@/types/localization';

// Common layout includes the footer newsletter, whose title lives in home.
const layoutNamespaces = ['common', 'header', 'home'];

const routeNamespaces: [RegExp, string[]][] = [
  [/^\/$/, []],
  [/^\/docs(?:\/|$)/, ['docs', 'llm']],
  [/^\/blog(?:\/|$)/, ['blog', 'llm']],
  [/^\/learn-milvus(?:\/|$)/, ['learnMilvus']],
  [/^\/tools\/sizing(?:-|\/|$)/, ['sizingTool']],
  [/^\/intro$/, ['intro']],
  [/^\/use-cases$/, ['useCase']],
  [/^\/milvus-demos(?:\/|$)/, ['demo']],
  [/^\/community$/, ['community']],
  [/^\/contact$/, ['contact']],
  [/^\/(?:404|error|_error)$/, ['notFound']],
  [/^\/(?:solutions|compare|bootcamp)(?:\/|$)/, []],
  [/^\/api-reference(?:\/|$)/, ['docs']],
];

export function getRouteNamespaces(page = ''): string[] | undefined {
  const route = page.replace(/^\/\[lang\](?=\/|$)/, '') || '/';
  const match = routeNamespaces.find(([pattern]) => pattern.test(route));
  return match && [...layoutNamespaces, ...match[1]];
}

export function sliceNamespaces<T extends Record<string, unknown>>(
  resources: T,
  namespaces?: readonly string[]
) {
  return namespaces
    ? Object.fromEntries(Object.entries(resources).filter(([name]) => namespaces.includes(name)))
    : resources;
}

export default function Document(props) {
  const pageProps = props.__NEXT_DATA__.props.pageProps || {};
  const lang = pageProps.lang || pageProps.locale || 'en';
  const namespaces = getRouteNamespaces(props.__NEXT_DATA__.page);
  const i18nResources = sliceNamespaces(resources[lang] || resources.en, namespaces);
  // Only the English keys this locale lacks — see getFallbackResources.
  const i18nFallback = resources[lang] ? getFallbackResources(lang, namespaces) : null;
  return (
    <Html lang={lang} dir={getTextDirection(lang)}>
      <Head>
        <link
          rel="preload"
          href="/fonts/geist/geist-v5-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/geist/geist-mono-v5-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__I18N_RESOURCES__=${JSON.stringify({
              [lang]: i18nResources,
            }).replace(/</g, '\\u003c')};window.__I18N_FALLBACK_RESOURCES__=${JSON.stringify(
              i18nFallback ?? null
            ).replace(/</g, '\\u003c')};window.__I18N_PARTIAL__=${!!namespaces};`,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
