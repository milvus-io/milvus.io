import { useEffect, useRef, useState } from 'react';
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
  NODE_DEGREE_RANGE_CONFIG,
  SEGMENT_SIZE_OPTIONS,
  INDEX_TYPE_OPTIONS,
} from '@/consts/sizing';
import clsx from 'clsx';
import { IIndexType } from '@/types/sizing';
import { IndexTypeComponent } from './indexTypeComponent';

export default function FormSection(props: { className: string }) {
  const { className } = props;
  const [value, setValues] = useState('21');
  const [checked, setChecked] = useState(false);
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
  });

  const [indexTypeParams, setIndexTypeParams] = useState<IIndexType>({
    indexType: INDEX_TYPE_OPTIONS[0].value,
    widthRawData: false,
    nodeDegree: 0,
    nlist: 0,
    maxDegree: 0,
  });

  const handleInputChange = e => {
    setValues(e.target.value);
  };

  const handleRangeChange = (value: number) => {
    setForm({
      ...form,
      vector: value,
    });
  };

  const handleCheckChange = (val: boolean) => {
    setChecked(val);
  };

  const handleFormChange = (key: string, value: any) => {
    console.log('value--', value, key);
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
    console.log('height', height);
    setCollapseHeight(height);
  }, []);

  return (
    <section className={clsx(className, classes.formSection)}>
      <div className={classes.singlePart}>
        <div className={classes.singleRow}>
          {/* <SizingInput
            unit="Million"
            customSize="small"
            placeholder='Enter "21"'
          />
          <SizingInput
            unit="Million"
            customSize="medium"
            fullWidth
            onChange={handleInputChange}
            value={value}
          /> */}
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
        <div className={classes.singleRow}>
          <SizingRange
            rangeConfig={DIMENSION_RANGE_CONFIG}
            label="Number of Vector"
            onRangeChange={val => {
              handleFormChange('dimension', val);
            }}
            value={form.dimension}
          />
        </div>
        <div className={clsx(classes.singleRow, classes.marginBtm0)}>
          <div className={clsx(classes.flexRow, classes.marginBtm20)}>
            <p className={classes.commonLabel}>With Scalar Filed</p>
            <SizingSwitch
              checked={checked}
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
            style={{
              height: form.widthScalar ? `${collapseHeight}px` : '0px',
            }}
          >
            <div className="" ref={collapseEle}>
              <SizingInput
                label={
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipContent>
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
      <div className={classes.singlePart}>
        <div className={classes.singleRow}>
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
        <div className={classes.singleRow}></div>
      </div>
      <div className={classes.singleRow}></div>
      <div className={classes.singleRow}></div>
      <div className={classes.singleRow}></div>
    </section>
  );
}
