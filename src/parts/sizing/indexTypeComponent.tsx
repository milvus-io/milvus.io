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
import { SizingInput, SizingRange } from '@/components/sizing';
import {
  MAX_NODE_DEGREE_RANGE_CONFIG,
  N_LIST_RANGE_CONFIG,
  M_RANGE_CONFIG,
} from '@/consts/sizing';
import { Trans, useTranslation } from 'react-i18next';
import { useState } from 'react';

type IndexTypeComponentProps = {
  data: IIndexType;
  onChange: (key: string, value: any) => void;
};

const SCANNComponent = (props: IndexTypeComponentProps) => {
  const { data, onChange } = props;
  const { t } = useTranslation('sizingTool');

  return (
    <div className="mt-[16px]">
      <p className={'mb-[8px] text-[12px] font-[500] leading-[16px]'}>
        {t('form.withRawData')}
      </p>
      <RadioGroup
        value={data.widthRawData.toString()}
        onValueChange={val => {
          onChange('widthRawData', val === 'true');
        }}
        className={classes.radioGroup}
      >
        <div className="flex items-center gap-[8px]">
          <RadioGroupItem value="true"></RadioGroupItem>
          <p className={classes.radioItemLabel}>True</p>
        </div>
        <div className="flex items-center gap-[8px]">
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
  const [inputString, setInputString] = useState<string>(data.m.toString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const num = Number(value);
    if (value === '') {
      onChange('m', 0);
      setInputString('');
      return;
    }
    if (isNaN(num)) {
      return;
    }
    if (num > M_RANGE_CONFIG.max) {
      onChange('m', M_RANGE_CONFIG.max);
      setInputString(`${M_RANGE_CONFIG.max}`);
      return;
    }
    setInputString(value);
    onChange('m', num);
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const num = Number(value);
    if (num < M_RANGE_CONFIG.min) {
      onChange('m', M_RANGE_CONFIG.min);
      setInputString(`${M_RANGE_CONFIG.min}`);
    }
  };

  return (
    <div className="mt-[16px]">
      <p className={'text-[12px] font-[500] leading-[18px] mb-[8px]'}>
        {t('form.m')}
      </p>

      <SizingInput
        value={inputString}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={`[${M_RANGE_CONFIG.min}, ${M_RANGE_CONFIG.max}]`}
      />
    </div>
  );
};

const DISKANNComponent = (props: IndexTypeComponentProps) => {
  const { t } = useTranslation('sizingTool');
  const { data, onChange } = props;
  return (
    <div className="mt-[16px]">
      <p className={'text-[12px] font-[500] leading-[16px]'}>
        {t('form.maxDegree')}
      </p>
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
    <div className="mt-[16px]">
      <p className={'text-[12px] font-[500] leading-[16px]'}>
        {t('form.nlist')}
      </p>
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
    <div className="mt-[16px]">
      <p className={'text-[12px] font-[500] leading-[16px]'}>
        {t('form.nlist')}
      </p>
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

const RABITQComponent = (props: IndexTypeComponentProps) => {
  const { t } = useTranslation('sizingTool');
  const { data, onChange } = props;
  return (
    <div className="mt-[16px]">
      <p className={'text-[12px] font-[500] leading-[16px]'}>
        {t('form.nlist')}
      </p>
      <SizingRange
        rangeConfig={N_LIST_RANGE_CONFIG}
        value={data.rabitqNList}
        onRangeChange={value => {
          onChange('rabitqNList', value);
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
    case IndexTypeEnum.IVFRABITQ:
      return <RABITQComponent {...props} />;
    default:
      return null;
  }
};
