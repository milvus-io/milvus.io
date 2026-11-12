import { ResultSection as BaseResultSection } from '@/parts/sizingCommon';
import { sizingV26Config } from './config';
import { SizingVersionConfig } from '@/parts/sizingCommon/types';
import { ICalculateResult } from '@/types/sizing';

export default function ResultSection(props: {
  config?: SizingVersionConfig;
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
      config={props.config ?? sizingV26Config}
    />
  );
}
