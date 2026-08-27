import React, { useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Layout from '@/components/layout/commonLayout';
import classes from '@/styles/sizingTool.module.css';
import pageClasses from '@/styles/responsive.module.css';
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
import { CLOUD_SIGNUP_LINK } from '@/consts';
import { LanguageEnum } from '@/types/localization';
import { fetchMilvusReleases } from '@/http/milvus';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/router';
import { SIZING_TOOL_VERSION_OPTIONS } from '@/consts/sizing';
import { baseValues } from '@/parts/sizing/config';
import { SizingTabs, sizingTabId, sizingTabPanelId } from '@/components/sizing';
import { GpuSizingTool } from '@/parts/sizingGpu';
const { etcdBaseValue, minioBaseValue, pulsarBaseValue, kafkaBaseValue } =
  baseValues;

type Props = {
  locale: LanguageEnum;
  latestTag: string;
};

enum SizingTabEnum {
  Cpu = 'cpu',
  Gpu = 'gpu',
}

const TAB_ID_PREFIX = 'sizing';

const readTabFromQuery = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === SizingTabEnum.Gpu ? SizingTabEnum.Gpu : SizingTabEnum.Cpu;
};

export default function SizingTool(props: Props) {
  const { locale = LanguageEnum.ENGLISH, latestTag } = props;
  const { t } = useTranslation('sizingTool', { lng: locale });
  const router = useRouter();
  const currentVersion = SIZING_TOOL_VERSION_OPTIONS.find(
    option => option.href === router.pathname
  );
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
      streamNode: {
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

  const [selectedVersion, setSelectedVersion] = useState<string>(
    currentVersion?.value || SIZING_TOOL_VERSION_OPTIONS[0].value
  );

  // Defaults to CPU; `?tab=gpu` selects the GPU calculator so the view is
  // linkable. Both panels stay mounted so each keeps its own form state.
  const [tab, setTab] = useState<SizingTabEnum>(SizingTabEnum.Cpu);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    setTab(readTabFromQuery(router.query.tab));
  }, [router.isReady, router.query.tab]);

  const handleTabChange = useCallback(
    (value: SizingTabEnum) => {
      setTab(value);

      const query = { ...router.query };
      if (value === SizingTabEnum.Gpu) {
        query.tab = SizingTabEnum.Gpu;
      } else {
        delete query.tab;
      }

      router.replace({ pathname: router.pathname, query }, undefined, {
        shallow: true,
        scroll: false,
      });
    },
    [router]
  );

  const asyncCalculatedResult = (result: ICalculateResult) => {
    setCalculatedResult(result);
  };

  const handleSelectVersion = (value: string) => {
    setSelectedVersion(value);
    router.push(
      SIZING_TOOL_VERSION_OPTIONS.find(option => option.value === value)
        ?.href || '/tools/sizing'
    );
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
        </Head>

        <div
          className={clsx(
            pageClasses.homeContainer,
            classes.sizingToolContainer
          )}
        >
          <div className={classes.titleContainer}>
            <h1 className={classes.title}>
              <Link
                href="https://zilliz.com/blog/demystify-milvus-sizing-tool"
                target="_blank"
              >
                {t('title')}
              </Link>
            </h1>
            <div className={classes.selectContainer}>
              <Select
                value={selectedVersion}
                onValueChange={handleSelectVersion}
              >
                <SelectTrigger className={classes.selectTrigger}>
                  <SelectValue placeholder="Select a Milvus version">
                    {selectedVersion}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {SIZING_TOOL_VERSION_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className={clsx(classes.desc, classes.descWithTabs)}>
            {t('content')}
          </p>

          <SizingTabs
            className={classes.tabsRow}
            idPrefix={TAB_ID_PREFIX}
            value={tab}
            onChange={handleTabChange}
            hint={
              tab === SizingTabEnum.Gpu ? t('tabs.gpuHint') : t('tabs.cpuHint')
            }
            options={[
              { value: SizingTabEnum.Cpu, label: t('tabs.cpu') },
              {
                value: SizingTabEnum.Gpu,
                label: t('tabs.gpu'),
                badge: t('tabs.new'),
              },
            ]}
          />

          <div
            role="tabpanel"
            id={sizingTabPanelId(TAB_ID_PREFIX, SizingTabEnum.Cpu)}
            aria-labelledby={sizingTabId(TAB_ID_PREFIX, SizingTabEnum.Cpu)}
            hidden={tab !== SizingTabEnum.Cpu}
            className={clsx({
              [classes.hiddenPanel]: tab !== SizingTabEnum.Cpu,
            })}
          >
            <div className={classes.contentContainer}>
              <FormSection
                className={classes.leftSection}
                asyncCalculatedResult={asyncCalculatedResult}
              />
              <ResultSection
                className={classes.rightSection}
                calculatedResult={calculatedResult}
                latestMilvusTag={latestTag}
              />
            </div>
          </div>

          <div
            role="tabpanel"
            id={sizingTabPanelId(TAB_ID_PREFIX, SizingTabEnum.Gpu)}
            aria-labelledby={sizingTabId(TAB_ID_PREFIX, SizingTabEnum.Gpu)}
            hidden={tab !== SizingTabEnum.Gpu}
            className={clsx({
              [classes.hiddenPanel]: tab !== SizingTabEnum.Gpu,
            })}
          >
            <GpuSizingTool />
          </div>

          <ZillizAdv
            className={classes.zillizAdv}
            ctaLink={`${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=milvus_bottom_banner&utm_content=tools/sizing`}
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
