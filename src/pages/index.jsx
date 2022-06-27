import React, { useState } from 'react';
import { graphql } from 'gatsby';
import { useI18next } from 'gatsby-plugin-react-i18next';
import Layout from '../components/layout';
import Signup from '../components/signup';
import HomeBanner from '../components/home/banner';
import HomeFeatures from '../components/home/features';
import HomeCode from '../components/home/code';
import Attu from '../components/home/attu';
import { CustomizedSnackbars } from '../components/snackBar';
import tencent from '../images/brands/tencent.png';
import ebay from '../images/brands/ebay.png';
import ikea from '../images/brands/ikea.png';
import intuit from '../images/brands/intuit.png';
import kuaishou from '../images/brands/kuaishou.png';
import line from '../images/brands/line.png';
import baidu from '../images/brands/baidu.png';
import shopee from '../images/brands/shopee.png';
import smartnews from '../images/brands/smartnews.png';
import bigolive from '../images/brands/bigolive.png';
import walmart from '../images/brands/walmart.png';
import xiaomi from '../images/brands/xiaomi.png';
import hunt from '../images/brands/hunt.png';
import micro from '../images/brands/micro.png';
import nvidia from '../images/brands/nvidia.png';
import moj from '../images/brands/moj.png';
import compass from '../images/brands/compass.png';
import tokopedia from '../images/brands/tokopedia.png';
import CustomIconLink from '../components/customIconLink';
import Seo from '../components/seo';
import SvgIcon from '@mui/material/SvgIcon';
// css entry, all site's styles are loaded from this file
import './index.less';
// local css module
import * as styles from './index.module.less';

const brands = [
  {
    name: 'Ebay',
    icon: ebay,
    link: 'https://www.ebay.com/',
  },
  {
    name: 'Shopee',
    icon: shopee,
    link: 'https://shopee.com/',
  },
  {
    name: 'Line',
    icon: line,
    link: 'https://line.me/',
  },
  {
    name: 'Ikea',
    icon: ikea,
    link: 'https://www.ikea.com/',
  },
  {
    name: 'Walmart',
    icon: walmart,
    link: 'https://www.walmart.com/',
  },
  {
    name: 'Intuit',
    icon: intuit,
    link: 'https://www.intuit.com/',
  },
  {
    name: 'Smartnews',
    icon: smartnews,
    link: 'https://www.smartnews.com/',
  },
  {
    name: 'Tokopedia',
    icon: tokopedia,
    link: 'https://www.tokopedia.com/',
  },
  {
    name: 'Nvidia',
    icon: nvidia,
    link: 'https://www.nvidia.com/',
  },
  {
    name: 'Kuaishou',
    icon: kuaishou,
    link: 'https://www.kuaishou.com/',
  },
  {
    name: 'Trend micro',
    icon: micro,
    link: 'https://www.trendmicro.com/',
  },
  {
    name: 'Xiaomi',
    icon: xiaomi,
    link: 'https://www.mi.com/',
  },
  {
    name: 'Compass',
    icon: compass,
    link: 'https://www.compass.com/',
  },
  {
    name: 'Tencent',
    icon: tencent,
    link: 'https://www.tencent.com/',
  },
  {
    name: 'bigolive',
    icon: bigolive,
    link: 'https://www.bigo.tv/',
  },
  {
    name: 'Moj',
    icon: moj,
    link: 'https://mojapp.in/',
  },

  {
    name: 'Baidu',
    icon: baidu,
    link: 'https://www.baidu.com/',
  },
  {
    name: 'Dailyhunt',
    icon: hunt,
    link: 'https://www.dailyhunt.in/',
  },
];
const DESC =
  "Milvus is the world's most advanced open-source vector database, built for developing and maintaining AI applications.";

const IndexPage = () => {
  const { language, t } = useI18next();
  const [snackbarConfig, setSnackbarConfig] = useState({
    open: false,
    type: 'info',
    message: '',
  });

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

  const communityLinks = [
    { name: 'Slack', to: 'https://slack.milvus.io' },
    { name: 'Github', to: 'https://github.com/milvus-io/milvus' },
    { name: 'Forum', to: 'https://discuss.milvus.io/' },
  ];

  const ExternalLinkIcon = props => {
    return (
      <SvgIcon
        viewBox="0 0 12 12"
        style={{ width: '15px', height: '15px' }}
        {...props}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.84623 1.30028H1.15384L1.15384 0.300279L11.0533 0.300279L11.5533 0.30028L11.5533 0.800279L11.5533 10.6998L10.5533 10.6998L10.5533 2.00738L0.80029 11.7604L0.0931833 11.0533L9.84623 1.30028Z"
          fill="white"
        />
      </SvgIcon>
    );
  };

  return (
    <main className="homepage">
      <Layout darkMode={true} t={t}>
        <Seo title="Milvus" lang={language} description={DESC} />
        {/* all css about banner in banner.less */}
        <HomeBanner t={t} />
        <section className={`${styles.customer} col-4 col-8 col-12`}>
          <p className={styles.customerTitle}>{t('v3trans.main.customer')}</p>
          <div className={styles.brands}>
            {brands.map(b => (
              // <a href={b.link} target="_blank" rel="noreferrer" key={b.name}>
              <img
                key={b.name}
                src={b.icon}
                width="133"
                height="65"
                alt={b.name}
              />
              // </a>
            ))}
          </div>
        </section>
        {/* all these sections about banner in banner.less */}

        <HomeFeatures t={t} />
        <HomeCode t={t} />
        <Attu t={t} />

        <section className={`${styles.community} col-4 col-8 col-12`}>
          <p className={styles.communityTitle}>
            {t('v3trans.main.communitytitle')}
          </p>
          <div className={styles.communityLinkContainer}>
            <p className={styles.communityLinkTitle}>
              {t('v3trans.main.communitydesc')}
            </p>
            <div className={styles.communityLinks}>
              {communityLinks.map(co => {
                return (
                  <CustomIconLink
                    className={styles.communityLink}
                    to={co.to}
                    customIcon={ExternalLinkIcon}
                    key={co.name}
                  >
                    {co.name}
                  </CustomIconLink>
                );
              })}
            </div>
          </div>
        </section>

        <Signup callback={handleOpenSnackbar} t={t} />
        <CustomizedSnackbars
          open={snackbarConfig.open}
          type={snackbarConfig.type}
          message={snackbarConfig.message}
          handleClose={handleCloseSnackbar}
        />
      </Layout>
    </main>
  );
};

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          data
          language
          ns
        }
      }
    }
  }
`;

export default IndexPage;
