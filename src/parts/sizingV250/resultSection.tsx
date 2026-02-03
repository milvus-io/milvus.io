import { ResultSection as BaseResultSection } from '@/parts/sizingCommon';
import { sizingV250Config } from './config';
import { ICalculateResult } from '@/types/sizingV250';

export default function ResultSection(props: {
  className?: string;
  calculatedResult: ICalculateResult;
  latestMilvusTag: string;
}) {
  const { className, calculatedResult, latestMilvusTag } = props;

  return (
    <BaseResultSection
      className={className}
      calculatedResult={calculatedResult}
      latestMilvusTag={latestMilvusTag}
      config={sizingV250Config}
    />
  );
}
