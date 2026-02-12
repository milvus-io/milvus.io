import {
  RadioGroupItem,
  RadioGroup,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui';
import classes from './index.module.less';
import clsx from 'clsx';
import { SizingInput, SizingRange, SizingSwitch, } from '@/components/sizing';
import { useTranslation } from 'react-i18next';
import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { SizingVersionConfig } from './types';

interface IIndexTypeBase {
  indexType: string;
  widthRawData: boolean;
  maxDegree: number;
  flatNList: number;
  sq8NList: number;
  m: number;
  rabitqNList?: number;
  inlinePq?: number;
}

type IndexTypeComponentProps = {
  data: IIndexTypeBase;
  onChange: (key: string, value: any) => void;
  config: SizingVersionConfig;
  refine?: string;
  onRefineChange?: (value: any) => void;
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
  const { data, onChange, config } = props;
  const { M_RANGE_CONFIG } = config.consts;
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
  const { data, onChange, config } = props;
  const { MAX_NODE_DEGREE_RANGE_CONFIG } = config.consts;

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
  const { data, onChange, config } = props;
  const { N_LIST_RANGE_CONFIG } = config.consts;

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
  const { data, onChange, config } = props;
  const { N_LIST_RANGE_CONFIG } = config.consts;

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
  const { data, onChange, config, refine = '', onRefineChange = () => { } } = props;
  const { N_LIST_RANGE_CONFIG, REFINE_OPTIONS } = config.consts;
  const { RefineValueEnum } = config.types;

  const [displayRefine, setDisplayRefine] = useState(false);

  const refineTypeOptions = useMemo(() => {
    if (!REFINE_OPTIONS) return [];
    if (displayRefine) {
      return REFINE_OPTIONS.filter((v: any) => v.value !== RefineValueEnum?.None);
    }
    return REFINE_OPTIONS;
  }, [displayRefine, REFINE_OPTIONS, RefineValueEnum]);

  const handleRefineDisplayChange = (display: boolean) => {
    if (!display) {
      onRefineChange(RefineValueEnum?.None);
    } else {
      onRefineChange(RefineValueEnum?.SQ6);
    }
    setDisplayRefine(display);
  };

  return (
    <div className="mt-[16px]">
      <div className="flex items-center gap-[8px] mb-[16px]">
        <p className="text-[12px] font-[500] leading-[16px]">
          {t('form.refine')}
        </p>
        <SizingSwitch
          checked={displayRefine}
          onCheckedChange={handleRefineDisplayChange}
        />
      </div>
      {displayRefine && REFINE_OPTIONS && (
        <div className="">
          <p className="text-[12px] font-[500] leading-[16px] mb-[8px]">
            {t('form.refineType')}
          </p>
          <Select
            value={refine}
            onValueChange={val => {
              onRefineChange(val);
            }}
          >
            <SelectTrigger className={clsx(classes.selectTrigger, 'mb-[16px]')}>
              {refine}
            </SelectTrigger>
            <SelectContent>
              {refineTypeOptions.map((v: any) => (
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
        </div>
      )}
      <div className="">
        <p className={'text-[12px] font-[500] leading-[16px]'}>
          {t('form.nlist')}
        </p>
        <SizingRange
          rangeConfig={N_LIST_RANGE_CONFIG}
          value={data.rabitqNList || N_LIST_RANGE_CONFIG.defaultValue}
          onRangeChange={value => {
            onChange('rabitqNList', value);
          }}
          placeholder={`[${N_LIST_RANGE_CONFIG.min}, ${N_LIST_RANGE_CONFIG.max}]`}
        />
      </div>
    </div>
  );
};

const AISAQComponent = (props: IndexTypeComponentProps) => {
  const { t } = useTranslation('sizingTool');
  const { data, onChange, config } = props;
  const { MAX_NODE_DEGREE_RANGE_CONFIG } = config.consts;

  const [inlinePqInput, setInlinePqInput] = useState<string>(
    String(data.inlinePq ?? MAX_NODE_DEGREE_RANGE_CONFIG.defaultValue)
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clampInlinePq = useCallback(
    (value: number) => {
      const min = MAX_NODE_DEGREE_RANGE_CONFIG.min;
      const max = data.maxDegree;
      return Math.min(Math.max(value, min), max);
    },
    [MAX_NODE_DEGREE_RANGE_CONFIG.min, data.maxDegree]
  );

  const commitInlinePq = useCallback(
    (raw: string) => {
      const num = Number(raw);
      if (isNaN(num) || raw === '') return;
      const clamped = clampInlinePq(num);
      setInlinePqInput(String(clamped));
      onChange('inlinePq', clamped);
    },
    [clampInlinePq, onChange]
  );

  const handleMaxDegreeChange = (value: number) => {
    onChange('maxDegree', value);
    if ((data.inlinePq ?? 0) > value) {
      onChange('inlinePq', value);
      setInlinePqInput(String(value));
    }
  };

  const handleInlinePqInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw !== '' && isNaN(Number(raw))) return;
    setInlinePqInput(raw);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      commitInlinePq(raw);
    }, 500);
  };

  const handleInlinePqBlur = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    commitInlinePq(inlinePqInput);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="">
      <div className="mt-[16px]">
        <p className={'text-[12px] font-[500] leading-[16px]'}>
          {t('form.maxDegree')}
        </p>
        <SizingRange
          rangeConfig={MAX_NODE_DEGREE_RANGE_CONFIG}
          value={data.maxDegree}
          onRangeChange={handleMaxDegreeChange}
          placeholder={`[${MAX_NODE_DEGREE_RANGE_CONFIG.min}, ${MAX_NODE_DEGREE_RANGE_CONFIG.max}]`}
        />
      </div>
      <div className="mt-[16px] flex items-center gap-[8px] justify-between">
        <p className={'text-[12px] font-[500] leading-[16px]'}>
          {t('form.inlinePq')}
        </p>
        <SizingInput
          customSize="small"
          value={inlinePqInput}
          placeholder={`[${MAX_NODE_DEGREE_RANGE_CONFIG.min}, ${data.maxDegree}]`}
          onChange={handleInlinePqInput}
          onBlur={handleInlinePqBlur}
        />
      </div>
    </div>
  );
};

export const IndexTypeComponent = (props: IndexTypeComponentProps) => {
  const { data, config } = props;
  const { IndexTypeEnum } = config.types;

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
      if (config.supportsRabitq) {
        return <RABITQComponent {...props} />;
      }
      return null;
    case IndexTypeEnum.AISAQ:
      return <AISAQComponent {...props} />;
    default:
      return null;
  }
};
