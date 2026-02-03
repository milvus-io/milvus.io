import { ResultSection as BaseResultSection } from '@/parts/sizingCommon';
import { sizingV3Config } from './config';
import { ICalculateResult } from '@/types/sizing';

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
      config={sizingV3Config}
    />
  );
}
