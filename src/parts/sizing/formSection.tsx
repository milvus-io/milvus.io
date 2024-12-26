import { useEffect, useMemo, useRef, useState } from 'react';
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
} from '@/utils/sizingToolV2';

export default function FormSection(props: {
  className: string;
  updateCalculatedResult: (params: ICalculateResult) => void;
}) {
  const { className, updateCalculatedResult } = props;

  const [collapseHeight, setCollapseHeight] = useState(0);
  const collapseEle = useRef<HTMLDivElement | null>(null);

  const [form, setForm] = useState({
    vector: VECTOR_RANGE_CONFIG.defaultValue,
    dimension: DIMENSION_RANGE_CONFIG.defaultValue,
    widthScalar: false,
    scalarData: {
      average: 0,
      offLoading: false,
    },
    segmentSize: SEGMENT_SIZE_OPTIONS[0].value,
    dependency: DEPENDENCY_COMPONENTS[0].value,
    mode: MODE_OPTIONS[0].value,
  });

  const [indexTypeParams, setIndexTypeParams] = useState<IIndexType>({
    indexType: INDEX_TYPE_OPTIONS[0].value,
    widthRawData: false,
    maxDegree: 0,
    nlist: 0,
    m: 0,
  });

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
    const length = Number(e.target.value) || 0;
    setForm({
      ...form,
      scalarData: {
        ...form.scalarData,
        average: length,
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
      desc: 'Suitable for small datasize and poc env.',
    },
    {
      ...MODE_OPTIONS[1],
      desc: 'Suitable for large datasize and production env.',
    },
  ];

  useEffect(() => {
    let currentMode = form.mode;
    const rawDataSize = rawDataSizeCalculator({
      num: form.vector,
      d: form.dimension,
      withScalar: form.widthScalar,
      scalarAvg: form.scalarData.average,
    });

    if (rawDataSize >= $10M768D) {
      currentMode = ModeEnum.Cluster;
      setForm({
        ...form,
        mode: currentMode,
      });
    }
    const { memory, disk: localDisk } = memoryAndDiskCalculator({
      rawDataSize,
      indexTypeParams,
      d: form.dimension,
      num: form.vector,
      withScalar: form.widthScalar,
      offLoading: form.scalarData.offLoading,
      scalarAvg: form.scalarData.average,
      segSize: Number(form.segmentSize),
    });

    const nodeConfig = nodesConfigCalculator({
      memory: memory,
    });

    const dependencyConfig = dependencyCalculator({
      num: form.vector,
      d: form.dimension,
      withScalar: form.widthScalar,
      scalarAvg: form.scalarData.average,
      mode: form.mode,
    });

    updateCalculatedResult({
      rawDataSize,
      memorySize: memory,
      localDiskSize: localDisk,
      nodeConfig: nodeConfig,
      dependencyConfig: dependencyConfig,
      mode: currentMode,
      dependency: form.dependency,
    });
  }, [form]);

  return (
    <section className={clsx(className, classes.formSection)}>
      <div className={clsx(classes.singlePart, classes.paddingBtm20)}>
        <div className={classes.marginBtm20}>
          <SizingRange
            rangeConfig={VECTOR_RANGE_CONFIG}
            label="Number of Vector"
            onRangeChange={val => {
              handleFormChange('vector', val);
            }}
            value={form.vector}
            unit="Million"
          />
        </div>
        <div className={classes.marginBtm20}>
          <SizingRange
            rangeConfig={DIMENSION_RANGE_CONFIG}
            label="Vector Dimension"
            onRangeChange={val => {
              handleFormChange('dimension', val);
            }}
            value={form.dimension}
          />
        </div>
        <div className={clsx(classes.marginBtm0)}>
          <div className={clsx(classes.flexRow)}>
            <p className={classes.switchLabel}>With Scalar Fields</p>
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
                label={
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipContent className="w-[280px]">
                        some test tooltip sad dsdsadasd dadsadsa dssad d dasd
                      </TooltipContent>
                      <TooltipTrigger
                        className={clsx(
                          classes.smallerLabel,
                          classes.tooltipTrigger
                        )}
                      >
                        Average Data Size Per Row
                      </TooltipTrigger>
                    </Tooltip>
                  </TooltipProvider>
                }
                unit="Bytes"
                value={form.scalarData.average}
                onChange={handleAverageLengthChange}
                fullWidth
                classes={{
                  root: classes.marginBtm20,
                }}
              />
              <div>
                <div className={classes.offLoadingLabel}>
                  <Checkbox
                    checked={form.scalarData.offLoading}
                    onCheckedChange={handleOffLoadingChange}
                  />
                  <p className={classes.smallerLabel}>
                    Offloading Fields to Disk
                  </p>
                </div>
                <p className={classes.offLoadingDesc}>
                  Milvus uses Mmap to enable direct memory access to large files
                  on disk without reading the entire files into memory.
                </p>
              </div>
            </div>
          </Collapsible>
        </div>
      </div>
      <div className={clsx(classes.singlePart, 'pb-[24px]')}>
        <div className="">
          <h4 className={classes.commonLabel}>Index Type</h4>
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
          <h4 className={classes.commonLabel}>Segment Size</h4>
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
        <div className={classes.marginBtm20}>
          <h4 className={classes.commonLabel}>Dependency Component</h4>
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
        <div className={classes.singleRow}>
          <h4 className="">
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger
                  className={clsx(classes.commonLabel, classes.tooltipTrigger)}
                >
                  Mode
                </TooltipTrigger>
                <TooltipContent className="w-[280px]">
                  With data growth, you can migrate data from standalone mode to
                  cluster mode. <a href="/">View More</a>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h4>
          <div className={classes.cardsWrapper}>
            {modeOptions.map(v => (
              <button
                className={clsx(classes.card, classes.modeCard, {
                  [classes.activeCard]: form.mode === v.value,
                })}
                onClick={() => {
                  handleFormChange('mode', v.value);
                }}
                key={v.label}
              >
                <h5 className={classes.modeName}>{v.label}</h5>
                <span className={classes.modeDesc}>{v.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
