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
import ebay from '../images/brands/ebay.png';
import ikea from '../images/brands/ikea.png';
import intuit from '../images/brands/intuit.png';
import line from '../images/brands/line.png';
import shopee from '../images/brands/shopee.png';
import smartnews from '../images/brands/smartnews.png';
import walmart from '../images/brands/walmart.png';
import hunt from '../images/brands/hunt.png';
import micro from '../images/brands/micro.png';
import nvidia from '../images/brands/nvidia.png';
import moj from '../images/brands/moj.png';
import compass from '../images/brands/compass.png';
import tokopedia from '../images/brands/tokopedia.png';
import roblox from '../images/brands/roblox.png';
import att from '../images/brands/att.png';
import bosch from '../images/brands/bosch.png';
import omers from '../images/brands/omers.png';
import shutterstock from '../images/brands/shutterstock.png';
import zip from '../images/brands/zip.png';
import paypal from '../images/brands/paypal.png';
import shell from '../images/brands/shell.png';
import shein from '../images/brands/shein.png';
import regeneron from '../images/brands/regeneron.png';
import newRelic from '../images/brands/new-relic.png';
import dell from '../images/brands/dell.png';
import ae from '../images/brands/americanExpress.png';
import ea from '../images/brands/ea.png';
import ias from '../images/brands/ias.png';
import poshmark from '../images/brands/poshmark.png';
import salesforce from '../images/brands/salesforce.png';

import Seo from '../components/seo';
import { findLatestVersion } from '../utils';
import './index.less';
// local css module
import * as styles from './index.module.less';

const brands = [
  {
    name: 'Nvidia',
    icon: nvidia,
    link: 'https://www.nvidia.com/',
  },
  {
    name: 'Roblox',
    icon: roblox,
    link: 'https://www.roblox.com/',
  },
  {
    name: 'Att',
    icon: att,
    link: 'https://www.att.com/',
  },
  {
    name: 'Bosch',
    icon: bosch,
    link: 'https://www.bosch.com/',
  },
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
    name: 'Omers',
    icon: omers,
    link: 'https://www.omers.com/',
  },
  {
    name: 'Ziprecruiter',
    icon: zip,
    link: 'https://www.ziprecruiter.com/',
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
    name: 'Shutterstock',
    icon: shutterstock,
    link: 'https://www.shutterstock.com/',
  },

  {
    name: 'Tokopedia',
    icon: tokopedia,
    link: 'https://www.tokopedia.com/',
  },

  {
    name: 'Trend micro',
    icon: micro,
    link: 'https://www.trendmicro.com/',
  },
  {
    name: 'Compass',
    icon: compass,
    link: 'https://www.compass.com/',
  },
  {
    name: 'Moj',
    icon: moj,
    link: 'https://mojapp.in/',
  },
  {
    name: 'Dailyhunt',
    icon: hunt,
    link: 'https://www.dailyhunt.in/',
  },
  {
    name: 'PayPal',
    icon: paypal,
    link: 'https://www.paypal.com/',
  },
  {
    name: 'Shell',
    icon: shell,
    link: 'https://www.shell.com/',
  },
  {
    name: 'SHEIN',
    icon: shein,
    link: 'https://us.shein.com/',
  },
  {
    name: 'REGENERON',
    icon: regeneron,
    link: 'https://www.regeneron.com/',
  },
  {
    name: 'New Relic',
    icon: newRelic,
    link: 'https://www.newrelic.com/',
  },

  {
    name: 'Dell',
    icon: dell,
    link: 'https://www.dell.com/',
  },

  {
    name: 'american express',
    icon: ae,
    link: 'https://www.americanexpress.com/',
  },

  {
    name: 'EA',
    icon: ea,
    link: 'https://www.ea.com/',
  },
  {
    name: 'IAS',
    icon: ias,
    link: 'https://integralads.com/',
  },
  {
    name: 'Poshmark',
    icon: poshmark,
    link: 'https://poshmark.com/',
  },
  {
    name: 'Salesforce',
    icon: salesforce,
    link: 'https://www.salesforce.com/',
  },
];
const DESC =
  "Milvus is the world's most advanced open-source vector database, built for developing and maintaining AI applications.";

const IndexPage = ({ data, pageContext }) => {
  const { allVersion, allFile } = data;
  const homepageData = allFile.edges[0].node.childJson;
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

  // const communityLinks = [
  //   { name: 'Slack', to: SLACK_INVITE_URL },
  //   { name: 'Github', to: 'https://github.com/milvus-io/milvus' },
  // ];

  // const ExternalLinkIcon = props => {
  //   return (
  //     <SvgIcon
  //       viewBox="0 0 12 12"
  //       style={{ width: '15px', height: '15px' }}
  //       {...props}
  //     >
  //       <path
  //         fillRule="evenodd"
  //         clipRule="evenodd"
  //         d="M9.84623 1.30028H1.15384L1.15384 0.300279L11.0533 0.300279L11.5533 0.30028L11.5533 0.800279L11.5533 10.6998L10.5533 10.6998L10.5533 2.00738L0.80029 11.7604L0.0931833 11.0533L9.84623 1.30028Z"
  //         fill="white"
  //       />
  //     </SvgIcon>
  //   );
  // };

  const version = findLatestVersion(allVersion.nodes);

  return (
    <main className="homepage">
      <Layout darkMode={true} t={t} version={version}>
        <Seo
          title="Vector database - Milvus"
          titleTemplate="%s"
          lang={language}
          description={DESC}
        />
        {/* all css about banner in banner.less */}
        <HomeBanner t={t} version={version} bannerData={homepageData} />
        <section className={`${styles.customer} col-4 col-8 col-12`}>
          <p className={styles.customerTitle}>{t('v3trans.main.customer')}</p>
          <div className={styles.brands}>
            {brands.map(b => (
              // <a href={b.link} target="_blank" rel="noreferrer" key={b.name}>
              <img
                key={b.name}
                src={b.icon}
                width="142"
                height="69"
                alt={b.name}
              />
              // </a>
            ))}
          </div>
        </section>
        {/* all these sections about banner in banner.less */}

        <HomeFeatures t={t} />
        <HomeCode t={t} version={version} />
        <Attu t={t} />
        {/* 
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
        </section> */}

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
    allVersion(filter: { released: { eq: "yes" } }) {
      nodes {
        version
      }
    }
    allFile(
      filter: {
        sourceInstanceName: { eq: "homepage" }
        extension: { eq: "json" }
      }
    ) {
      edges {
        node {
          childJson {
            label
            link
          }
        }
      }
    }
  }
`;

export default IndexPage;
