export const HELM_CONFIG_FILE_NAME = 'helmConfigYml';
export const OPERATOR_CONFIG_FILE_NAME = 'operatorConfigYml';
export const REQUIRE_MORE = 'Require more data';

export const INDEX_TYPE_OPTIONS = [
  {
    label: 'HNSW',
    value: 'HNSW',
  },
  {
    label: 'FLAT',
    value: 'FLAT',
  },
  {
    label: 'IVF_FLAT',
    value: 'IVF_FLAT',
  },
  {
    label: 'IVF_SQ8',
    value: 'IVF_SQ8',
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
