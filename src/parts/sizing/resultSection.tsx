import clsx from 'clsx';
import classes from './index.module.less';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui';
import {
  ExternalLinkIcon,
  ArrowTop,
  DownloadIcon,
  copyIconTpl,
} from '@/components/icons';
import { ICalculateResult } from '@/types/sizing';
import { unitBYTE2Any } from '@/utils/sizingTool';
import {
  milvusOverviewDataCalculator,
  dependencyOverviewDataCalculator,
} from '@/utils/sizingToolV2';
import { DataCard, DependencyComponent } from './dependencyComponent';
import { Trans, useTranslation } from 'react-i18next';
import { useState } from 'react';
import CustomButton from '@/components/customButton';
import { helmCodeExample, operatorCodeExample } from '@/consts/sizing';
import { useCopyCode } from '@/hooks/enhanceCodeBlock';

export default function ResultSection(props: {
  className?: string;
  calculatedResult: ICalculateResult;
}) {
  const { t } = useTranslation('sizingToolV2');
  const { className, calculatedResult } = props;

  const {
    rawDataSize,
    memorySize,
    localDiskSize,
    nodeConfig,
    dependencyConfig,
    mode,
    dependency,
  } = calculatedResult;
  const { queryNode, proxy, mixCoord, dataNode, indexNode } = nodeConfig;

  console.log('mode--', mode);

  const { size: totalRawDataSize, unit: rawDataUnit } =
    unitBYTE2Any(rawDataSize);
  const { size: totalMemorySize, unit: memoryUnit } = unitBYTE2Any(memorySize);
  const { size: diskSize, unit: diskUnit } = unitBYTE2Any(localDiskSize);

  const { milvusCpu, milvusMemory } = milvusOverviewDataCalculator(nodeConfig);
  const { dependencyCpu, dependencyMemory, dependencyStorage } =
    dependencyOverviewDataCalculator({ mode, dependency, dependencyConfig });

  const totalCpu = milvusCpu + dependencyCpu;
  const totalMemory = milvusMemory + dependencyMemory;

  const [isMilvusOpen, setIsMilvusOpen] = useState(false);
  const [isDependencyOpen, setIsDependencyOpen] = useState(false);

  useCopyCode([helmCodeExample, operatorCodeExample]);

  return (
    <section className={clsx(classes.resultContainer, className)}>
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
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            }
            data={`${totalRawDataSize} ${rawDataUnit}`}
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
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            }
            data={`${totalMemorySize} ${memoryUnit}`}
          />
        </div>
      </div>
      <div className="">
        <div className={classes.sectionLabelBar}>
          <h2 className={classes.title}>{t('setup.title')}</h2>
          <a className={classes.buttonWrapper} href="#">
            <span className="">{t('setup.share')}</span>
            <ExternalLinkIcon />
          </a>
        </div>

        <div className={classes.totalDataContent}>
          <div className={classes.dataSummary}>
            <DataCard
              name={t('setup.basic.cpu')}
              data={t('setup.basic.core', { cpu: totalCpu })}
              classname={classes.summaryCard}
              size="large"
            />
            <DataCard
              name={t('setup.basic.memory')}
              data={t('setup.basic.gb', { memory: totalMemory })}
              classname={classes.summaryCard}
              size="large"
            />
            <DataCard
              name={t('setup.basic.storage')}
              data={t('setup.basic.gb', { memory: dependencyStorage })}
              classname={classes.summaryCard}
              size="large"
            />
            <DataCard
              name={t('setup.basic.disk')}
              data={`${diskSize} ${diskUnit}`}
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
                          cpu: milvusCpu,
                          memory: milvusMemory,
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
                          disk: diskSize,
                          unit: diskUnit,
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
                <div className={classes.milvusDataDetail}>
                  <DataCard
                    name={t('setup.milvus.proxy')}
                    data={t('setup.basic.config', {
                      cpu: proxy.cpu,
                      memory: proxy.memory,
                    })}
                    count={proxy.count}
                    classname={classes.detailCard}
                  />
                  <DataCard
                    name={t('setup.milvus.mixCoord')}
                    data={t('setup.basic.config', {
                      cpu: mixCoord.cpu,
                      memory: mixCoord.memory,
                    })}
                    count={mixCoord.count}
                    classname={classes.detailCard}
                  />
                  <DataCard
                    name={t('setup.milvus.dataNode')}
                    data={t('setup.basic.config', {
                      cpu: dataNode.cpu,
                      memory: dataNode.memory,
                    })}
                    count={dataNode.count}
                    classname={classes.detailCard}
                  />
                  <DataCard
                    name={t('setup.milvus.indexNode')}
                    data={t('setup.basic.config', {
                      cpu: indexNode.cpu,
                      memory: indexNode.memory,
                    })}
                    count={indexNode.count}
                    classname={classes.detailCard}
                  />
                  <DataCard
                    name={t('setup.milvus.queryNode')}
                    data={t('setup.basic.config', {
                      cpu: queryNode.cpu,
                      memory: queryNode.memory,
                    })}
                    count={queryNode.count}
                    classname={classes.detailCard}
                  />
                </div>
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
                          cpu: dependencyCpu,
                          memory: dependencyMemory,
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
                          storage: dependencyStorage,
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
                />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        <div className={classes.installationSection}>
          <h2 className={classes.sectionTitle}>{t('install.title')}</h2>
          <div className="mb-[16px]">
            <CustomButton
              variant="outlined"
              startIcon={<DownloadIcon />}
              classes={{
                root: classes.installButton,
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
              variant="outlined"
              startIcon={<DownloadIcon />}
              classes={{
                root: classes.installButton,
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
              i18nKey="install.adv"
              components={[
                <a
                  href="https://zilliz.com/pricing"
                  key="pricing-calculator"
                ></a>,
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
