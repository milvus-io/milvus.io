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
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
} from '@/components/ui';
import {
  ExternalLinkIcon,
  ArrowTop,
  DownloadIcon,
  InfoFilled,
} from '@/components/icons';
import { ICalculateResult, ModeEnum } from '@/types/sizing';
import { formatNumber, unitBYTE2Any } from '@/utils/sizingTool';
import {
  milvusOverviewDataCalculator,
  dependencyOverviewDataCalculator,
  helmYmlGenerator,
  operatorYmlGenerator,
  formatOutOfCalData,
} from '@/utils/sizingTool';
import { DependencyComponent } from './dependencyComponent';
import { Trans, useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import CustomButton from '@/components/customButton';
import {
  helmCodeExample,
  operatorCodeExample,
  HELM_CONFIG_FILE_NAME,
  OPERATOR_CONFIG_FILE_NAME,
  dockerComposeExample,
} from '@/consts/sizing';
import { useCopyCode } from '@/hooks/enhanceCodeBlock';
import { MilvusComponent } from './milvusComponent';

enum InstallTypeEnum {
  Docker = 'docker',
  Helm = 'helm',
  Operator = 'operator',
}

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
  const { size: singleNodeDiskSize, unit: singleNodeDiskUnit } = unitBYTE2Any(
    localDiskSize / queryNode.count
  );

  const { size: diskSize, unit: diskUnit } = unitBYTE2Any(localDiskSize);

  const [isMilvusOpen, setIsMilvusOpen] = useState(true);
  const [isDependencyOpen, setIsDependencyOpen] = useState(true);

  const standaloneInstallOptions = [
    {
      label: t('install.docker'),
      value: InstallTypeEnum.Docker,
      code: dockerComposeExample,
      tip: t('install.tip1'),
      document: '/docs/install_standalone-docker-compose.md',
    },
  ];

  const clusterInstallOptions = [
    {
      label: t('install.helm'),
      value: InstallTypeEnum.Helm,
      code: helmCodeExample,
      tip: t('install.tip2'),
      document: '/docs/install_cluster-helm.md',
    },
    {
      label: t('install.operator'),
      value: InstallTypeEnum.Operator,
      code: operatorCodeExample,
      tip: t('install.tip3'),
      document: '/docs/install_cluster-milvusoperator.md',
    },
  ];

  const [installInfo, setInstallInfo] = useState({
    options: standaloneInstallOptions,
    value: standaloneInstallOptions[0].value,
  });

  const handleDownloadConfigFile = (type: InstallTypeEnum) => {
    const configGenerator =
      type === 'helm' ? helmYmlGenerator : operatorYmlGenerator;
    const config = configGenerator(
      {
        proxy,
        mixCoord,
        indexNode,
        queryNode,
        dataNode,
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

  useEffect(() => {
    const installOptions =
      mode === ModeEnum.Standalone
        ? standaloneInstallOptions
        : clusterInstallOptions;

    setInstallInfo({
      options: installOptions,
      value: installOptions[0].value,
    });
  }, [mode]);

  return (
    <section className={clsx(classes.resultContainer, className)}>
      {isOutOfCalculate && (
        <div className={classes.substantialWrapper}>
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
      <h2 className="flex justify-between items-center gap-[24px] mb-[12px]">
        <span className="font-[600] text-[14px] leading-[22px]">
          {t('overview.title')}
        </span>
        <a
          className="flex items-center gap-[4px] font-[400] text-[12px] leading-[18px] text-black1 hover:underline"
          href="https://zilliz.com/pricing#calculator"
          target="_blank"
        >
          {t('overview.explore')}
          <ExternalLinkIcon />
        </a>
      </h2>

      <div className="bg-gary2 pt-[20px] pb-[20px] rounded-[12px] mb-[24px]">
        <div className="flex items-center justify-between pb-[10px] pl-[20px] pr-[20px] border-b border-solid border-black4">
          <p className={classes.commonKeyLabel}>{t('overview.overview')}</p>
          <div className="flex items-center gap-[16px]">
            <div className="flex items-center gap-[4px]">
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger
                    className={clsx(
                      classes.commonKeyLabel,
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
              <span className={classes.commonValueLabel}>
                {formatOutOfCalData({
                  data: `${totalRawDataSize} ${rawDataUnit}`,
                  isOut: isOutOfCalculate,
                })}
              </span>
            </div>
            <div className="flex items-center gap-[4px]">
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger
                    className={clsx(
                      classes.commonKeyLabel,
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
              <span className={classes.commonValueLabel}>
                {formatOutOfCalData({
                  data: `${totalLoadingMemorySize} ${memoryUnit}`,
                  isOut: isOutOfCalculate,
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="p-[20px] border-b border-solid border-black4 flex gap-[20px] justify-evenly">
          <div className="flex-[1]">
            <p className={clsx('mb-[6px]', classes.font14Bold)}>
              {t('setup.basic.cpu')}
            </p>
            <p className={clsx('text-blue1', classes.font16Bold)}>
              {formatOutOfCalData({
                data: t('setup.basic.core', {
                  cpu: `${totalCpu.num} ${totalCpu.unit}`,
                }),
                isOut: isOutOfCalculate,
              })}
            </p>
          </div>
          <div className="flex-[1]">
            <p className={clsx('mb-[6px]', classes.font14Bold)}>
              {t('setup.basic.memory')}
            </p>
            <p className={clsx('text-blue1', classes.font16Bold)}>
              {formatOutOfCalData({
                data: `${totalMemory.size} ${totalMemory.unit}`,
                isOut: isOutOfCalculate,
              })}
            </p>
          </div>
          <div className="flex-[1]">
            <p className={clsx('mb-[6px]', classes.font14Bold)}>
              {t('setup.basic.storage')}
            </p>
            <p className={clsx('text-blue1', classes.font16Bold)}>
              {formatOutOfCalData({
                data: `${dependencyStorageSize} ${dependencyStorageUnit}`,
                isOut: isOutOfCalculate,
              })}
            </p>
          </div>
          <div className="flex-[1]">
            <p className={clsx('mb-[6px]', classes.font14Bold)}>
              {t('setup.basic.disk')}
            </p>
            <p className={clsx('text-blue1', classes.font16Bold)}>
              {formatOutOfCalData({
                data: `${diskSize} ${diskUnit}`,
                isOut: isOutOfCalculate,
              })}
            </p>
          </div>
        </div>

        <div className="p-[20px] pb-[0px]">
          <div className="pb-[20px] border-b border-solid border-black4">
            <Collapsible
              onOpenChange={isOpen => {
                setIsMilvusOpen(isOpen);
              }}
              open={isMilvusOpen}
            >
              <CollapsibleTrigger className={classes.commonCollapseTitle}>
                <span
                  className={clsx(classes.collapseIcon, {
                    [classes.activeIcon]: isMilvusOpen,
                  })}
                >
                  <ArrowDown />
                </span>
                <div className={classes.collapseTitle}>
                  <p className="font-[600] text-[12px] leading-[18px]">
                    {t('setup.milvus.title')}
                  </p>
                  <div className="flex items-center gap-[12px]">
                    <p className={classes.commonKeyLabel}>
                      {t('setup.basic.cpu')}:&nbsp;
                      <span className="inline-block font-[600] text-[12px] leading-[18px] text-black1 w-[65px] text-left">
                        {formatOutOfCalData({
                          data: `${milvusCpuData.num} ${milvusCpuData.unit} Core`,
                          isOut: isOutOfCalculate,
                        })}
                      </span>
                    </p>
                    <p className={classes.commonKeyLabel}>
                      {t('setup.basic.memory')}:&nbsp;
                      <span className="inline-block font-[600] text-[12px] leading-[18px] text-black1 w-[65px] text-left">
                        {formatOutOfCalData({
                          data: `${milvusMemoryData.size} ${milvusMemoryData.unit}`,
                          isOut: isOutOfCalculate,
                        })}
                      </span>
                    </p>
                    <p className={classes.commonKeyLabel}>
                      <Trans
                        t={t}
                        i18nKey="setup.basic.diskWithValue"
                        values={{
                          disk: formatOutOfCalData({
                            data: `${diskSize} ${diskUnit}`,
                            isOut: isOutOfCalculate,
                          }),
                        }}
                        components={[
                          <span
                            key="value"
                            className="font-[600] text-[12px] leading-[18px] text-black1 inline-block w-[65px] text-left"
                          ></span>,
                        ]}
                      />
                    </p>
                  </div>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <MilvusComponent
                  standaloneNodeConfig={standaloneNodeConfig}
                  clusterNodeConfig={clusterNodeConfig}
                  isOutOfCalculate={isOutOfCalculate}
                  diskSize={singleNodeDiskSize}
                  diskUnit={singleNodeDiskUnit}
                  mode={mode}
                  rawDataSize={rawDataSize}
                  memorySize={memorySize}
                />
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div className="pt-[20px]">
            <Collapsible
              onOpenChange={isOpen => {
                setIsDependencyOpen(isOpen);
              }}
              open={isDependencyOpen}
            >
              <CollapsibleTrigger className={classes.commonCollapseTitle}>
                <span
                  className={clsx(classes.collapseIcon, {
                    [classes.activeIcon]: isDependencyOpen,
                  })}
                >
                  <ArrowDown />
                </span>
                <div className={classes.collapseTitle}>
                  <p className="font-[600] text-[12px] leading-[18px]">
                    {t('setup.dependency.title')}
                  </p>
                  <div className="flex items-center gap-[12px]">
                    <p className={classes.commonKeyLabel}>
                      {t('setup.basic.cpu')}:&nbsp;
                      <span className="font-[600] text-[12px] leading-[18px] text-black1 inline-block w-[65px] text-left">
                        {formatOutOfCalData({
                          data: `${dependencyCpuData.num}${dependencyCpuData.unit} Core`,
                          isOut: isOutOfCalculate,
                        })}
                      </span>
                    </p>
                    <p className={classes.commonKeyLabel}>
                      {t('setup.basic.memory')}:&nbsp;
                      <span className="font-[600] text-[12px] leading-[18px] text-black1 inline-block w-[65px] text-left">
                        {formatOutOfCalData({
                          data: `${dependencyMemoryData.size} ${dependencyMemoryData.unit}`,
                          isOut: isOutOfCalculate,
                        })}
                      </span>
                    </p>
                    <p className={classes.commonKeyLabel}>
                      {t('setup.basic.storage')}:&nbsp;
                      <span className="font-[600] text-[12px] leading-[18px] text-black1 inline-block w-[65px] text-left">
                        {formatOutOfCalData({
                          data: `${dependencyStorageSize} ${dependencyStorageUnit}`,
                          isOut: isOutOfCalculate,
                        })}
                      </span>
                    </p>
                  </div>
                </div>
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
      </div>

      <div className="">
        <div className="flex items-center justify-between gap-[16px] mb-[12px]">
          <p className={classes.font14Bold}>{t('install.title')}</p>
          <Select
            onValueChange={v => {
              setInstallInfo(installInfo => ({
                ...installInfo,
                value: v as InstallTypeEnum,
              }));
            }}
            disabled={mode === ModeEnum.Standalone}
          >
            <SelectTrigger
              className="py-[10px] px-[12px] h-[36px] w-[300px] text-[12px] leading-[18px] text-black1 border-[1px] border-solid border-black4 rounded-[8px]"
              disabled={mode === ModeEnum.Standalone}
            >
              {
                installInfo.options.find(v => v.value === installInfo.value)
                  ?.label
              }
            </SelectTrigger>

            <SelectContent>
              {installInfo.options.map(v => (
                <SelectItem key={v.value} value={v.value}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {installInfo.value !== InstallTypeEnum.Docker && (
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
              handleDownloadConfigFile(installInfo.value);
            }}
          >
            {installInfo.value === 'helm'
              ? t('install.helm')
              : t('install.operator')}
          </CustomButton>
        )}
        <pre className={classes.installCodeWrapper}>
          <code>
            {installInfo.options.find(v => v.value === installInfo.value)?.code}
          </code>
          <button className={clsx('copy-code-btn', classes.copyBtn)}></button>
        </pre>

        <a
          className="flex items-center just gap-[4px] text-[12px] leading-[18px] text-black1 hover:underline"
          href={
            installInfo.options.find(v => v.value === installInfo.value)
              ?.document
          }
          target="_blank"
        >
          {installInfo.options.find(v => v.value === installInfo.value)?.tip}
          <ExternalLinkIcon />
        </a>
      </div>
    </section>
  );
}

const ArrowDown = () => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.6608 12.3945C11.261 12.8743 10.5242 12.8743 10.1244 12.3945L7.2594 8.95659C6.71662 8.30526 7.17978 7.31641 8.02762 7.31641H13.7575C14.6054 7.31641 15.0685 8.30526 14.5258 8.95659L11.6608 12.3945Z"
      fill="#667176"
    />
  </svg>
);
