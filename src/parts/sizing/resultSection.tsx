import clsx from 'clsx';
import classes from './index.module.less';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui';
import {
  ExternalLinkIcon,
  ArrowTop,
  DownloadIcon,
  InfoFilled,
} from '@/components/icons';
import { ICalculateResult } from '@/types/sizing';
import { formatNumber, unitBYTE2Any } from '@/utils/sizingTool';
import {
  milvusOverviewDataCalculator,
  dependencyOverviewDataCalculator,
  helmYmlGenerator,
  operatorYmlGenerator,
  formatOutOfCalData,
} from '@/utils/sizingTool';
import { DataCard, DependencyComponent } from './dependencyComponent';
import { Trans, useTranslation } from 'react-i18next';
import { useState } from 'react';
import CustomButton from '@/components/customButton';
import {
  helmCodeExample,
  operatorCodeExample,
  HELM_CONFIG_FILE_NAME,
  OPERATOR_CONFIG_FILE_NAME,
} from '@/consts/sizing';
import { useCopyCode } from '@/hooks/enhanceCodeBlock';
import { MilvusComponent } from './milvusComponent';

export default function ResultSection(props: {
  className?: string;
  calculatedResult: ICalculateResult;
}) {
  const { t } = useTranslation('sizingTool');
  const { className, calculatedResult } = props;

  const {
    rawDataSize,
    memorySize,
    localDiskSize,
    clusterNodeConfig,
    standaloneNodeConfig,
    dependencyConfig,
    mode,
    dependency,
    isOutOfCalculate,
  } = calculatedResult;

  const { queryNode, proxy, mixCoord, dataNode, indexNode } = clusterNodeConfig;

  // Approximate Capacity
  const { size: totalRawDataSize, unit: rawDataUnit } =
    unitBYTE2Any(rawDataSize);
  const { size: totalLoadingMemorySize, unit: memoryUnit } =
    unitBYTE2Any(memorySize);

  // milvus data
  const { milvusCpu, milvusMemory } = milvusOverviewDataCalculator({
    clusterNodeConfig,
    standaloneNodeConfig,
    mode,
  });
  const milvusCpuData = formatNumber(milvusCpu);
  const milvusMemoryData = unitBYTE2Any(milvusMemory * 1024 * 1024 * 1024);

  // dependency data
  const { dependencyCpu, dependencyMemory, dependencyStorage } =
    dependencyOverviewDataCalculator({ mode, dependency, dependencyConfig });
  const dependencyCpuData = formatNumber(dependencyCpu);
  const dependencyMemoryData = unitBYTE2Any(
    dependencyMemory * 1024 * 1024 * 1024
  );
  const { size: dependencyStorageSize, unit: dependencyStorageUnit } =
    unitBYTE2Any(dependencyStorage * 1024 * 1024 * 1024);

  // setup data
  const totalCpu = formatNumber(milvusCpu + dependencyCpu);
  const totalMemory = unitBYTE2Any(
    (milvusMemory + dependencyMemory) * 1024 * 1024 * 1024
  );
  const { size: diskSize, unit: diskUnit } = unitBYTE2Any(localDiskSize);

  const [isMilvusOpen, setIsMilvusOpen] = useState(false);
  const [isDependencyOpen, setIsDependencyOpen] = useState(false);

  const handleDownloadConfigFile = (type: 'helm' | 'operator') => {
    const configGenerator =
      type === 'helm' ? helmYmlGenerator : operatorYmlGenerator;
    const config = configGenerator(
      {
        proxy,
        mixCoord,
        indexNode,
        etcdData: dependencyConfig.etcd,
        minioData: dependencyConfig.minio,
        pulsarData: dependencyConfig.pulsar,
        kafkaData: dependencyConfig.kafka,
      },
      dependency,
      mode
    );

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(
      new Blob([config], {
        type: 'text/plain',
      })
    );
    downloadLink.download =
      type === 'helm' ? HELM_CONFIG_FILE_NAME : OPERATOR_CONFIG_FILE_NAME;

    downloadLink.click();
  };

  useCopyCode([helmCodeExample, operatorCodeExample]);

  return (
    <section className={clsx(classes.resultContainer, className)}>
      {isOutOfCalculate && (
        <div className={classes.substantialWrapper}>
          <InfoFilled />
          <p className={classes.substantialTip}>
            {
              <Trans
                t={t}
                i18nKey="setup.outOfRange"
                components={[
                  <a
                    href="https://zilliz.com/contact-sales"
                    key="contact-us"
                  ></a>,
                ]}
              />
            }
          </p>
        </div>
      )}
      <div className={classes.dataSection}>
        <h2 className={classes.sectionLabel}>{t('overview.title')}</h2>
        <div className={classes.flexRow}>
          <DataCard
            name={
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger
                    className={clsx(
                      classes.dataCardName,
                      classes.tooltipTrigger
                    )}
                  >
                    {t('overview.raw')}
                  </TooltipTrigger>
                  <TooltipContent sideOffset={5} className="w-[280px]">
                    {t('overview.rawTooltip')}
                    <TooltipArrow />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            }
            data={formatOutOfCalData({
              data: `${totalRawDataSize} ${rawDataUnit}`,
              isOut: isOutOfCalculate,
            })}
          />
          <DataCard
            name={
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger
                    className={clsx(
                      classes.dataCardName,
                      classes.tooltipTrigger
                    )}
                  >
                    {t('overview.memory')}
                  </TooltipTrigger>
                  <TooltipContent sideOffset={5} className="w-[280px]">
                    {t('overview.memoryTooltip')}
                    <TooltipArrow />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            }
            data={formatOutOfCalData({
              data: `${totalLoadingMemorySize} ${memoryUnit}`,
              isOut: isOutOfCalculate,
            })}
          />
        </div>
      </div>
      <div className="">
        <div className={classes.sectionLabelBar}>
          <h2 className={classes.title}>{t('setup.title')}</h2>
          <a
            className={classes.buttonWrapper}
            href="https://zilliz.com/pricing#calculator"
          >
            <span className="">{t('setup.cloud')}</span>
            <ExternalLinkIcon />
          </a>
        </div>

        <div className={classes.totalDataContent}>
          <div className={classes.dataSummary}>
            <DataCard
              name={t('setup.basic.cpu')}
              data={
                isOutOfCalculate
                  ? '--'
                  : t('setup.basic.simpleCore', {
                      cpu: `${totalCpu.num} ${totalCpu.unit}`,
                    })
              }
              classname={classes.summaryCard}
              size="large"
            />
            <DataCard
              name={t('setup.basic.memory')}
              data={formatOutOfCalData({
                data: `${totalMemory.size} ${totalMemory.unit}`,
                isOut: isOutOfCalculate,
              })}
              classname={classes.summaryCard}
              size="large"
            />
            <DataCard
              name={t('setup.basic.storage')}
              data={formatOutOfCalData({
                data: `${dependencyStorageSize} ${dependencyStorageUnit}`,
                isOut: isOutOfCalculate,
              })}
              classname={classes.summaryCard}
              size="large"
            />
            <DataCard
              name={t('setup.basic.disk')}
              data={formatOutOfCalData({
                data: `${diskSize} ${diskUnit}`,
                isOut: isOutOfCalculate,
              })}
              classname={classes.summaryCard}
              size="large"
            />
          </div>

          <div className={classes.dataDetail}>
            <Collapsible
              onOpenChange={isOpen => {
                setIsMilvusOpen(isOpen);
              }}
            >
              <CollapsibleTrigger className={classes.commonCollapseTitle}>
                <div className={classes.collapseTitle}>
                  <p className={classes.titleName}>{t('setup.milvus.title')}</p>
                  <div className={classes.flexRow}>
                    <p className={classes.titleOverview}>
                      <Trans
                        t={t}
                        i18nKey="setup.basic.cpuAndMemory"
                        values={{
                          cpu: formatOutOfCalData({
                            data: `${milvusCpuData.num} ${milvusCpuData.unit} C`,
                            isOut: isOutOfCalculate,
                            short: true,
                          }),
                          memory: formatOutOfCalData({
                            data: `${milvusMemoryData.size} ${milvusMemoryData.unit}`,
                            isOut: isOutOfCalculate,
                            short: true,
                          }),
                        }}
                        components={[
                          <span
                            key="value"
                            className={classes.valueInfo}
                          ></span>,
                        ]}
                      />
                    </p>
                    <p className={classes.titleOverview}>
                      <Trans
                        t={t}
                        i18nKey="setup.basic.diskWithValue"
                        values={{
                          disk: formatOutOfCalData({
                            data: diskSize,
                            isOut: isOutOfCalculate,
                            short: true,
                          }),
                          unit: formatOutOfCalData({
                            data: diskUnit,
                            isOut: isOutOfCalculate,
                            short: true,
                          }),
                        }}
                        components={[
                          <span
                            key="value"
                            className={classes.valueInfo}
                          ></span>,
                        ]}
                      />
                    </p>
                  </div>
                </div>
                <span
                  className={clsx(classes.collapseIcon, {
                    [classes.activeIcon]: isMilvusOpen,
                  })}
                >
                  <ArrowTop />
                </span>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <MilvusComponent
                  standaloneNodeConfig={standaloneNodeConfig}
                  clusterNodeConfig={clusterNodeConfig}
                  isOutOfCalculate={isOutOfCalculate}
                  diskSize={diskSize}
                  diskUnit={diskUnit}
                  mode={mode}
                  rawDataSize={rawDataSize}
                  memorySize={memorySize}
                />
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div className={classes.dataDetail}>
            <Collapsible
              onOpenChange={isOpen => {
                setIsDependencyOpen(isOpen);
              }}
            >
              <CollapsibleTrigger className={classes.commonCollapseTitle}>
                <div className={classes.collapseTitle}>
                  <p className={classes.titleName}>
                    {t('setup.dependency.title')}
                  </p>
                  <div className={classes.flexRow}>
                    <p className={classes.titleOverview}>
                      <Trans
                        t={t}
                        i18nKey="setup.basic.cpuAndMemory"
                        values={{
                          cpu: formatOutOfCalData({
                            data: `${dependencyCpuData.num}${dependencyCpuData.unit} C`,
                            isOut: isOutOfCalculate,
                            short: true,
                          }),
                          memory: formatOutOfCalData({
                            data: `${dependencyMemoryData.size}${dependencyMemoryData.unit}`,
                            isOut: isOutOfCalculate,
                            short: true,
                          }),
                        }}
                        components={[
                          <span
                            key="value"
                            className={classes.valueInfo}
                          ></span>,
                        ]}
                      />
                    </p>
                    <p className={classes.titleOverview}>
                      <Trans
                        t={t}
                        i18nKey="setup.basic.storageWithValue"
                        values={{
                          size: formatOutOfCalData({
                            data: `${dependencyStorageSize} ${dependencyStorageUnit}`,
                            isOut: isOutOfCalculate,
                          }),
                        }}
                        components={[
                          <span
                            key="value"
                            className={classes.valueInfo}
                          ></span>,
                        ]}
                      />
                    </p>
                  </div>
                </div>
                <span
                  className={clsx(classes.collapseIcon, {
                    [classes.activeIcon]: isDependencyOpen,
                  })}
                >
                  <ArrowTop />
                </span>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <DependencyComponent
                  dependency={dependency}
                  mode={mode}
                  data={dependencyConfig}
                  isOutOfCalculate={isOutOfCalculate}
                />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        <div className={classes.installationSection}>
          <h2 className={classes.sectionTitle}>{t('install.title')}</h2>
          <div className="mb-[16px]">
            <CustomButton
              disabled={isOutOfCalculate}
              variant="outlined"
              startIcon={<DownloadIcon />}
              classes={{
                root: classes.installButton,
              }}
              onClick={() => {
                if (isOutOfCalculate) {
                  return;
                }
                handleDownloadConfigFile('helm');
              }}
            >
              {t('install.helm')}
            </CustomButton>
            <pre className={classes.installCodeWrapper}>
              <code>{helmCodeExample}</code>
              <button
                className={clsx('copy-code-btn', classes.copyBtn)}
              ></button>
            </pre>
          </div>
          <div className="mb-[40px]">
            <CustomButton
              disabled={isOutOfCalculate}
              variant="outlined"
              startIcon={<DownloadIcon />}
              classes={{
                root: classes.installButton,
              }}
              onClick={() => {
                if (isOutOfCalculate) {
                  return;
                }
                handleDownloadConfigFile('operator');
              }}
            >
              {t('install.operator')}
            </CustomButton>
            <pre className={classes.installCodeWrapper}>
              <code>{operatorCodeExample}</code>
              <button
                className={clsx('copy-code-btn', classes.copyBtn)}
              ></button>
            </pre>
          </div>

          <div className={classes.advCard}>
            <Trans
              t={t}
              i18nKey="install.adv2"
              components={[<a href="#" key="vdb-guidance"></a>]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
