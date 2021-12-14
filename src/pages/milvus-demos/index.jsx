import React, { useState } from 'react';
import { graphql } from 'gatsby';
import Header from '../../components/header/v2';
import Footer from '../../components/footer/v2';
import Seo from '../../components/seo';
import DemoCard from '../../components/card/demoCard';
import * as styles from './index.module.less';
import Modal from '../../components/demoComponents/modal';
import VideoPlayer from '../../components/demoComponents/videoPlayer';
import InfoSubmitter from '../../components/demoComponents/infoSubmitter';
import SnackBar from '../../components/demoComponents/snackBar';
import imageSearch from '../../images/milvus-demos/image-search.png';
import chemical from '../../images/milvus-demos/chemical-search.svg';
import chatBot from '../../images/milvus-demos/chat-bots.svg';
import FloatBord from '../../components/demoComponents/floatBord';
import { globalHistory } from '@reach/router';

const DEMOS = [
  {
    name: 'Image Search',
    desc: 'Images made searchable. Instantaneously return the most similar images from a massive database.',
    // link: 'http://35.166.123.214:8004/#/',
    href: '/milvus-demos/reverse-image-search',
    coverImg: imageSearch,
    videoLink: 'https://www.youtube.com/watch?v=hkU9hJnhGsU',
    lowerCaseName: 'image search',
  },
  {
    name: 'Chatbots',
    desc: 'Interactive digital customer service that saves users time and businesses money.',
    href: 'http://35.166.123.214:8005/',
    coverImg: chatBot,
    videoLink: 'https://www.youtube.com/watch?v=UvhL2vVZ-f4',
    lowerCaseName: 'chatbots',
  },
  {
    name: 'Chemical Structure Search',
    desc: 'Blazing fast similarity search, substructure search, or superstructure search for a specified molecule.',
    href: 'http://35.166.123.214:8002/',
    coverImg: chemical,
    videoLink: 'https://www.youtube.com/watch?v=4u_RZeMBTNI',
    lowerCaseName: 'chemical',
  },
];

const TITLE =
  'Milvus Reverse Image Search - Open-Source Vector Similarity Application Dem';
const DESC =
  'With Milvus, you can search by image in a few easy steps. Just click the “Upload Image” button and choose an image to see vector similarity search in action.';
const UNIQUE_EMAIL_ID = 'UNIQUE_EMAIL_ID';

const MilvusDemos = ({ data, pageContext }) => {
  const { footer } = data.allFile.edges.filter(i => i.node.childI18N)[0].node
    .childI18N.v2;
  const { locale } = pageContext;

  const { search } = globalHistory.location;
  const source = ['utm_source', 'utm_medium', 'utm_campaign'].every(v =>
    search.includes(v)
  )
    ? 'Ads：Reddit'
    : 'Milvus：demo';

  const [modalConfig, setModalConfig] = useState({
    open: false,
    handleCloseModal: () => {},
    component: () => <></>,
  });
  const [snackBarConfig, setSnackBarConfig] = useState({
    open: false,
    type: 'info',
    message: '',
    handleCloseSnackBar: () => {},
  });

  // close dialog
  const hideModal = () => {
    setModalConfig({
      open: false,
      component: () => <></>,
    });
  };

  // callback of form submit
  const handleSubmitInfo = (statusCode, unique_email_id, href) => {
    const config = {
      open: true,
      handleCloseSnackBar: () =>
        setSnackBarConfig({
          open: false,
        }),
    };

    if (statusCode === 200) {
      window.localStorage.setItem(UNIQUE_EMAIL_ID, unique_email_id);
      setSnackBarConfig({
        ...config,
        type: 'success',
        message: 'Thank you, you have been added to our mailing list!',
      });
      //
    } else {
      setSnackBarConfig({
        ...config,
        type: 'warning',
        message: 'This email is already subscribed!',
      });
      window.localStorage.setItem(UNIQUE_EMAIL_ID, true);
    }
    window.location.href = href;
  };

  // click play video
  const handleWatchVideo = src => {
    const { innerWidth } = window;
    const clientWidth =
      innerWidth < 800
        ? innerWidth
        : innerWidth < 1200
        ? innerWidth * 0.8
        : 1200 * 0.8;
    setModalConfig({
      open: true,
      handleCloseModal: hideModal,
      component: () => (
        <VideoPlayer
          clientWidth={clientWidth}
          videoSrc={src}
          hideVideoDialog={hideModal}
        />
      ),
    });
  };

  // click try demo
  const handleTryDemo = ({ href }) => {
    const unique_email_id = window.localStorage.getItem(UNIQUE_EMAIL_ID);
    if (unique_email_id) {
      window.location.href = href;
      return;
    }
    setModalConfig({
      open: true,
      handleCloseModal: hideModal,
      component: () => (
        <InfoSubmitter
          loale={locale}
          submitCb={handleSubmitInfo}
          source={source}
          hideModal={hideModal}
          href={href}
        />
      ),
    });
  };

  return (
    <>
      <Header locale={locale} showRobot={false} />
      <Seo title={TITLE} lang={locale} description={DESC} />
      <main className={styles.container}>
        <div className={styles.titleContainer}>
          <p className={styles.desc}>
            Milvus makes it easy to add similarity search to your applications.
          </p>
          <h3 className={styles.title}>Try our demos</h3>
        </div>
        <div className={styles.demoCardWrapper}>
          {DEMOS.map(demo => {
            return (
              <DemoCard
                key={demo.name}
                name={demo.name}
                desc={demo.desc}
                coverImg={demo.coverImg}
                href={demo.href}
                videoLink={demo.videoLink}
                handlePlayVideo={handleWatchVideo}
                handleTryDemo={handleTryDemo}
              />
            );
          })}
        </div>
        <FloatBord className={styles.floatBord} />
        <Modal {...modalConfig} />
        <SnackBar {...snackBarConfig} />
      </main>
      <Footer footer={footer} locale={locale} />
    </>
  );
};

export default MilvusDemos;

export const Query = graphql`
  query LandingPageQuery($locale: String) {
    allFile(filter: { name: { eq: $locale } }) {
      edges {
        node {
          childI18N {
            v2 {
              footer {
                list {
                  title
                  text
                  href
                  label
                  icons {
                    href
                    name
                  }
                }
                licence {
                  text1 {
                    label
                    link
                  }
                  text2 {
                    label
                    link
                  }
                  text3 {
                    label
                    link
                  }
                  list {
                    label
                    link
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
