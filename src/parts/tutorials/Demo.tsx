import Head from 'next/head';
import Layout from '@/components/layout/commonLayout';
import classes from '@/styles/milvusDemos.module.css';
import pageClasses from '@/styles/responsive.module.css';
import clsx from 'clsx';
import DemoCard from '@/components/card/DemoCard';
import { useState } from 'react';
import { CustomizedContentDialogs } from '@/components/dialog/Dialog';
import { CustomizedSnackbars } from '@/components/snackBar';
import { GET_START_LINK } from '@/consts/links';
import { CLOUD_SIGNUP_LINK } from '@/consts/links';
import {
  DEMO_MULTIMODAL_SEARCH_URL,
  DEMO_FUNCTION_CHAIN_RERANK_URL,
  DEMO_FUNCTION_CHAIN_RERANK_GITHUB_URL,
  DEMO_STRUCTARRAY_SEARCH_URL,
  DEMO_STRUCTARRAY_SEARCH_GITHUB_URL,
  DEMO_EMBEDDING_LIST_SEARCH_URL,
  DEMO_EMBEDDING_LIST_SEARCH_GITHUB_URL,
} from '@/consts/externalLinks';
import { useTranslation } from 'react-i18next';
import { InkeepCustomTriggerWrapper } from '@/components/inkeep/inkeepChat';
import CustomButton from '@/components/customButton';
import { RightWholeArrow } from '@/components/icons';
import { LanguageEnum } from '@/types/localization';

type Props = {
  locale: LanguageEnum;
};

export function MilvusDemos(props: Props) {
  const { locale = LanguageEnum.ENGLISH } = props;
  const { t } = useTranslation('demo', { lng: locale });
  const { t: homeTrans } = useTranslation('home', { lng: locale });
  const { t: milvusTrans } = useTranslation('common', { lng: locale });

  const renderGithubButton = (href: string) => (
    <CustomButton href={href} variant="text" endIcon={<RightWholeArrow />}>
      {t('viewOnGithub')}
    </CustomButton>
  );

  const DEMOS = [
    {
      name: t('demos.functionChainRerank.title'),
      desc: t('demos.functionChainRerank.desc'),
      href: DEMO_FUNCTION_CHAIN_RERANK_URL,
      cover: '/images/demos/function-chain-rerank.png',
      renderButton2: () =>
        renderGithubButton(DEMO_FUNCTION_CHAIN_RERANK_GITHUB_URL),
      lowerCaseName: 'function chain rerank',
    },
    {
      name: t('demos.structArraySearch.title'),
      desc: t('demos.structArraySearch.desc'),
      href: DEMO_STRUCTARRAY_SEARCH_URL,
      cover: '/images/demos/structarray-search.png',
      renderButton2: () =>
        renderGithubButton(DEMO_STRUCTARRAY_SEARCH_GITHUB_URL),
      lowerCaseName: 'structarray search',
    },
    {
      name: t('demos.embeddingListSearch.title'),
      desc: t('demos.embeddingListSearch.desc'),
      href: DEMO_EMBEDDING_LIST_SEARCH_URL,
      cover: '/images/demos/embedding-list-search.png',
      renderButton2: () =>
        renderGithubButton(DEMO_EMBEDDING_LIST_SEARCH_GITHUB_URL),
      lowerCaseName: 'embeddinglist search',
    },
    {
      name: t('demos.multimodal.title'),
      desc: t('demos.multimodal.desc'),
      href: DEMO_MULTIMODAL_SEARCH_URL,
      cover: '/images/demos/multimodal-image-search.png',
      lowerCaseName: 'multimodal image search',
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
          endIcon={<RightWholeArrow />}
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

  const [dialogConfig, setDialogConfig] = useState<{
    open: boolean;
    title: string;
    content: React.ReactNode;
  }>({
    open: false,
    title: '',
    content: <></>,
  });

  const [snackbarConfig, setSnackbarConfig] = useState({
    open: false,
    type: 'info',
    message: '',
  });

  const handelOpenDialog = (content: React.ReactNode, title: string) => {
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
          <title>{t('meta.title')}</title>
          <meta name="description" content={t('meta.description')} />
          <meta
            name="keywords"
            content="Milvus demos, AI search, multimodal image search, image search, RAG"
          />
        </Head>

        <section className={classes.headerSection}>
          <div
            className={clsx(pageClasses.homeContainer, classes.innerSection)}
          >
            <h1 className={classes.title}>{t('title')}</h1>
            <p className={classes.desc}>{t('desc')}</p>
          </div>

          <div className="flex justify-center items-center gap-[20px] max-sm:flex-col">
            <CustomButton
              href={GET_START_LINK(locale)}
              size="large"
              classes={{
                root: classes.startButton,
              }}
            >
              {homeTrans('buttons.quickStart')}
            </CustomButton>
            <CustomButton
              href={`${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=center&utm_content=demo-page`}
              size="large"
              variant="outlined"
              classes={{
                root: classes.startButton,
              }}
            >
              {milvusTrans('v3trans.home.banner.tryManaged')}
            </CustomButton>
          </div>
        </section>

        <section
          className={clsx(pageClasses.homeContainer, classes.demoContainer)}
        >
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
