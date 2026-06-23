import Head from 'next/head';
import { ABSOLUTE_BASE_URL } from '@/consts';
import { buildSchema } from '@/schema';

export interface FaqItem {
  question: string;
  answer: string;
}

interface LearnMilvusSeoProps {
  /** Page path, e.g. "/learn-milvus/hnsw" */
  path: string;
  /** Meta / og title */
  title: string;
  description: string;
  /** Short page name used in the breadcrumb trail */
  breadcrumbName?: string;
  /** Absolute or site-relative og:image; falls back to the global default */
  ogImage?: string;
  faq?: FaqItem[];
}

const LEARN_MILVUS_PATH = '/learn-milvus';

export default function LearnMilvusSeo(props: LearnMilvusSeoProps) {
  const { path, title, description, breadcrumbName, ogImage, faq } = props;

  const url = `${ABSOLUTE_BASE_URL}${path}`;
  const imageUrl = ogImage
    ? ogImage.startsWith('http')
      ? ogImage
      : `${ABSOLUTE_BASE_URL}${ogImage}`
    : undefined;

  const breadcrumbItems = [
    { name: 'Home', url: ABSOLUTE_BASE_URL },
    { name: 'Learn Milvus', url: `${ABSOLUTE_BASE_URL}${LEARN_MILVUS_PATH}` },
  ];
  if (path !== LEARN_MILVUS_PATH && breadcrumbName) {
    breadcrumbItems.push({ name: breadcrumbName, url });
  }

  const learningResourceLd = {
    '@context': 'https://schema.org',
    '@type': ['WebPage', 'LearningResource'],
    name: title,
    description,
    url,
    learningResourceType: 'Interactive visualization',
    ...(imageUrl ? { image: imageUrl } : {}),
    isPartOf: {
      '@type': 'WebSite',
      name: 'Milvus',
      url: ABSOLUTE_BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Milvus',
      url: ABSOLUTE_BASE_URL,
    },
  };

  const breadcrumbLd = buildSchema('breadcrumb', breadcrumbItems);

  const faqLd = faq?.length
    ? buildSchema('faq', {
        absoluteUrl: url,
        faqItems: faq.map(item => ({
          question: item.question,
          answerPlainText: item.answer,
        })),
      })
    : null;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {/* key matches _app.tsx so the page-level value replaces the global default */}
      <meta property="og:type" content="article" key="og-type" />
      {imageUrl && (
        <meta
          name="image"
          property="og:image"
          content={imageUrl}
          key="og-image"
        />
      )}
      <meta
        name="twitter:card"
        content={imageUrl ? 'summary_large_image' : 'summary'}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
    </Head>
  );
}
