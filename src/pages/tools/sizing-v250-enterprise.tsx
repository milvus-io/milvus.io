import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/commonLayout';
import classes from '@/styles/sizingTool.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import Head from 'next/head';
import FormSection from '@/parts/sizingV250/formSection';
import ResultSection from '@/parts/sizingV250/resultSection';
import {
  DependencyComponentEnum,
  ICalculateResult,
  ModeEnum,
} from '@/types/sizingV250';
import ZillizAdv from '@/parts/blogs/zillizAdv';
import { CLOUD_SIGNUP_LINK } from '@/consts';
import { LanguageEnum } from '@/types/localization';
import { fetchMilvusReleases } from '@/http/milvus';
import { baseValues } from '@/parts/sizingV250/config';
const { etcdBaseValue, minioBaseValue, pulsarBaseValue, kafkaBaseValue } = baseValues;

type Props = {
  locale: LanguageEnum;
  latestTag: string;
};

export default function SizingToolV250Enterprise(props: Props) {
  const { locale = LanguageEnum.ENGLISH, latestTag } = props;
  const { t } = useTranslation('sizingTool', { lng: locale });

  const [calculatedResult, setCalculatedResult] = useState<ICalculateResult>({
    rawDataSize: 0,
    memorySize: 0,
    localDiskSize: 0,
    standaloneNodeConfig: {
      cpu: 0,
      memory: 0,
      count: 0,
    },
    clusterNodeConfig: {
      queryNode: {
        cpu: 0,
        memory: 0,
        count: 0,
      },
      proxy: {
        cpu: 0,
        memory: 0,
        count: 0,
      },
      mixCoord: {
        cpu: 0,
        memory: 0,
        count: 0,
      },
      dataNode: {
        cpu: 0,
        memory: 0,
        count: 0,
      },
      indexNode: {
        cpu: 0,
        memory: 0,
        count: 0,
      },
    },
    dependencyConfig: {
      etcd: {
        ...etcdBaseValue,
      },
      minio: {
        ...minioBaseValue,
      },
      pulsar: {
        ...pulsarBaseValue,
      },
      kafka: {
        ...kafkaBaseValue,
      },
    },
    mode: ModeEnum.Standalone,
    dependency: DependencyComponentEnum.Pulsar,
    isOutOfCalculate: false,
  });

  const updateCalculatedResult = (result: ICalculateResult) => {
    setCalculatedResult(result);
  };

  return (
    <main className={classes.pageContainer}>
      <Layout darkMode={false}>
        <Head>
          <title>
            Milvus Sizing Tool for Milvus v2.5.x and earlier (Enterprise) -
            Vector Database built for scalable similarity search
          </title>
          <meta
            name="description"
            content="Sizing tool v2.5.x for enterprise use"
          />
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        <div
          className={clsx(
            pageClasses.homeContainer,
            classes.sizingToolContainer
          )}
        >
          <div className={classes.titleContainer}>
            <h1 className={classes.title}>
              <a
                href="https://zilliz.com/blog/demystify-milvus-sizing-tool"
                target="_blank"
              >
                {t('titleV250')} (Enterprise)
              </a>
            </h1>
            <span className="text-[14px] text-gray-500 ml-[12px]">
              Milvus 2.5.x and earlier
            </span>
          </div>
          <p className={classes.desc}>{t('content')}</p>

          <div className={classes.contentContainer}>
            <FormSection
              className={classes.leftSection}
              updateCalculatedResult={updateCalculatedResult}
              disableCalculationThreshold={true}
            />
            <ResultSection
              className={classes.rightSection}
              calculatedResult={calculatedResult}
              latestMilvusTag={latestTag}
            />
          </div>

          <ZillizAdv
            className={classes.zillizAdv}
            ctaLink={`${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=milvus_bottom_banner&utm_content=tools/sizing-v250-enterprise`}
          />
        </div>
      </Layout>
    </main>
  );
}

export const getStaticProps = async () => {
  const latestTag = await fetchMilvusReleases();
  return {
    props: {
      latestTag,
    },
  };
};
