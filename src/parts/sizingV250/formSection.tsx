import { use, useEffect, useMemo, useRef, useState } from 'react';
import classes from './index.module.less';
import { SizingInput, SizingRange, SizingSwitch } from '@/components/sizing';
import {
  Collapsible,
  Checkbox,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
} from '@/components/ui';
import {
  VECTOR_RANGE_CONFIG,
  DIMENSION_RANGE_CONFIG,
  MAX_NODE_DEGREE_RANGE_CONFIG,
  SEGMENT_SIZE_OPTIONS,
  INDEX_TYPE_OPTIONS,
  DEPENDENCY_COMPONENTS,
  MODE_OPTIONS,
  N_LIST_RANGE_CONFIG,
  M_RANGE_CONFIG,
  MAXIMUM_AVERAGE_LENGTH,
} from '@/consts/sizingV250';
import clsx from 'clsx';
import {
  ICalculateResult,
  IIndexType,
  IndexTypeEnum,
  ModeEnum,
} from '@/types/sizingV250';
import { IndexTypeComponent } from './indexTypeComponent';
import {
  memoryAndDiskCalculator,
  rawDataSizeCalculator,
  $10M768D,
  $50M768D,
  $500M768D,
  $100M768D,
  dependencyCalculator,
  $1B768D,
  clusterNodesConfigCalculator,
  standaloneNodeConfigCalculator,
} from '@/utils/sizingToolV250';
import { Trans, useTranslation } from 'react-i18next';
import { TooltipArrow } from '@radix-ui/react-tooltip';
import { ExternalLinkIcon } from '@/components/icons';
import { KafkaIcon, PulsarIcon } from './components';

const NORMAL_CHANGE_THRESHOLD = $10M768D;
const DISKANN_MODE_CHANGE_THRESHOLD = $50M768D;

