import { ReactNode } from 'react';

// Version config type for sizing tool
export interface SizingVersionConfig {
  // Version identifier
  version: 'v3' | 'v250';

  // Whether this version supports RABITQ index and refine feature
  supportsRabitq: boolean;

  // Whether this version supports Woodpecker dependency
  supportsWoodpecker: boolean;

  // The extra node type name in cluster mode
  // v3 uses 'streamNode', v250 uses 'indexNode'
  extraNodeKey: 'streamNode' | 'indexNode';

  // i18n keys for the extra node
  extraNodeLabelKey: string;
  extraNodeTipKey: string;

  // Import paths - these are passed as actual modules
  types: {
    ModeEnum: any;
    IndexTypeEnum: any;
    DependencyComponentEnum?: any;
    RefineValueEnum?: any;
  };

  consts: {
    VECTOR_RANGE_CONFIG: any;
    DIMENSION_RANGE_CONFIG: any;
    MAX_NODE_DEGREE_RANGE_CONFIG: any;
    SEGMENT_SIZE_OPTIONS: any;
    INDEX_TYPE_OPTIONS: any;
    DEPENDENCY_COMPONENTS: any;
    MODE_OPTIONS: any;
    N_LIST_RANGE_CONFIG: any;
    M_RANGE_CONFIG: any;
    MAXIMUM_AVERAGE_LENGTH: any;
    REFINE_OPTIONS?: any;
  };

  utils: {
    memoryAndDiskCalculator: any;
    rawDataSizeCalculator: any;
    $10M768D: number;
    $50M768D: number;
    $500M768D: number;
    $100M768D: number;
    $1B768D: number;
    dependencyCalculator: any;
    clusterNodesConfigCalculator: any;
    standaloneNodeConfigCalculator: any;
    formatNumber?: any;
    unitBYTE2Any?: any;
    milvusOverviewDataCalculator?: any;
    dependencyOverviewDataCalculator?: any;
    helmYmlGenerator?: any;
    operatorYmlGenerator?: any;
    formatOutOfCalData?: any;
  };

  resultConsts?: {
    helmCodeExample: any;
    operatorCodeExample: any;
    HELM_CONFIG_FILE_NAME: string;
    OPERATOR_CONFIG_FILE_NAME: string;
    dockerComposeExample: any;
  };
}

// Dependency option with icon
export interface DependencyOption {
  label: string;
  value: any;
  icon?: ReactNode;
}
