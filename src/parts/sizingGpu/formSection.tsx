import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Trans, useTranslation } from 'react-i18next';
import { TooltipArrow } from '@radix-ui/react-tooltip';
import { SizingInput, SizingRange, SizingSwitch } from '@/components/sizing';
import {
  Collapsible,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui';
import { ExternalLinkIcon } from '@/components/icons';
import commonClasses from '@/parts/sizingCommon/index.module.css';
import classes from './index.module.css';
import {
  DEFAULT_GPU_FORM,
  IGpuFormState,
  IGpuPayload,
  buildGpuPayload,
} from './config';
import {
  DIMENSION_RANGE_CONFIG,
  GPU_INDEX_DOC_LINK,
  GPU_INDEX_TYPE_OPTIONS,
  GRAPH_DEGREE_RANGE_CONFIG,
  INTERMEDIATE_GRAPH_DEGREE_RANGE_CONFIG,
  MODE_OPTIONS,
  N_LIST_RANGE_CONFIG,
  PQ_BITS_OPTIONS,
  PQ_DIM_RANGE_CONFIG,
  SEGMENT_SIZE_OPTIONS,
  TRAIN_FRACTION_RANGE_CONFIG,
  VECTOR_RANGE_CONFIG,
} from '@/consts/sizingGpu';
import { GpuIndexTypeEnum, ModeEnum, SegmentSizeEnum } from '@/types/sizingGpu';
import { calculatePqDim } from '@/utils/sizingToolGpu';

/** Same ceiling the CPU tool puts on its scalar field. */
const MAXIMUM_AVERAGE_LENGTH = 60000000;

interface GpuFormSectionProps {
  className?: string;
  onCalculatedResult: (payload: IGpuPayload) => void;
}

/**
 * Free-text numeric field, following the CPU tool's convention: the raw string
 * lives in local state so intermediate input is not destroyed, the maximum is
 * enforced while typing and the minimum on blur.
 */
const useNumericField = (
  value: number,
  range: { min: number; max: number },
  onCommit: (value: number) => void
) => {
  const [text, setText] = useState<string>(`${value}`);

  useEffect(() => {
    // An empty draft is left alone: clearing a field commits the minimum, and
    // refilling the box from that would fight the user mid-edit.
    setText(current =>
      current === '' || Number(current) === value ? current : `${value}`
    );
  }, [value]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    if (raw === '') {
      setText('');
      onCommit(range.min);
      return;
    }

    const parsed = Number(raw);
    if (Number.isNaN(parsed)) {
      return;
    }
    if (parsed > range.max) {
      setText(`${range.max}`);
      onCommit(range.max);
      return;
    }

    setText(raw);
    onCommit(parsed);
  };

  const onBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) < range.min) {
      setText(`${range.min}`);
      onCommit(range.min);
    }
  };

  return { value: text, onChange, onBlur };
};

