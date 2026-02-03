import { FormSection as BaseFormSection } from '@/parts/sizingCommon';
import { sizingV250Config } from './config';
import { ICalculateResult } from '@/types/sizingV250';

export default function FormSection(props: {
  className: string;
  updateCalculatedResult: (params: ICalculateResult) => void;
}) {
  const { className, updateCalculatedResult } = props;

  return (
    <BaseFormSection
      className={className}
      config={sizingV250Config}
      onCalculatedResult={updateCalculatedResult}
    />
  );
}
