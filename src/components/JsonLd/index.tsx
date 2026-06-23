import Head from 'next/head';
import type { SchemaObject } from '@/schema/generators';

interface JsonLdProps {
  /** One schema object or several (e.g. Article + BreadcrumbList). */
  schema: SchemaObject | (SchemaObject | null | undefined)[];
}

/**
 * Renders one or more JSON-LD `<script>` tags into the document head.
 * Each object is serialized with JSON.stringify (never hand-built strings)
 * and gets a stable key so Next.js's <Head> de-dupes correctly across pages.
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
            dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
          />
        );
      })}
    </Head>
  );
}
