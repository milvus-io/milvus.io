import Head from 'next/head';
import type { SchemaObject } from '@/schema/generators';

interface JsonLdProps {
  /** One schema object or several (e.g. Article + BreadcrumbList). */
  schema: SchemaObject | (SchemaObject | null | undefined)[];
}

const serializeJsonLd = (obj: SchemaObject) =>
  JSON.stringify(obj).replace(/</g, '\\u003c');

/**
 * Renders one or more JSON-LD `<script>` tags into the document head.
 * Each object is serialized with JSON.stringify and `<` escaped to `\u003c`
 * so untrusted or CMS/HTML-derived text can never break out of `<script>`.
 */
export default function JsonLd({ schema }: JsonLdProps) {
  const items = (Array.isArray(schema) ? schema : [schema]).filter(
    (obj): obj is SchemaObject => Boolean(obj)
  );

  if (!items.length) return null;

  return (
    <Head>
      {items.map((obj, index) => {
        const type = Array.isArray(obj['@type'])
          ? obj['@type'].join('-')
          : obj['@type'];
        const key = `ld-${type || 'schema'}-${obj['@id'] || index}`;
        return (
          <script
            key={key}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(obj) }}
          />
        );
      })}
    </Head>
  );
}
