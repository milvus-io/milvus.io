import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui';
import { ExternalLinkIcon } from '@/components/icons';
import { DataCard } from '@/parts/sizingCommon';
import commonClasses from '@/parts/sizingCommon/index.module.css';
import classes from './index.module.css';
import { IGpuSnapshot } from './config';
import { formatGpuBytes, formatGpuNumber } from './format';
import {
  GPU_INDEX_BREAKDOWN_KEYS,
  GPU_INDEX_SHORT_LABELS,
  GPU_MEMORY_SAFETY_FACTOR,
  GPU_VALIDATION_ERROR_CODES,
} from '@/consts/sizingGpu';
import {
  GpuLifecycleStageEnum,
  GpuValidationErrorEnum,
  IGpuIndexMemory,
  ModeEnum,
  NodesValueType,
} from '@/types/sizingGpu';

const CLOUD_CALCULATOR_LINK = 'https://zilliz.com/pricing#calculator';

const STAGE_LABEL_KEYS: Record<GpuLifecycleStageEnum, string> = {
  [GpuLifecycleStageEnum.Build]: 'gpu.result.stageBuild',
  [GpuLifecycleStageEnum.Resident]: 'gpu.result.stageResident',
  [GpuLifecycleStageEnum.Equal]: 'gpu.result.stageEqual',
};

/** Same chevron the CPU result section uses for its collapsible sections. */
const ArrowDown = () => (
  <svg
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 8.5L10 13.5L15 8.5"
      stroke="#00131A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface INodeRow {
  key: string;
  name: string;
  tip: string;
  config: NodesValueType;
}

interface GpuResultSectionProps {
  className?: string;
  snapshot: IGpuSnapshot;
  error: GpuValidationErrorEnum | null;
}

