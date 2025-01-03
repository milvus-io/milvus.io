import Head from 'next/head';
import Layout from '@/components/layout/commonLayout';
import classes from '@/styles/milvusDemos.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import DemoCard from '@/components/card/DemoCard';
import { useState } from 'react';
import { CustomizedContentDialogs } from '@/components/dialog/Dialog';
import { CustomizedSnackbars } from '@/components/snackBar';
import { ABSOLUTE_BASE_URL } from '@/consts';
import {
  DEMO_MULTIMODAL_SEARCH_URL,
  DEMO_HYBRID_SEARCH_URL,
} from '@/consts/externalLinks';
import { useTranslation } from 'react-i18next';
import { InkeepCustomTriggerWrapper } from '@/components/inkeep/inkeepChat';
import CustomButton from '@/components/customButton';

const TITLE = 'Similarity Search Demos Powered by Milvus';
const DESC =
  'Milvus vector database makes it easy to add similarity search to your AI applications. Try demos powered by Milvus and learn how to build them yourself.';

export default function MilvusDemos() {
  const { t } = useTranslation('demo');

  const DEMOS = [
    {
      name: t('demos.multimodal.title'),
      desc: t('demos.multimodal.desc'),
      href: DEMO_MULTIMODAL_SEARCH_URL,
      cover: '/images/demos/multimodal-image-search.png',
      lowerCaseName: 'multimodal image search',
    },
    {
      name: t('demos.imgSearch.title'),
      desc: t('demos.imgSearch.desc'),
      // link: 'http://35.166.123.214:8004/#/',
      href: '/milvus-demos/reverse-image-search',
      cover: '/images/demos/image-search.png',
      videoSrc: 'https://www.youtube.com/watch?v=hkU9hJnhGsU',
      lowerCaseName: 'image search',
    },
    {
      name: t('demos.hybridSearch.title'),
      desc: t('demos.hybridSearch.desc'),
      href: DEMO_HYBRID_SEARCH_URL,
      cover: '/images/demos/hybrid-search.png',
      // videoSrc: 'https://www.youtube.com/watch?v=UvhL2vVZ-f4',
      lowerCaseName: 'hybrid search',
    },
    {
      name: t('demos.askAi.title'),
      desc: t('demos.askAi.desc'),
      cover: '/images/demos/ask-ai.png',
      renderButton1: () => (
        <InkeepCustomTriggerWrapper>
          <CustomButton className="" variant="outlined">
            {t('demos.askAi.ctaLabel1')}
          </CustomButton>
        </InkeepCustomTriggerWrapper>
      ),
      renderButton2: () => (
        <CustomButton
          href="https://zilliz.com/blog/how-inkeep-and-milvus-built-rag-driven-ai-assisstant-for-smarter-interaction"
          variant="text"
        >
          {t('demos.askAi.ctaLabel2')}
        </CustomButton>
      ),
      lowerCaseName: 'ask-ai',
    },
    {
      name: t('demos.chemicalSearch.title'),
      desc: t('demos.chemicalSearch.desc'),
      // href: 'http://molsearch.milvus.io/',
      cover: '/images/demos/chemical-structure-search.png',
      videoSrc: 'https://www.youtube.com/watch?v=4u_RZeMBTNI',
      lowerCaseName: 'chemical',
    },
  ];

  const [dialogConfig, setDialogConfig] = useState({
    open: false,
    title: '',
    content: <></>,
  });

  const [snackbarConfig, setSnackbarConfig] = useState({
    open: false,
    type: 'info',
    message: '',
  });

  const handelOpenDialog = (content: JSX.Element, title: string) => {
    setDialogConfig({
      open: true,
      title,
      content,
    });
  };

  const handleCloseDialog = () => {
    setDialogConfig({
      ...dialogConfig,
      open: false,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarConfig({
      open: false,
      type: 'info',
      message: '',
    });
  };

  return (
    <main>
      <Layout darkMode={true}>
        <Head>
          <title>{TITLE}</title>
          <meta name="description" content={DESC} />
          <link
            rel="alternate"
            href={`${ABSOLUTE_BASE_URL}/milvus-demos`}
            hrefLang="en"
          />
        </Head>

        <section className={classes.headerSection}>
          <div className={clsx(pageClasses.container, classes.innerSection)}>
            <h1 className={classes.title}>{t('title')}</h1>
            <p className={classes.desc}>{t('desc')}</p>
          </div>
        </section>

        <section className={clsx(pageClasses.container, classes.demoContainer)}>
          <ul className={classes.demoList}>
            {DEMOS.map(demo => (
              <li key={demo.name}>
                <DemoCard {...demo} handelOpenDialog={handelOpenDialog} />
              </li>
            ))}
          </ul>
        </section>
      </Layout>
      <CustomizedContentDialogs
        open={dialogConfig.open}
        handleClose={handleCloseDialog}
        title={dialogConfig.title}
        classes={{
          root: classes.dialogRoot,
        }}
      >
        {dialogConfig.content}
      </CustomizedContentDialogs>

      <CustomizedSnackbars
        open={snackbarConfig.open}
        type={snackbarConfig.type}
        message={snackbarConfig.message}
        handleClose={handleCloseSnackbar}
      />
    </main>
  );
}
