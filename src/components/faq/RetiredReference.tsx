import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/commonLayout';
import classes from '@/styles/faq.module.css';

export default function RetiredReference() {
  return (
    <Layout disableSelfHreflang>
      <Head>
        <title>Article retired | Milvus AI Reference</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className={classes.retiredReference}>
        <p className={classes.retiredLabel}>AI REFERENCE · 404</p>
        <h1>This article has been retired</h1>
        <p>
          We have reorganized our reference around vector databases, retrieval,
          and practical Milvus workflows. This article is no longer available.
          Explore the curated collection or continue with a hands-on guide.
        </p>
        <nav aria-label="Continue learning">
          <Link href="/ai-quick-reference">Browse AI Reference</Link>
          <Link href="/docs/quickstart.md">Start with Milvus</Link>
          <Link href="/docs">Explore documentation</Link>
        </nav>
      </main>
    </Layout>
  );
}