export default function GpuResultSection(props: GpuResultSectionProps) {
  const { className, snapshot, error } = props;
  const { t } = useTranslation('sizingTool');

  const [isMilvusOpen, setIsMilvusOpen] = useState(true);
  const [isCalculationOpen, setIsCalculationOpen] = useState(true);

  const { params, result, cpuBaseline } = snapshot;
  const {
    rawDataSize,
    memorySize,
    segmentRowCount,
    segmentCount,
    segmentIndexMemory,
    segmentBuildTemporaryMemory,
    buildMemorySize,
    residentMemorySize,
    lifecycleMaxMemorySize,
    gpuMemorySize,
    limitingStage,
    clusterNodeConfig,
    standaloneNodeConfig,
    mode,
  } = result;

  const indexType = params.indexType;
  const isStandalone = mode === ModeEnum.Standalone;
  const stageLabel = t(STAGE_LABEL_KEYS[limitingStage]);

  const buildIsLimiting =
    limitingStage === GpuLifecycleStageEnum.Build ||
    limitingStage === GpuLifecycleStageEnum.Equal;
  const residentIsLimiting =
    limitingStage === GpuLifecycleStageEnum.Resident ||
    limitingStage === GpuLifecycleStageEnum.Equal;

  const breakdownRows = useMemo(
    () =>
      GPU_INDEX_BREAKDOWN_KEYS[indexType]
        .map(key => ({
          key,
          value: segmentIndexMemory[key as keyof IGpuIndexMemory],
        }))
        .filter(row => typeof row.value === 'number') as {
        key: string;
        value: number;
      }[],
    [indexType, segmentIndexMemory]
  );

  const nodeRows = useMemo<INodeRow[]>(() => {
    if (isStandalone) {
      return [
        {
          key: 'standaloneNode',
          name: t('setup.milvus.standaloneNode'),
          tip: '',
          config: standaloneNodeConfig,
        },
      ];
    }

    return [
      {
        key: 'proxy',
        name: t('setup.milvus.proxy'),
        tip: t('setup.milvus.proxyTip'),
        config: clusterNodeConfig.proxy,
      },
      {
        key: 'mixCoord',
        name: t('setup.milvus.mixCoord'),
        tip: t('setup.milvus.mixCoordTip'),
        config: clusterNodeConfig.mixCoord,
      },
      {
        key: 'dataNode',
        name: t('setup.milvus.dataNode'),
        tip: t('setup.milvus.dataNodeTip'),
        config: clusterNodeConfig.dataNode,
      },
      {
        key: 'streamNode',
        name: t('setup.milvus.streamNode'),
        tip: t('setup.milvus.streamNodeTip'),
        config: clusterNodeConfig.streamNode,
      },
      {
        key: 'queryNode',
        name: t('setup.milvus.queryNode'),
        tip: t('setup.milvus.queryNodeTip'),
        config: clusterNodeConfig.queryNode,
      },
    ];
  }, [isStandalone, standaloneNodeConfig, clusterNodeConfig, t]);

  const totals = useMemo(
    () =>
      nodeRows.reduce(
        (acc, row) => ({
          cpu: acc.cpu + row.config.cpu * row.config.count,
          memory: acc.memory + row.config.memory * row.config.count,
          gpuMemory:
            acc.gpuMemory + (row.config.gpuMemory || 0) * row.config.count,
        }),
        { cpu: 0, memory: 0, gpuMemory: 0 }
      ),
    [nodeRows]
  );

  const compareRows = useMemo(
    () => [
      {
        key: 'raw',
        metric: t('gpu.result.compareRaw'),
        cpu: formatGpuBytes(cpuBaseline.rawDataSize),
        gpu: formatGpuBytes(rawDataSize),
      },
      {
        key: 'host',
        metric: t('gpu.result.compareHost'),
        cpu: formatGpuBytes(cpuBaseline.memorySize),
        gpu: formatGpuBytes(memorySize),
      },
      {
        key: 'vram',
        metric: t('gpu.result.compareVram'),
        cpu: '--',
        gpu: formatGpuBytes(gpuMemorySize),
      },
      {
        key: 'stage',
        metric: t('gpu.result.compareStage'),
        cpu: t('gpu.result.stageLoad'),
        gpu: stageLabel,
      },
    ],
    [cpuBaseline, rawDataSize, memorySize, gpuMemorySize, stageLabel, t]
  );

  return (
    <section className={clsx(commonClasses.resultContainer, className)}>
      {error && (
        <div className={classes.errorWrapper} role="alert">
          <p className={classes.errorCode}>
            {GPU_VALIDATION_ERROR_CODES[error]}
          </p>
          <p className={classes.errorMessage}>{t(`gpu.errors.${error}`)}</p>
        </div>
      )}

      <h2 className="flex justify-between items-center gap-[24px] mb-[12px]">
        <span className="font-[600] text-[14px] leading-[22px]">
          {t('overview.title')}
        </span>
        <a
          className="flex items-center gap-[4px] font-[400] text-[12px] leading-[18px] text-black1 hover:underline"
          href={CLOUD_CALCULATOR_LINK}
          target="_blank"
        >
          {t('overview.explore')}
          <ExternalLinkIcon />
        </a>
      </h2>

      <div className="bg-gary2 pt-[20px] pb-[20px] rounded-[12px] mb-[24px]">
        <div className="flex items-center justify-between pb-[10px] pl-[20px] pr-[20px] border-b border-solid border-black4">
          <p className={commonClasses.commonKeyLabel}>
            {t('overview.overview')}
          </p>
          <div className="flex items-center gap-[16px]">
            <div className="flex items-center gap-[4px]">
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger
                    className={clsx(
                      commonClasses.commonKeyLabel,
                      commonClasses.tooltipTrigger
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
              <span className={commonClasses.commonValueLabel}>
                {formatGpuBytes(rawDataSize)}
              </span>
            </div>
            <div className="flex items-center gap-[4px]">
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger
                    className={clsx(
                      commonClasses.commonKeyLabel,
                      commonClasses.tooltipTrigger
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
              <span className={commonClasses.commonValueLabel}>
                {formatGpuBytes(memorySize)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-[20px] border-b border-solid border-black4 flex gap-[20px] justify-evenly">
          <div className="flex-[1]">
            <p className={clsx('mb-[6px]', commonClasses.font14Bold)}>
              {t('gpu.result.gpuMemory')}
            </p>
            <p className={clsx('text-blue1', commonClasses.font16Bold)}>
              {formatGpuBytes(gpuMemorySize)}
            </p>
          </div>
          <div className="flex-[1]">
            <p className={clsx('mb-[6px]', commonClasses.font14Bold)}>
              {t('setup.basic.cpu')}
            </p>
            <p className={clsx('text-blue1', commonClasses.font16Bold)}>
              {t('setup.basic.core', { cpu: formatGpuNumber(totals.cpu) })}
            </p>
          </div>
          <div className="flex-[1]">
            <p className={clsx('mb-[6px]', commonClasses.font14Bold)}>
              {t('setup.basic.memory')}
            </p>
            <p className={clsx('text-blue1', commonClasses.font16Bold)}>
              {t('setup.basic.gb', { memory: formatGpuNumber(totals.memory) })}
            </p>
          </div>
        </div>

        <div className="px-[20px] pt-[16px]">
          <p className={classes.stageNote}>
            {t('gpu.result.gpuMemoryNote', {
              stage: stageLabel,
              value: formatGpuBytes(lifecycleMaxMemorySize),
              factor: GPU_MEMORY_SAFETY_FACTOR,
            })}
          </p>
          {buildIsLimiting && (
            <p className={clsx('mt-[12px]', classes.warningCallout)}>
              {segmentCount === 1
                ? t('gpu.result.buildLimitingSingle')
                : t('gpu.result.buildLimitingMulti', {
                    value: formatGpuBytes(segmentBuildTemporaryMemory),
                    segments: formatGpuNumber(segmentCount),
                  })}
            </p>
          )}
        </div>

        <div className="p-[20px] pb-[0px]">
          <div className="pb-[20px] border-b border-solid border-black4">
            <Collapsible open={isMilvusOpen} onOpenChange={setIsMilvusOpen}>
              <CollapsibleTrigger className={commonClasses.commonCollapseTitle}>
                <span
                  className={clsx(commonClasses.collapseIcon, {
                    [commonClasses.activeIcon]: isMilvusOpen,
                  })}
                >
                  <ArrowDown />
                </span>
                <div className={commonClasses.collapseTitle}>
                  <p className="font-[600] text-[12px] leading-[18px]">
                    {t('setup.milvus.title')}
                  </p>
                  <div className="flex items-center gap-[12px]">
                    <p className={commonClasses.commonKeyLabel}>
                      {t('setup.basic.cpu')}:&nbsp;
                      <span className="inline-block font-[600] text-[12px] leading-[18px] text-black1 text-left">
                        {t('setup.basic.core', {
                          cpu: formatGpuNumber(totals.cpu),
                        })}
                      </span>
                    </p>
                    <p className={commonClasses.commonKeyLabel}>
                      {t('setup.basic.memory')}:&nbsp;
                      <span className="inline-block font-[600] text-[12px] leading-[18px] text-black1 text-left">
                        {t('setup.basic.gb', {
                          memory: formatGpuNumber(totals.memory),
                        })}
                      </span>
                    </p>
                    <p className={commonClasses.commonKeyLabel}>
                      {t('gpu.result.vram')}:&nbsp;
                      <span className="inline-block font-[600] text-[12px] leading-[18px] text-blue1 text-left">
                        {formatGpuBytes(totals.gpuMemory)}
                      </span>
                    </p>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className={commonClasses.milvusDataDetail}>
                  {nodeRows.map(row => (
                    <DataCard
                      key={row.key}
                      classname={commonClasses.detailCard}
                      name={
                        row.tip ? (
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger
                                className={clsx(
                                  commonClasses.commonKeyLabel,
                                  commonClasses.tooltipTrigger
                                )}
                              >
                                {row.name}
                              </TooltipTrigger>
                              <TooltipContent
                                sideOffset={5}
                                className="w-[280px]"
                              >
                                {row.tip}
                                <TooltipArrow />
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          row.name
                        )
                      }
                      data={t('setup.basic.config', {
                        cpu: row.config.cpu,
                        memory: row.config.memory,
                      })}
                      desc={
                        row.config.gpuMemory ? (
                          <span className="text-blue1 font-[500]">
                            {t('gpu.result.vramWithValue', {
                              vram: formatGpuBytes(row.config.gpuMemory),
                            })}
                          </span>
                        ) : undefined
                      }
                      count={row.config.count}
                    />
                  ))}
                </div>
                <p className={clsx('mt-[12px]', classes.footnote)}>
                  {t('gpu.result.componentsNote')}
                </p>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        <div className="p-[20px] pb-[0px]">
          <Collapsible
            open={isCalculationOpen}
            onOpenChange={setIsCalculationOpen}
          >
            <CollapsibleTrigger className={commonClasses.commonCollapseTitle}>
              <span
                className={clsx(commonClasses.collapseIcon, {
                  [commonClasses.activeIcon]: isCalculationOpen,
                })}
              >
                <ArrowDown />
              </span>
              <div className={commonClasses.collapseTitle}>
                <p className="font-[600] text-[12px] leading-[18px]">
                  {t('gpu.result.coreCalculation')}
                </p>
                <p className={commonClasses.commonKeyLabel}>
                  {t('gpu.result.segmentCount')}:&nbsp;
                  <span className="inline-block font-[600] text-[12px] leading-[18px] text-black1 text-left">
                    {formatGpuNumber(segmentCount)}
                  </span>
                </p>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className={commonClasses.milvusDataDetail}>
                <DataCard
                  classname={commonClasses.detailCard}
                  name={t('gpu.result.bytesPerRow')}
                  data={`${formatGpuNumber(params.d * 4)} B`}
                />
                <DataCard
                  classname={commonClasses.detailCard}
                  name={t('gpu.result.rowsPerSegment')}
                  data={formatGpuNumber(segmentRowCount)}
                />
                <DataCard
                  classname={commonClasses.detailCard}
                  name={t('gpu.result.segmentCount')}
                  data={formatGpuNumber(segmentCount)}
                />
              </div>

              <p className={clsx('mt-[16px] mb-[8px]', classes.subTitle)}>
                {t('gpu.result.perSegmentMemory')}
              </p>
              <ul className={classes.breakdownList}>
                {breakdownRows.map(row => (
                  <li className={classes.detailRow} key={row.key}>
                    <span className={commonClasses.commonKeyLabel}>
                      {row.key}
                    </span>
                    <span className={classes.detailValue}>
                      {formatGpuBytes(row.value)}
                    </span>
                  </li>
                ))}
                <li className={clsx(classes.detailRow, classes.totalRow)}>
                  <span className="font-[600] text-[12px] leading-[18px]">
                    {t('gpu.result.totalPerSegment')}
                  </span>
                  <span className={classes.detailValue}>
                    {formatGpuBytes(segmentIndexMemory.total)}
                  </span>
                </li>
              </ul>

              <p className={clsx('mt-[16px] mb-[8px]', classes.subTitle)}>
                {t('gpu.result.lifecyclePeak')}
              </p>
              <div className={classes.stageWrapper}>
                <div
                  className={clsx(classes.stageCard, {
                    [classes.stageCardActive]: buildIsLimiting,
                  })}
                >
                  <div className="flex items-center gap-[8px] mb-[4px]">
                    <span className={commonClasses.commonKeyLabel}>
                      {t('gpu.result.buildPeak')}
                    </span>
                    {buildIsLimiting && (
                      <span className={classes.limitingTag}>
                        {t('gpu.result.limiting')}
                      </span>
                    )}
                  </div>
                  <p className="font-[500] text-[12px] leading-[18px] text-black1">
                    {formatGpuBytes(buildMemorySize)}
                  </p>
                  <p className={classes.stageCaption}>
                    {t('gpu.result.buildPeakDesc', {
                      value: formatGpuBytes(segmentBuildTemporaryMemory),
                    })}
                  </p>
                </div>
                <div
                  className={clsx(classes.stageCard, {
                    [classes.stageCardActive]: residentIsLimiting,
                  })}
                >
                  <div className="flex items-center gap-[8px] mb-[4px]">
                    <span className={commonClasses.commonKeyLabel}>
                      {t('gpu.result.resident')}
                    </span>
                    {residentIsLimiting && (
                      <span className={classes.limitingTag}>
                        {t('gpu.result.limiting')}
                      </span>
                    )}
                  </div>
                  <p className="font-[500] text-[12px] leading-[18px] text-black1">
                    {formatGpuBytes(residentMemorySize)}
                  </p>
                  <p className={classes.stageCaption}>
                    {t('gpu.result.residentDesc', {
                      segments: formatGpuNumber(segmentCount),
                    })}
                  </p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      <h2 className="flex justify-between items-center gap-[24px] mb-[12px]">
        <span className="font-[600] text-[14px] leading-[22px]">
          {t('gpu.result.compare')}
        </span>
        <span className={commonClasses.commonKeyLabel}>
          {t('gpu.result.compareDesc')}
        </span>
      </h2>
      <div className="bg-gary2 rounded-[12px] p-[20px] mb-[24px]">
        <div className={clsx(classes.compareRow, classes.compareHead)}>
          <span className={commonClasses.commonKeyLabel}>
            {t('gpu.result.metric')}
          </span>
          <span className={commonClasses.commonKeyLabel}>
            {t('gpu.result.cpuBaseline')}
          </span>
          <span className={clsx(commonClasses.commonKeyLabel, 'text-blue1')}>
            {`GPU (${GPU_INDEX_SHORT_LABELS[indexType]})`}
          </span>
        </div>
        {compareRows.map(row => (
          <div className={classes.compareRow} key={row.key}>
            <span className={commonClasses.commonKeyLabel}>{row.metric}</span>
            <span className="text-[12px] leading-[18px] font-[400] text-black1">
              {row.cpu}
            </span>
            <span className="text-[12px] leading-[18px] font-[500] text-black1">
              {row.gpu}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
