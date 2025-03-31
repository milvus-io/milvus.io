import Head from 'next/head';
import Layout from '@/components/layout/commonLayout';
import classes from '@/styles/milvusDemos.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import DemoCard from '@/components/card/DemoCard';
import { useState } from 'react';
import { CustomizedContentDialogs } from '@/components/dialog/Dialog';
import { CustomizedSnackbars } from '@/components/snackBar';
import { GET_START_LINK } from '@/consts/links';
import { CLOUD_SIGNUP_LINK } from '@/consts/links';
import {
  DEMO_MULTIMODAL_SEARCH_URL,
  DEMO_HYBRID_SEARCH_URL,
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

  const DEMOS = [
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
      name: t('demos.multimodal.title'),
      desc: t('demos.multimodal.desc'),
      href: DEMO_MULTIMODAL_SEARCH_URL,
      cover: '/images/demos/multimodal-image-search.png',
      lowerCaseName: 'multimodal image search',
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
      name: t('demos.imgSearch.title'),
      desc: t('demos.imgSearch.desc'),
      // link: 'http://35.166.123.214:8004/#/',
      href: '/milvus-demos/reverse-image-search',
      cover: '/images/demos/image-search.png',
      videoSrc: 'https://www.youtube.com/watch?v=hkU9hJnhGsU',
      lowerCaseName: 'image search',
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
