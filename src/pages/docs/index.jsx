import docUtils from '@/utils/docs.utils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import classes from '@/styles/docs.module.less';
import clsx from 'clsx';
import Header from '@/components/header';
import pageClasses from '@/styles/responsive.module.less';

import Head from 'next/head';
const TITLE = 'Milvus vector database documentation';

export default function DocHomePage(props) {
  const { newestVersion } = props;
  const router = useRouter();

  useEffect(() => {
    router.push(`/docs/${newestVersion}/home`);
  }, []);

  return (
    <main>
      <Head>
        <title>{TITLE}</title>
        <meta type="description" content=""></meta>
        <meta property="og:title" content={TITLE}></meta>
        <meta property="og:description" content="" />
        <meta property="og:url" content="https://milvus.io/docs" />
      </Head>
      <Header />
      <p className={clsx(pageClasses.container, classes.prompt)}>
        redirecting to newest version...
      </p>
    </main>
  );
}

export const getStaticProps = async () => {
  const { newestVersion } = docUtils.getVersion();

  return {
    props: {
      newestVersion,
    },
  };
};