export default function FormSection(props: {
  className: string;
  updateCalculatedResult: (params: ICalculateResult) => void;
}) {
  const { t } = useTranslation('sizingTool');
  const { className, updateCalculatedResult } = props;

  // const [collapseHeight, setCollapseHeight] = useState(0);
  const collapseEle = useRef<HTMLDivElement | null>(null);

  const [manuallySelectedMode, setManuallySelectedMode] = useState<
    ModeEnum | undefined
  >(undefined);
  const [rawDataSize, setRawDataSize] = useState(0);

  const [form, setForm] = useState({
    vector: VECTOR_RANGE_CONFIG.defaultValue,
    dimension: DIMENSION_RANGE_CONFIG.defaultValue,
    widthScalar: false,
    scalarData: {
      averageNum: 0,
      averageString: '',
      offLoading: false,
    },
    segmentSize: SEGMENT_SIZE_OPTIONS[1].value,
    dependency: DEPENDENCY_COMPONENTS[0].value,
    mode: MODE_OPTIONS[0].value,
  });

  const [indexTypeParams, setIndexTypeParams] = useState<IIndexType>({
    indexType: INDEX_TYPE_OPTIONS[0].value,
    widthRawData: false,
    maxDegree: MAX_NODE_DEGREE_RANGE_CONFIG.defaultValue,
    flatNList: N_LIST_RANGE_CONFIG.defaultValue,
    sq8NList: N_LIST_RANGE_CONFIG.defaultValue,
    m: M_RANGE_CONFIG.defaultValue,
  });

  // const [disableStandalone, setDisableStandalone] = useState(false);
  const modeChangeThreshold = useMemo(() => {
    return indexTypeParams.indexType === IndexTypeEnum.DISKANN
      ? DISKANN_MODE_CHANGE_THRESHOLD
      : NORMAL_CHANGE_THRESHOLD;
  }, [indexTypeParams.indexType]);

  const handleFormChange = (key: string, value: any) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const handleIndexTypeParamsChange = (key: string, value: any) => {
    setIndexTypeParams({
      ...indexTypeParams,
      [key]: value,
    });
  };

  const handleAverageLengthChange = (e: any) => {
    let lengthString = e.target.value;
    let lengthNum = Number(lengthString);
    if (Number.isNaN(lengthNum) && lengthString !== '') {
      return;
    }
    if (lengthString === '') {
      lengthNum = 0;
    }

    if (Number(lengthString) > MAXIMUM_AVERAGE_LENGTH) {
      lengthString = `${MAXIMUM_AVERAGE_LENGTH}`;
    }
    length = Math.min(length, MAXIMUM_AVERAGE_LENGTH);
    setForm({
      ...form,
      scalarData: {
        ...form.scalarData,
        averageNum: lengthNum,
        averageString: lengthString,
      },
    });
  };

  const handleOffLoadingChange = (value: boolean) => {
    setForm({
      ...form,
      scalarData: {
        ...form.scalarData,
        offLoading: value,
      },
    });
  };

  // useEffect(() => {
  //   const targetEle = collapseEle?.current;
  //   const height = targetEle.offsetHeight;
  //   setCollapseHeight(height);
  // }, []);

  const selectedSegmentSize = useMemo(() => {
    return SEGMENT_SIZE_OPTIONS.find(v => v.value === form.segmentSize);
  }, [form.segmentSize]);

  const dependencyOptions = [
    {
      ...DEPENDENCY_COMPONENTS[0],
      icon: <PulsarIcon />,
    },
    {
      ...DEPENDENCY_COMPONENTS[1],
      icon: <KafkaIcon />,
    },
  ];

  const modeOptions = [
    {
      ...MODE_OPTIONS[0],
      desc: t('form.standaloneDesc'),
    },
    {
      ...MODE_OPTIONS[1],
      desc: t('form.clusterDesc'),
    },
  ];

  useEffect(() => {
    if (form.widthScalar === false) {
      setForm({
        ...form,
        scalarData: {
          averageString: '',
          averageNum: 0,
          offLoading: false,
        },
      });
    }
  }, [form.widthScalar]);

  useEffect(() => {
    const rawDataSize = rawDataSizeCalculator({
      num: form.vector,
      d: form.dimension,
      withScalar: form.widthScalar,
      scalarAvg: form.scalarData.averageNum,
    });
    setRawDataSize(rawDataSize);
  }, [
    form.vector,
    form.dimension,
    form.widthScalar,
    form.scalarData.averageNum,
  ]);

  useEffect(() => {
    let mode =
      rawDataSize > modeChangeThreshold
        ? ModeEnum.Cluster
        : ModeEnum.Standalone;
    // if manually selected cluster mode, can't change to standalone automatically
    if (manuallySelectedMode === ModeEnum.Cluster) {
      mode = ModeEnum.Cluster;
    }
    setForm({
      ...form,
      mode: manuallySelectedMode || mode,
    });
  }, [rawDataSize, modeChangeThreshold]);

  useEffect(() => {
    const currentMode = form.mode;

    const { memory, disk: localDisk } = memoryAndDiskCalculator({
      rawDataSize,
      indexTypeParams,
      d: form.dimension,
      num: form.vector,
      withScalar: form.widthScalar,
      offLoading: form.scalarData.offLoading,
      scalarAvg: form.scalarData.averageNum,
      segSize: Number(form.segmentSize),
      mode: currentMode,
    });

    const standaloneNodeConfig = standaloneNodeConfigCalculator({
      memory: memory,
    });

    const clusterNodeConfig = clusterNodesConfigCalculator({
      memory: memory,
    });

    const dependencyConfig = dependencyCalculator({
      num: form.vector,
      d: form.dimension,
      withScalar: form.widthScalar,
      scalarAvg: form.scalarData.averageNum,
      mode: currentMode,
      loadingMemory: memory,
    });

    updateCalculatedResult({
      rawDataSize,
      memorySize: memory,
      localDiskSize: localDisk,
      clusterNodeConfig,
      standaloneNodeConfig,
      dependencyConfig: dependencyConfig,
      mode: currentMode,
      dependency: form.dependency,
      isOutOfCalculate: rawDataSize > $1B768D,
    });
  }, [form, indexTypeParams]);

  const disableStandalone = useMemo(() => {
    const disableThreshold =
      indexTypeParams.indexType === IndexTypeEnum.DISKANN
        ? $500M768D
        : $100M768D;
    return rawDataSize > disableThreshold;
  }, [rawDataSize, indexTypeParams.indexType]);

  return (
    <section className={clsx(className, classes.formSection)}>
      <div className={classes.singlePart}>
        <div className="mb-[24px]">
          <SizingRange
            rangeConfig={VECTOR_RANGE_CONFIG}
            label={t('form.num')}
            onRangeChange={val => {
              handleFormChange('vector', val);
            }}
            value={form.vector}
            unit="Million"
            // placeholder={`[${VECTOR_RANGE_CONFIG.min}, ${VECTOR_RANGE_CONFIG.max}]`}
          />
        </div>
        <div className="mb-[24px]">
          <SizingRange
            rangeConfig={DIMENSION_RANGE_CONFIG}
            label={t('form.dim')}
            onRangeChange={val => {
              handleFormChange('dimension', val);
            }}
            value={form.dimension}
            placeholder={`[${DIMENSION_RANGE_CONFIG.min}, ${DIMENSION_RANGE_CONFIG.max}]`}
          />
        </div>
        <div className="mb-[24px]">
          <h4 className="flex items-center justify-between mb-[8px]">
            <span className="font-[600] text-[14px] leading-[22px] text-black1">
              {t('form.indexType')}
            </span>
            <a
              className="flex items-center gap-[4px] font-[400] text-[12px] leading-[16px] text-black1 hover:underline"
              href="/docs/index.md?tab=floating"
              target="_blank"
            >
              {t('form.indexTypeTip')}
              <ExternalLinkIcon />
            </a>
          </h4>

          <Select
            value={indexTypeParams.indexType}
            onValueChange={val => {
              handleIndexTypeParamsChange('indexType', val);
            }}
          >
            <SelectTrigger className={classes.selectTrigger}>
              {indexTypeParams.indexType}
            </SelectTrigger>
            <SelectContent>
              {INDEX_TYPE_OPTIONS.map(v => (
                <SelectItem
                  key={v.value}
                  value={v.value}
                  className={classes.selectItem}
                >
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <IndexTypeComponent
            data={indexTypeParams}
            onChange={handleIndexTypeParamsChange}
          />
        </div>
        <div className="">
          <div className="flex items-center gap-[8px]">
            <p className="text-[14px] leading-[22px] font-[600]">
              {t('form.withScalar')}
            </p>
            <SizingSwitch
              checked={form.widthScalar}
              onCheckedChange={value => {
                handleFormChange('widthScalar', value);
              }}
            />
          </div>
          <Collapsible
            open={form.widthScalar}
            className={clsx(classes.collapsible, {
              [classes.visibleCollapse]: form.widthScalar,
              [classes.invisibleCollapse]: !form.widthScalar,
            })}
          >
            <div className="" ref={collapseEle}>
              <SizingInput
                label={t('form.averageLength')}
                unit={t('setup.basic.byte')}
                value={form.scalarData.averageString}
                onChange={handleAverageLengthChange}
                fullWidth
                classes={{
                  root: classes.marginBtm20,
                  label: classes.averageLabel,
                }}
                placeholder="[ 0, 60,000,000 ]"
              />
              <div>
                <div className="flex items-center gap-[8px] mb-[8px]">
                  <Checkbox
                    checked={form.scalarData.offLoading}
                    onCheckedChange={handleOffLoadingChange}
                  />
                  <p className="text-[12px] leading-[18px] font-[500]">
                    {t('form.offloading')}
                  </p>
                </div>
                <p className={classes.offLoadingDesc}>
                  <Trans
                    t={t}
                    i18nKey="form.mmp"
                    components={[<a href="/docs/mmap.md" key="mmp"></a>]}
                  />
                </p>
              </div>
            </div>
          </Collapsible>
        </div>
      </div>
      <div className={clsx(classes.singlePart, 'pb-[24px]')}>
        <div className="mb-[24px]">
          <h4 className="">
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger
                  className={clsx(
                    'text-[14px] font-[600] leading-[22px] mb-[8px]',
                    classes.tooltipTrigger
                  )}
                >
                  {t('form.segmentSize')}
                </TooltipTrigger>
                <TooltipContent className="w-[280px]">
                  <Trans
                    t={t}
                    i18nKey="form.segmentTooltip"
                    components={[
                      <a
                        href="/docs/configure_datacoord.md#dataCoordsegmentmaxSize"
                        key="backup-restore"
                        className={classes.tooltipLink}
                      ></a>,
                    ]}
                  />
                  <TooltipArrow />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h4>
          <Select
            value={form.segmentSize}
            onValueChange={val => {
              handleFormChange('segmentSize', val);
            }}
          >
            <SelectTrigger className={classes.selectTrigger}>
              {selectedSegmentSize?.label}
            </SelectTrigger>
            <SelectContent>
              {SEGMENT_SIZE_OPTIONS.map(v => (
                <SelectItem key={v.value} value={v.value}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-[24px]">
          <h4 className="">
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger
                  className={clsx(
                    'text-[14px] font-[600] leading-[22px] mb-[8px]',
                    classes.tooltipTrigger
                  )}
                >
                  {t('form.mode')}
                </TooltipTrigger>
                <TooltipContent className="w-[280px]">
                  <Trans
                    t={t}
                    i18nKey="form.modeTip"
                    components={[
                      <a
                        href="/docs/multi-storage-backup-and-restore.md"
                        key="mode-tip"
                        className={classes.tooltipLink}
                      ></a>,
                    ]}
                  />
                  <TooltipArrow />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h4>
          <div className={classes.cardsWrapper}>
            <div
              role="button"
              className={clsx(classes.card, classes.modeCard, {
                [classes.activeCard]: form.mode === modeOptions[0].value,
                [classes.disabledCard]: disableStandalone,
              })}
              onClick={() => {
                if (disableStandalone) {
                  return;
                }
                setManuallySelectedMode(modeOptions[0].value);
                handleFormChange('mode', modeOptions[0].value);
              }}
            >
              <h5 className="text-[14px] font-[600] leading-[22px]">
                {modeOptions[0].label}
              </h5>
              <span className="text-[12px] font-[400] leading-[16px]">
                {modeOptions[0].desc}
              </span>

              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipContent className="w-[280px]" side="bottom">
                    {t('form.modeDisableTip')}
                    <TooltipArrow />
                  </TooltipContent>
                  <TooltipTrigger>
                    <div className={classes.mask}></div>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div
              className={clsx(classes.card, classes.modeCard, {
                [classes.activeCard]: form.mode === modeOptions[1].value,
              })}
              onClick={() => {
                setManuallySelectedMode(modeOptions[1].value);
                handleFormChange('mode', modeOptions[1].value);
              }}
            >
              <h5 className="text-[14px] font-[600] leading-[22px]">
                {modeOptions[1].label}
              </h5>
              <span className="text-[12px] font-[400] leading-[16px]">
                {modeOptions[1].desc}
              </span>
            </div>
          </div>
        </div>
        {form.mode === ModeEnum.Cluster && (
          <div>
            <h4 className="text-[14px] font-[600] leading-[22px] mb-[8px]">
              {t('form.dependencyComp')}
            </h4>
            <div className={classes.cardsWrapper}>
              {dependencyOptions.map(v => (
                <button
                  className={clsx(classes.card, classes.dependencyCard, {
                    [classes.activeCard]: form.dependency === v.value,
                  })}
                  onClick={() => {
                    handleFormChange('dependency', v.value);
                  }}
                  key={v.label}
                >
                  {v.icon}
                  <span className="text-[14px] font-[600] leading-[22px]">
                    {v.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="mt-[36px] text-[12px]  leading-[18px] text-black2">
          <Trans
            t={t}
            i18nKey="tooltip"
            components={[<span key="note" className="font-[600]"></span>]}
          />
        </p>
      </div>
    </section>
  );
}
