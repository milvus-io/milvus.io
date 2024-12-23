export enum SegmentSizeEnum {
  _512MB = '512',
  _1024MB = '1024',
  _2048MB = '2048',
}

export enum IndexTypeEnum {
  FLAT = 'FLAT',
  SCANN = 'SCANN',
  HNSW = 'HNSW',
  IVF_FLAT = 'IVF_FLAT',
  IVFSQ8 = 'IVFSQ8',
  DISKANN = 'DISKANN',
}

export interface IIndexType {
  indexType: IndexTypeEnum;
  widthRawData: boolean;
  nodeDegree: number;
  nlist: number;
  maxDegree: number;
}
