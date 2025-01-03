import { IIndexType, IndexTypeEnum } from '@/types/sizing';
import {
  RadioGroupItem,
  RadioGroup,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
  TooltipContent,
  TooltipArrow,
} from '@/components/ui';
import classes from './index.module.less';
import clsx from 'clsx';
import { SizingRange } from '@/components/sizing';
import {
  MAX_NODE_DEGREE_RANGE_CONFIG,
  N_LIST_RANGE_CONFIG,
  M_RANGE_CONFIG,
} from '@/consts/sizing';
import { Trans, useTranslation } from 'react-i18next';

type IndexTypeComponentProps = {
  data: IIndexType;
  onChange: (key: string, value: any) => void;
};

const SCANNComponent = (props: IndexTypeComponentProps) => {
  const { data, onChange } = props;
  const { t } = useTranslation('sizingTool');

  return (
    <div className="mt-[20px]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <p
              className={clsx(
                classes.smallerLabel,
                classes.tooltipTrigger,
                'mb-[8px]'
              )}
            >
              {t('form.indexParam')}
            </p>
          </TooltipTrigger>
          <TooltipContent className="w-[240px]">
            <Trans
              t={t}
              i18nKey="form.indexParamTip"
              components={[
                <a
                  href="/docs/index-vector-fields.md#Index-Vector-Fields"
                  className={classes.tooltipLink}
                  key="index-parameters"
                ></a>,
              ]}
            />
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <p className={clsx(classes.indexParamLabel, 'mb-[8px]')}>
        {t('form.withRawData')}
      </p>
      <RadioGroup
        value={data.widthRawData.toString()}
        onValueChange={val => {
          onChange('widthRawData', val === 'true');
        }}
        className={classes.radioGroup}
      >
        <div className={classes.flexRow}>
          <RadioGroupItem value="true"></RadioGroupItem>
          <p className={classes.radioItemLabel}>True</p>
        </div>
        <div className={classes.flexRow}>
          <RadioGroupItem value="false"></RadioGroupItem>
          <p className={classes.radioItemLabel}>False</p>
        </div>
      </RadioGroup>
    </div>
  );
};

const HNSWComponent = (props: IndexTypeComponentProps) => {
  const { t } = useTranslation('sizingTool');
  const { data, onChange } = props;
  return (
    <div className="mt-[20px]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <p
              className={clsx(
                classes.smallerLabel,
                classes.tooltipTrigger,
                'mb-[8px]'
              )}
            >
              {t('form.indexParam')}
            </p>
          </TooltipTrigger>
          <TooltipContent className="w-[240px]">
            <Trans
              t={t}
              i18nKey="form.indexParamTip"
              components={[
                <a
                  href="/docs/index-vector-fields.md#Index-Vector-Fields"
                  className={classes.tooltipLink}
                  key="index-parameters"
                ></a>,
              ]}
            />
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <p className={clsx(classes.indexParamLabel)}>{t('form.m')}</p>
      <SizingRange
        rangeConfig={M_RANGE_CONFIG}
        value={data.m}
        onRangeChange={value => {
          onChange('m', value);
        }}
        placeholder={`[${M_RANGE_CONFIG.min}, ${M_RANGE_CONFIG.max}]`}
      />
    </div>
  );
};

const DISKANNComponent = (props: IndexTypeComponentProps) => {
  const { t } = useTranslation('sizingTool');
  const { data, onChange } = props;
  return (
    <div className="mt-[20px]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <p
              className={clsx(
                classes.smallerLabel,
                classes.tooltipTrigger,
                'mb-[8px]'
              )}
            >
              {t('form.indexParam')}
            </p>
          </TooltipTrigger>
          <TooltipContent className="w-[240px]">
            <Trans
              t={t}
              i18nKey="form.indexParamTip"
              components={[
                <a
                  href="/docs/index-vector-fields.md#Index-Vector-Fields"
                  className={classes.tooltipLink}
                  key="index-parameters"
                ></a>,
              ]}
            />
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <p className={clsx(classes.indexParamLabel)}>{t('form.maxDegree')}</p>
      <SizingRange
        rangeConfig={MAX_NODE_DEGREE_RANGE_CONFIG}
        value={data.maxDegree}
        onRangeChange={value => {
          onChange('maxDegree', value);
        }}
        placeholder={`[${MAX_NODE_DEGREE_RANGE_CONFIG.min}, ${MAX_NODE_DEGREE_RANGE_CONFIG.max}]`}
      />
    </div>
  );
};

const IVFFlatComponent = (props: IndexTypeComponentProps) => {
  const { t } = useTranslation('sizingTool');
  const { data, onChange } = props;
  return (
    <div className="mt-[20px]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <p
              className={clsx(
                classes.smallerLabel,
                classes.tooltipTrigger,
                'mb-[8px]'
              )}
            >
              {t('form.indexParam')}
            </p>
          </TooltipTrigger>
          <TooltipContent className="w-[240px]">
            <Trans
              t={t}
              i18nKey="form.indexParamTip"
              components={[
                <a
                  href="/docs/index-vector-fields.md#Index-Vector-Fields"
                  className={classes.tooltipLink}
                  key="index-parameters"
                ></a>,
              ]}
            />
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <p className={clsx(classes.indexParamLabel)}>{t('form.nlist')}</p>
      <SizingRange
        rangeConfig={N_LIST_RANGE_CONFIG}
        value={data.flatNList}
        onRangeChange={value => {
          onChange('flatNList', value);
        }}
        placeholder={`[${N_LIST_RANGE_CONFIG.min}, ${N_LIST_RANGE_CONFIG.max}]`}
      />
    </div>
  );
};

const IVFSQ8Component = (props: IndexTypeComponentProps) => {
  const { t } = useTranslation('sizingTool');
  const { data, onChange } = props;
  return (
    <div className="mt-[20px]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <p
              className={clsx(
                classes.smallerLabel,
                classes.tooltipTrigger,
                'mb-[8px]'
              )}
            >
              {t('form.indexParam')}
            </p>
          </TooltipTrigger>
          <TooltipContent className="w-[240px]">
            <Trans
              t={t}
              i18nKey="form.indexParamTip"
              components={[
                <a
                  href="/docs/index-vector-fields.md#Index-Vector-Fields"
                  className={classes.tooltipLink}
                  key="index-parameters"
                ></a>,
              ]}
            />
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <p className={clsx(classes.indexParamLabel)}>{t('form.nlist')}</p>
      <SizingRange
        rangeConfig={N_LIST_RANGE_CONFIG}
        value={data.sq8NList}
        onRangeChange={value => {
          onChange('sq8NList', value);
        }}
        placeholder={`[${N_LIST_RANGE_CONFIG.min}, ${N_LIST_RANGE_CONFIG.max}]`}
      />
    </div>
  );
};

export const IndexTypeComponent = (props: {
  data: IIndexType;
  onChange: (key: string, value: any) => void;
}) => {
  const { data } = props;
  switch (data.indexType) {
    case IndexTypeEnum.FLAT:
      return null;
    case IndexTypeEnum.SCANN:
      return <SCANNComponent {...props} />;
    case IndexTypeEnum.HNSW:
      return <HNSWComponent {...props} />;
    case IndexTypeEnum.DISKANN:
      return <DISKANNComponent {...props} />;
    case IndexTypeEnum.IVF_FLAT:
      return <IVFFlatComponent {...props} />;
    case IndexTypeEnum.IVFSQ8:
      return <IVFSQ8Component {...props} />;
    default:
      return null;
  }
};
