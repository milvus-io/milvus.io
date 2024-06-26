import Head from 'next/head';
import Layout from '@/components/layout/commonLayout';
import classes from '@/styles/milvusDemos.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import DemoCard from '@/components/card/DemoCard';
import { useState } from 'react';
import { CustomizedContentDialogs } from '@/components/dialog/Dialog';
import { CustomizedSnackbars } from '@/components/snackBar';
import SubscribeNewsletter from '@/components/subscribe';
import { ABSOLUTE_BASE_URL } from '@/consts';

const TITLE = 'Milvus Demos';
const DESC = 'Milvus vector search demos';

const DEMOS = [
  {
    name: 'Image Search',
    desc: 'Images made searchable. Instantaneously return the most similar images from a massive database.',
    // link: 'http://35.166.123.214:8004/#/',
    href: '/milvus-demos/reverse-image-search',
    cover: '/images/demos/image-search.png',
    videoSrc: 'https://www.youtube.com/watch?v=hkU9hJnhGsU',
    lowerCaseName: 'image search',
  },
  {
    name: 'OSSChat',
    desc: 'Enhanced ChatGPT with documentation, issues, blog posts, community Q&A as knowledge bases. Built for every community and developer.',
    href: 'https://osschat.io/',
    cover: '/images/demos/ossChat.png',
    // videoSrc: 'https://www.youtube.com/watch?v=UvhL2vVZ-f4',
    lowerCaseName: 'chatbots',
  },
  {
    name: 'Chemical Structure Search',
    desc: 'Blazing fast similarity search, substructure search, or superstructure search for a specified molecule.',
    // href: 'http://molsearch.milvus.io/',
    cover: '/images/demos/chemical-search.svg',
    videoSrc: 'https://www.youtube.com/watch?v=4u_RZeMBTNI',
    lowerCaseName: 'chemical',
  },
];

export default function MilvusDemos() {
  const [dialogConfig, setDialogConfig] = useState({
    open: false,
    title: '',
    content: () => <></>,
  });

  const [snackbarConfig, setSnackbarConfig] = useState({
    open: false,
    type: 'info',
    message: '',
  });

  const handelOpenDialog = (content, title) => {
    setDialogConfig({
      open: true,
      title,
      content,
    });
  };

  const handleCloseDialog = () => {
    setDialogConfig({
      open: false,
      title: '',
      content: () => <></>,
    });
  };

  const handleOpenSnackbar = ({ message, type }) => {
    setSnackbarConfig({
      open: true,
      type,
      message,
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
            <h1 className={classes.title}>
              Milvus makes it easy to add similarity search to your
              applications.
            </h1>
            <p className={classes.desc}>
              Store, index, and manage massive embedding vectors generated by
              deep neural networks and other machine learning (ML) models.
            </p>
          </div>
        </section>

        <section className={clsx(pageClasses.container, classes.demoContainer)}>
          <ul className={classes.demoList}>
            {DEMOS.map((demo, index) => (
              <li key={demo.name}>
                <DemoCard
                  {...demo}
                  index={index}
                  handelOpenDialog={handelOpenDialog}
                  handleOpenSnackbar={handleOpenSnackbar}
                />
              </li>
            ))}
          </ul>
        </section>
        <SubscribeNewsletter callback={handleOpenSnackbar} />
      </Layout>
      <CustomizedContentDialogs
        open={dialogConfig.open}
        handleClose={handleCloseDialog}
        title={dialogConfig.title}
      >
        {dialogConfig.content()}
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
