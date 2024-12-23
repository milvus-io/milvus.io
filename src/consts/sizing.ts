import { SegmentSizeEnum, IndexTypeEnum } from '@/types/sizing';

export const ONE_MILLION = Math.pow(10, 6);

export const VECTOR_RANGE_CONFIG = {
  min: 1,
  max: 10000,
  defaultValue: 1,
  domain: [0, 25, 50, 75, 100],
  range: [1, 10, 100, 1000, 10000],
};

export const DIMENSION_RANGE_CONFIG = {
  min: 1,
  max: 10000,
  defaultValue: 128,
  domain: [0, 25, 50, 75, 100],
  range: [32, 128, 768, 1536, 32768],
};

export const NODE_DEGREE_RANGE_CONFIG = {
  min: 1,
  max: 10000,
  defaultValue: 1,
  domain: [1, 5, 15, 20, 25, 30],
  range: [1, 5, 15, 20, 25, 30],
};

export const SEGMENT_SIZE_OPTIONS = [
  {
    label: '512MB',
    value: SegmentSizeEnum._512MB,
  },
  {
    label: '1024MB',
    value: SegmentSizeEnum._1024MB,
  },
  {
    label: '2048MB',
    value: SegmentSizeEnum._2048MB,
  },
];

export const INDEX_TYPE_OPTIONS = [
  {
    label: 'FLAT',
    value: IndexTypeEnum.FLAT,
  },
  {
    label: 'SCANN',
    value: IndexTypeEnum.SCANN,
  },
  {
    label: 'HNSW',
    value: IndexTypeEnum.HNSW,
  },
  {
    label: 'IVF_FLAT',
    value: IndexTypeEnum.IVF_FLAT,
  },
  {
    label: 'IVFSQ8',
    value: IndexTypeEnum.IVFSQ8,
  },
  {
    label: 'DISKANN',
    value: IndexTypeEnum.DISKANN,
  },
];
