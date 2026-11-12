import { sizingV26Config } from './config';
import { DependencyComponentEnum } from '@/types/sizing';
import { DEPENDENCY_COMPONENTS } from '@/consts/sizing';
import { helmYmlGeneratorV300, operatorYmlGeneratorV300 } from '@/utils/sizingToolV300';
import { SizingVersionConfig } from '@/parts/sizingCommon/types';

export const sizingV300Config: SizingVersionConfig = {
  ...sizingV26Config,
  version: 'v300',
  supportsSindi: true,
  consts: {
    ...sizingV26Config.consts,
    DEPENDENCY_COMPONENTS: DEPENDENCY_COMPONENTS.filter(d => d.value === DependencyComponentEnum.Woodpecker),
  },
  resultConsts: {
    ...sizingV26Config.resultConsts!,
    operatorCodeExample: `helm repo add milvus-operator https://zilliztech.github.io/milvus-operator/
helm repo update milvus-operator
helm -n milvus-operator upgrade --install milvus-operator milvus-operator/milvus-operator --version 1.3.0 --create-namespace
kubectl apply -f operatorConfigYml.yml`,
    helmCodeExample: `helm repo add milvus https://zilliztech.github.io/milvus-helm/
helm repo update
helm install my-release milvus/milvus --version 5.0.33 -f helmConfigYml.yml`,
  },
  utils: {
    ...sizingV26Config.utils,
    helmYmlGenerator: helmYmlGeneratorV300,
    operatorYmlGenerator: operatorYmlGeneratorV300,
  },
};
