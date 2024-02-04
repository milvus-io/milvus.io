import Head from 'next/head';
import Layout from '../components/layout/commonLayout';
import Signup from '../components/signup';
import HomeBanner from '../parts/home/banner';
import HomeFeature from '../parts/home/homeFeature';
import { CustomizedSnackbars } from '../components/snackBar';
import { useState } from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import { useTranslation } from 'react-i18next';
import blogUtils from '../utils/blog.utils';
import classes from '../styles/home.module.less';
import pageClasses from '../styles/responsive.module.less';

// local css module
import * as styles from '../styles/home.module.less';
import clsx from 'clsx';

const PATH_SURFIX = '/images/brands/';

const brands = [
  { name: 'ebay', icon: PATH_SURFIX + 'ebay.png' },
  { name: 'ikea', icon: PATH_SURFIX + 'ikea.png' },
  { name: 'intuit', icon: PATH_SURFIX + 'intuit.png' },
  { name: 'line', icon: PATH_SURFIX + 'line.png' },
  { name: 'shopee', icon: PATH_SURFIX + 'shopee.png' },
  { name: 'smartnews', icon: PATH_SURFIX + 'smartnews.png' },
  { name: 'walmart', icon: PATH_SURFIX + 'walmart.png' },
  { name: 'hunt', icon: PATH_SURFIX + 'hunt.png' },
  { name: 'micro', icon: PATH_SURFIX + 'micro.png' },
  { name: 'nvidia', icon: PATH_SURFIX + 'nvidia.png' },
  { name: 'moj', icon: PATH_SURFIX + 'moj.png' },
  { name: 'compass', icon: PATH_SURFIX + 'compass.png' },
  { name: 'tokopedia', icon: PATH_SURFIX + 'tokopedia.png' },
  { name: 'roblox', icon: PATH_SURFIX + 'roblox.png' },
  { name: 'att', icon: PATH_SURFIX + 'att.png' },
  { name: 'bosch', icon: PATH_SURFIX + 'bosch.png' },
  { name: 'ibm', icon: PATH_SURFIX + 'ibm.png' },
  { name: 'omers', icon: PATH_SURFIX + 'omers.png' },
  { name: 'shutterstock', icon: PATH_SURFIX + 'shutterstock.png' },
  { name: 'zip', icon: PATH_SURFIX + 'zip.png' },
  { name: 'paypal', icon: PATH_SURFIX + 'paypal.png' },
  { name: 'shell', icon: PATH_SURFIX + 'shell.png' },
  { name: 'shein', icon: PATH_SURFIX + 'shein.png' },
  { name: 'regeneron', icon: PATH_SURFIX + 'regeneron.png' },
  { name: 'newRelic', icon: PATH_SURFIX + 'new-relic.png' },
];
const DESC =
  "Milvus is the world's most advanced open-source vector database, built for developing and maintaining AI applications.";

const IndexPage = props => {
  const { t } = useTranslation('common');

  const { bannerData } = props;

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
    <main className={classes.homepageContainer}>
      <Layout darkMode={true} t={t}>
        <Head>
          <title>Vector database - Milvus</title>
          <meta name="description" content={DESC}></meta>
        </Head>
        {/* all css about banner in banner.less */}
        <HomeBanner bannerData={bannerData} t={t} />
        <section
          className={clsx(pageClasses.container, classes.customersContainer)}
        >
          <h2 className={styles.customerTitle}>
            The most popular vector database for enterprise users
          </h2>

          <ul className={styles.brandsList}>
            {brands.map(b => (
              <li className={classes.listItem} key={b.name}>
                <img src={b.icon} alt={b.name} />
              </li>
            ))}
          </ul>
        </section>
        {/* all these sections about banner in banner.less */}

        <HomeFeature />

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

export default IndexPage;

export const getStaticProps = async () => {
  const bannerData = await blogUtils.getHomepageData();
  return {
    props: {
      bannerData,
    },
  };
};
