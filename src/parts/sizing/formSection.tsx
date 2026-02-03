import { FormSection as BaseFormSection } from '@/parts/sizingCommon';
import { sizingV3Config } from './config';
import { ICalculateResult } from '@/types/sizing';

export default function FormSection(props: {
  className: string;
  asyncCalculatedResult: (params: ICalculateResult) => void;
}) {
  const { className, asyncCalculatedResult } = props;

  return (
    <BaseFormSection
      className={className}
      config={sizingV3Config}
      onCalculatedResult={asyncCalculatedResult}
    />
  );
}