export default function GpuFormSection(props: GpuFormSectionProps) {
  const { className, onCalculatedResult } = props;
  const { t } = useTranslation('sizingTool');

  const [form, setForm] = useState<IGpuFormState>(DEFAULT_GPU_FORM);

  const updateForm = <K extends keyof IGpuFormState>(
    key: K,
    value: IGpuFormState[K]
  ) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    onCalculatedResult(buildGpuPayload(form));
  }, [form, onCalculatedResult]);

  const trainFractionField = useNumericField(
    form.trainFraction,
    TRAIN_FRACTION_RANGE_CONFIG,
    value => updateForm('trainFraction', value)
  );
  const pqDimField = useNumericField(form.pqDim, PQ_DIM_RANGE_CONFIG, value =>
    updateForm('pqDim', value)
  );
  const scalarField = useNumericField(
    form.scalarAvg,
    { min: 0, max: MAXIMUM_AVERAGE_LENGTH },
    value => updateForm('scalarAvg', value)
  );

  const isIvf =
    form.indexType === GpuIndexTypeEnum.GPU_IVF_FLAT ||
    form.indexType === GpuIndexTypeEnum.GPU_IVF_PQ;
  const isPq = form.indexType === GpuIndexTypeEnum.GPU_IVF_PQ;
  const isCagra = form.indexType === GpuIndexTypeEnum.GPU_CAGRA;

  const selectedSegmentSize = SEGMENT_SIZE_OPTIONS.find(
    option => option.value === form.segmentSize
  );

  return (
    <section className={clsx(className, commonClasses.formSection)}>
      <div className={commonClasses.singlePart}>
        <div className="mb-[24px]">
          <SizingRange
            rangeConfig={VECTOR_RANGE_CONFIG}
            label={t('form.num')}
            value={form.num}
            onRangeChange={value => updateForm('num', value)}
            unit={t('gpu.form.million')}
          />
        </div>
        <div className="mb-[24px]">
          <SizingRange
            rangeConfig={DIMENSION_RANGE_CONFIG}
            label={t('form.dim')}
            value={form.dimension}
            onRangeChange={value => updateForm('dimension', value)}
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
              href={GPU_INDEX_DOC_LINK}
              target="_blank"
            >
              {t('gpu.form.indexDoc')}
              <ExternalLinkIcon />
            </a>
          </h4>

          <Select
            value={form.indexType}
            onValueChange={value =>
              updateForm('indexType', value as GpuIndexTypeEnum)
            }
          >
            <SelectTrigger className={commonClasses.selectTrigger}>
              {form.indexType}
            </SelectTrigger>
            <SelectContent>
              {GPU_INDEX_TYPE_OPTIONS.map(option => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={commonClasses.selectItem}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isIvf && (
            <>
              <div className="mt-[16px]">
                <SizingRange
                  rangeConfig={N_LIST_RANGE_CONFIG}
                  label={t('form.nlist')}
                  value={form.nlist}
                  onRangeChange={value => updateForm('nlist', value)}
                  placeholder={`[${N_LIST_RANGE_CONFIG.min}, ${N_LIST_RANGE_CONFIG.max}]`}
                />
              </div>
              <div className="mt-[16px]">
                <p className="text-[12px] font-[500] leading-[18px] mb-[8px]">
                  {t('gpu.form.trainFraction')}
                </p>
                <SizingInput
                  {...trainFractionField}
                  placeholder={`[${TRAIN_FRACTION_RANGE_CONFIG.min}, ${TRAIN_FRACTION_RANGE_CONFIG.max}]`}
                />
              </div>
            </>
          )}

          {isPq && (
            <>
              <div className="mt-[16px]">
                <p className="text-[12px] font-[500] leading-[18px] mb-[8px]">
                  {t('gpu.form.pqDim')}
                </p>
                <SizingInput
                  {...pqDimField}
                  placeholder={`[${PQ_DIM_RANGE_CONFIG.min}, ${PQ_DIM_RANGE_CONFIG.max}]`}
                />
                <p className={clsx('mt-[6px]', commonClasses.indexParamLabel)}>
                  {t('gpu.form.pqDimTip', {
                    value: calculatePqDim(form.dimension),
                  })}
                </p>
              </div>
              <div className="mt-[16px]">
                <p className="text-[12px] font-[500] leading-[18px] mb-[8px]">
                  {t('gpu.form.pqBits')}
                </p>
                <Select
                  value={`${form.pqBits}`}
                  onValueChange={value => updateForm('pqBits', Number(value))}
                >
                  <SelectTrigger className={commonClasses.selectTrigger}>
                    {form.pqBits}
                  </SelectTrigger>
                  <SelectContent>
                    {PQ_BITS_OPTIONS.map(option => (
                      <SelectItem
                        key={option.value}
                        value={`${option.value}`}
                        className={commonClasses.selectItem}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {isCagra && (
            <>
              <div className="mt-[16px]">
                <SizingRange
                  rangeConfig={GRAPH_DEGREE_RANGE_CONFIG}
                  label={t('gpu.form.graphDegree')}
                  value={form.graphDegree}
                  onRangeChange={value => updateForm('graphDegree', value)}
                  placeholder={`[${GRAPH_DEGREE_RANGE_CONFIG.min}, ${GRAPH_DEGREE_RANGE_CONFIG.max}]`}
                />
              </div>
              <div className="mt-[16px]">
                <SizingRange
                  rangeConfig={INTERMEDIATE_GRAPH_DEGREE_RANGE_CONFIG}
                  label={t('gpu.form.intermediateDegree')}
                  value={form.intermediateDegree}
                  onRangeChange={value =>
                    updateForm('intermediateDegree', value)
                  }
                  placeholder={`[${INTERMEDIATE_GRAPH_DEGREE_RANGE_CONFIG.min}, ${INTERMEDIATE_GRAPH_DEGREE_RANGE_CONFIG.max}]`}
                />
              </div>
            </>
          )}
        </div>

        <div>
          <div className="flex items-center gap-[8px]">
            <p className="text-[14px] leading-[22px] font-[600]">
              {t('form.withScalar')}
            </p>
            <SizingSwitch
              checked={form.withScalar}
              onCheckedChange={value => updateForm('withScalar', value)}
            />
          </div>
          <Collapsible
            open={form.withScalar}
            className={clsx(commonClasses.collapsible, {
              [commonClasses.visibleCollapse]: form.withScalar,
              [commonClasses.invisibleCollapse]: !form.withScalar,
            })}
          >
            <SizingInput
              label={t('form.averageLength')}
              unit={t('setup.basic.byte')}
              fullWidth
              placeholder={`[ 0, 60,000,000 ]`}
              classes={{ label: commonClasses.averageLabel }}
              {...scalarField}
            />
            <p className={clsx('mt-[8px]', commonClasses.offLoadingDesc)}>
              {t('gpu.form.averageLengthTip')}
            </p>
          </Collapsible>
        </div>
      </div>

      <div className={clsx(commonClasses.singlePart, 'pb-[24px]')}>
        <div className="mb-[24px]">
          <h4>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger
                  className={clsx(
                    'text-[14px] font-[600] leading-[22px] mb-[8px]',
                    commonClasses.tooltipTrigger
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
                        key="segment-size"
                        className={commonClasses.tooltipLink}
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
            onValueChange={value =>
              updateForm('segmentSize', value as SegmentSizeEnum)
            }
          >
            <SelectTrigger className={commonClasses.selectTrigger}>
              {selectedSegmentSize?.label}
            </SelectTrigger>
            <SelectContent>
              {SEGMENT_SIZE_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-[24px]">
          <h4 className="text-[14px] font-[600] leading-[22px] mb-[8px]">
            {t('form.mode')}
          </h4>
          <div className={commonClasses.cardsWrapper}>
            {MODE_OPTIONS.map(option => (
              <div
                key={option.value}
                role="button"
                className={clsx(commonClasses.card, commonClasses.modeCard, {
                  [commonClasses.activeCard]: form.mode === option.value,
                })}
                onClick={() => updateForm('mode', option.value as ModeEnum)}
              >
                <h5 className="text-[14px] font-[600] leading-[22px]">
                  {option.value === ModeEnum.Standalone
                    ? t('form.standalone')
                    : t('form.cluster')}
                </h5>
                <span className="text-[12px] font-[400] leading-[16px]">
                  {option.value === ModeEnum.Standalone
                    ? t('form.standaloneDesc')
                    : t('form.clusterDesc')}
                </span>
              </div>
            ))}
          </div>
          <p className={clsx('mt-[8px]', classes.modeHint)}>
            {t('gpu.form.modeManualTip')}
          </p>
        </div>

        <p className="mt-[36px] text-[12px] leading-[18px] text-black2">
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
