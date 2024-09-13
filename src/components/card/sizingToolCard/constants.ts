export const HELM_CONFIG_FILE_NAME = 'helmConfigYml';
export const OPERATOR_CONFIG_FILE_NAME = 'operatorConfigYml';
export const REQUIRE_MORE = 'Require more data';

export enum IndexTypeEnum {
  HNSW = 'HNSW',
  FLAT = 'FLAT',
  IVF_FLAT = 'IVF_FLAT',
  IVF_SQ8 = 'IVF_SQ8',
  DISKANN = 'DISKANN',
}

export const INDEX_TYPE_OPTIONS = [
  {
    label: IndexTypeEnum.HNSW,
    value: IndexTypeEnum.HNSW,
  },
  {
    label: IndexTypeEnum.FLAT,
    value: IndexTypeEnum.FLAT,
  },
  {
    label: IndexTypeEnum.IVF_FLAT,
    value: IndexTypeEnum.IVF_FLAT,
  },
  {
    label: IndexTypeEnum.IVF_SQ8,
    value: IndexTypeEnum.IVF_SQ8,
  },
  {
    label: IndexTypeEnum.DISKANN,
    value: IndexTypeEnum.DISKANN,
  },
];

export const SEGMENT_SIZE_OPTIONS = [
  {
    value: '512',
    label: '512MB',
  },
  {
    value: '1024',
    label: '1024MB',
  },
  {
    value: '2048',
    label: '2048MB',
  },
];
