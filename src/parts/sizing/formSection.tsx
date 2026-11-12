import { FormSection as BaseFormSection } from '@/parts/sizingCommon';
import { sizingV26Config } from './config';
import { SizingVersionConfig } from '@/parts/sizingCommon/types';
import { ICalculateResult } from '@/types/sizing';

export default function FormSection(props: {
  config?: SizingVersionConfig;
  className: string;
  asyncCalculatedResult: (params: ICalculateResult) => void;
  disableCalculationThreshold?: boolean;
}) {
  const { className, asyncCalculatedResult, disableCalculationThreshold } = props;

  return (
    <BaseFormSection
      className={className}
      config={props.config ?? sizingV26Config}
      onCalculatedResult={asyncCalculatedResult}
      disableCalculationThreshold={disableCalculationThreshold}
    />
  );
}
