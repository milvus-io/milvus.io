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
} from '@/consts/sizing';
import clsx from 'clsx';
import { ICalculateResult, IIndexType, ModeEnum } from '@/types/sizing';
import { IndexTypeComponent } from './indexTypeComponent';
import {
  memoryAndDiskCalculator,
  nodesConfigCalculator,
  rawDataSizeCalculator,
  $10M768D,
  dependencyCalculator,
  $1B768D,
} from '@/utils/sizingTool';
import { Trans, useTranslation } from 'react-i18next';
import { TooltipArrow } from '@radix-ui/react-tooltip';

export default function FormSection(props: {
  className: string;
  updateCalculatedResult: (params: ICalculateResult) => void;
}) {
  const { t } = useTranslation('sizingTool');
  const { className, updateCalculatedResult } = props;

  const [collapseHeight, setCollapseHeight] = useState(0);
  const collapseEle = useRef<HTMLDivElement | null>(null);

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

  const [disableStandalone, setDisableStandalone] = useState(false);

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

  useEffect(() => {
    const targetEle = collapseEle?.current;
    const height = targetEle.offsetHeight;
    setCollapseHeight(height);
  }, []);

  const selectedSegmentSize = useMemo(() => {
    return SEGMENT_SIZE_OPTIONS.find(v => v.value === form.segmentSize);
  }, [form.segmentSize]);

  const dependencyOptions = [
    {
      ...DEPENDENCY_COMPONENTS[0],
      icon: '/images/sizing-tool/pulsar.svg',
    },
    {
      ...DEPENDENCY_COMPONENTS[1],
      icon: '/images/sizing-tool/kafka.svg',
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
    let currentMode = form.mode;
    const rawDataSize = rawDataSizeCalculator({
      num: form.vector,
      d: form.dimension,
      withScalar: form.widthScalar,
      scalarAvg: form.scalarData.averageNum,
    });

    if (rawDataSize > $10M768D) {
      currentMode = ModeEnum.Cluster;

      setDisableStandalone(true);
    } else if (rawDataSize < $10M768D) {
      setDisableStandalone(false);
    }

    const { memory, disk: localDisk } = memoryAndDiskCalculator({
      rawDataSize,
      indexTypeParams,
      d: form.dimension,
      num: form.vector,
      withScalar: form.widthScalar,
      offLoading: form.scalarData.offLoading,
      scalarAvg: form.scalarData.averageNum,
      segSize: Number(form.segmentSize),
    });

    const nodeConfig = nodesConfigCalculator({
      memory: memory,
    });

    const dependencyConfig = dependencyCalculator({
      num: form.vector,
      d: form.dimension,
      withScalar: form.widthScalar,
      scalarAvg: form.scalarData.averageNum,
      mode: currentMode,
    });

    updateCalculatedResult({
      rawDataSize,
      memorySize: memory,
      localDiskSize: localDisk,
      nodeConfig: nodeConfig,
      dependencyConfig: dependencyConfig,
      mode: currentMode,
      dependency: form.dependency,
      isOutOfCalculate: rawDataSize > $1B768D,
    });
  }, [form, indexTypeParams]);

  useEffect(() => {
    if (disableStandalone && form.mode === ModeEnum.Standalone) {
      setForm({
        ...form,
        mode: ModeEnum.Cluster,
      });
    }
  }, [disableStandalone, form.mode]);

  return (
    <section className={clsx(className, classes.formSection)}>
      <div className={clsx(classes.singlePart, classes.paddingBtm20)}>
        <div className={classes.marginBtm20}>
          <SizingRange
            rangeConfig={VECTOR_RANGE_CONFIG}
            label={t('form.num')}
            onRangeChange={val => {
              handleFormChange('vector', val);
            }}
            value={form.vector}
            unit="Million"
            placeholder={`[${VECTOR_RANGE_CONFIG.min}, ${VECTOR_RANGE_CONFIG.max}]`}
          />
        </div>
        <div className={classes.marginBtm20}>
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
        <div className={clsx(classes.marginBtm0)}>
          <div className={clsx(classes.flexRow)}>
            <p className={classes.switchLabel}>{t('form.withScalar')}</p>
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
                placeholder="[0, 60,000,000]"
              />
              <div>
                <div className={classes.offLoadingLabel}>
                  <Checkbox
                    checked={form.scalarData.offLoading}
                    onCheckedChange={handleOffLoadingChange}
                  />
                  <p className={classes.smallerLabel}>{t('form.offloading')}</p>
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
        <div className="">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <h4
                  className={clsx(classes.commonLabel, classes.tooltipTrigger)}
                >
                  {t('form.indexType')}
                </h4>
              </TooltipTrigger>
              <TooltipContent>
                <Trans
                  t={t}
                  i18nKey="form.indexTypeTip"
                  components={[
                    <a
                      href="/docs/index.md?tab=floating"
                      key="index-type"
                      className={classes.tooltipLink}
                    ></a>,
                  ]}
                />
                <TooltipArrow></TooltipArrow>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

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
                <SelectItem key={v.value} value={v.value}>
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
      </div>
      <div className={clsx(classes.singlePart, 'pb-[24px]')}>
        <div className={classes.marginBtm20}>
          <h4 className={classes.commonLabel}>{t('form.segmentSize')}</h4>
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

        <div className={clsx(classes.singleRow, classes.marginBtm20)}>
          <h4 className="">
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger
                  className={clsx(classes.commonLabel, classes.tooltipTrigger)}
                >
                  {t('form.mode')}
                </TooltipTrigger>
                <TooltipContent className="w-[280px]">
                  <Trans
                    t={t}
                    i18nKey="form.modeTip"
                    components={[
                      <a
                        href="#"
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
                handleFormChange('mode', modeOptions[0].value);
              }}
            >
              <h5 className={classes.modeName}>{modeOptions[0].label}</h5>
              <span className={classes.modeDesc}>{modeOptions[0].desc}</span>

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
                handleFormChange('mode', modeOptions[1].value);
              }}
            >
              <h5 className={classes.modeName}>{modeOptions[1].label}</h5>
              <span className={classes.modeDesc}>{modeOptions[1].desc}</span>
            </div>
          </div>
        </div>
        {form.mode === ModeEnum.Cluster && (
          <div>
            <h4 className={classes.commonLabel}>{t('form.dependencyComp')}</h4>
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
                  <img src={v.icon} alt={v.label} />
                  <span className={classes.depName}>{v.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
