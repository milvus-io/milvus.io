import React, { useState, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Layout from '@/components/layout/commonLayout';
import classes from '@/styles/sizingTool.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import Head from 'next/head';
import { ABSOLUTE_BASE_URL } from '@/consts';
import FormSection from '@/parts/sizing/formSection';
import ResultSection from '@/parts/sizing/resultSection';
import {
  DependencyComponentEnum,
  ICalculateResult,
  ModeEnum,
} from '@/types/sizing';
import { InfoFilled } from '@/components/icons';
import ZillizAdv from '@/parts/blogs/zillizAdv';

const etcdBaseValue = {
  cpu: 0,
  memory: 0,
  pvc: 0,
  count: 0,
};
const minioBaseValue = {
  cpu: 0,
  memory: 0,
  pvc: 0,
  count: 0,
};
const pulsarBaseValue = {
  bookie: {
    cpu: 0,
    memory: 0,
    count: 0,
    journal: 0,
    ledgers: 0,
  },
  broker: {
    cpu: 0,
    memory: 0,
    count: 0,
  },
  proxy: {
    cpu: 0,
    memory: 0,
    count: 0,
  },
  zookeeper: {
    cpu: 0,
    memory: 0,
    count: 0,
    pvc: 0,
  },
};
const kafkaBaseValue = {
  broker: {
    cpu: 0,
    memory: 0,
    count: 0,
    pvc: 0,
  },
  zookeeper: {
    cpu: 0,
    memory: 0,
    count: 0,
    pvc: 0,
  },
};

export default function SizingTool() {
  const { t } = useTranslation('sizingTool');
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
            Milvus Sizing Tool · Vector Database built for scalable similarity
            search
          </title>
          <meta name="description" content="Sizing tool" />
          <link
            rel="alternate"
            href={`${ABSOLUTE_BASE_URL}/tools/sizing`}
            hrefLang="en"
          />
        </Head>

        <div
          className={clsx(
            pageClasses.homeContainer,
            classes.sizingToolContainer
          )}
        >
          <h1 className={classes.title}>{t('title')}</h1>
          <p className={classes.desc}>{t('content')}</p>

          <div className={classes.contentContainer}>
            <FormSection
              className={classes.leftSection}
              updateCalculatedResult={updateCalculatedResult}
            />
            <ResultSection
              className={classes.rightSection}
              calculatedResult={calculatedResult}
            />
          </div>

          <ZillizAdv
            className={classes.zillizAdv}
            ctaLink="https://cloud.zilliz.com/signup?utm_source=partner&utm_medium=referral&utm_campaign=2024-12-19_resouces_milvus-sizing-tool_milvusio"
          />
        </div>
      </Layout>
    </main>
  );
}
