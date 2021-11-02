import { format } from 'd3-format';

const commonValueCalculator = (vector, dimensions, nlistArg, fileSize) => {
  const vectorCount = Math.min(fileSize / (dimensions * 4), vector);
  const segmentCount = Math.round(vector / vectorCount);
  const nlist = Math.min(nlistArg, vectorCount / 40);
  return {
    vectorCount,
    segmentCount,
    nlist,
  };
};

const pqCalculator = (vectorCount, segmentCount, dimensions, m, nlist) => {
  const singleDiskSize =
    nlist * dimensions * 4 + m * vectorCount + 256 * dimensions * 4;
  const singleMemorySize = singleDiskSize + 256 * m * nlist * 4;
  return {
    pq_diskSize: singleDiskSize * segmentCount,
    pq_memorySize: singleMemorySize * segmentCount,
  };
};

export const computMilvusRecommonds = (
  vector,
  dimensions,
  nlistArg,
  m,
  fileSize
) => {
  const { vectorCount, segmentCount, nlist } = commonValueCalculator(
    vector,
    dimensions,
    nlistArg,
    fileSize
  );

  const { pq_diskSize, pq_memorySize } = pqCalculator(
    vectorCount,
    segmentCount,
    dimensions,
    m,
    nlist
  );

  const size = vector * dimensions * 4;
  const nlistSize = dimensions * 4 * nlist;
  // const mSize = m * vector + nlist * m * 32;
  const byteSize = (dimensions / 8) * vector;

  const rawFileSize = {
    flat: size,
    ivf_flat: size,
    ivf_sq8: size,
    ivf_sq8h: size,
    ivf_pq: size,
  };

  const memorySize = {
    flat: size,
    ivf_flat: size + nlistSize * segmentCount,
    ivf_sq8: size * 0.25 + nlistSize * segmentCount,
    ivf_sq8h: size * 0.25 + nlistSize * segmentCount,
    ivf_pq: pq_memorySize,
  };

  const diskSize = {
    flat: size,
    ivf_flat: rawFileSize.ivf_flat + memorySize.ivf_flat,
    ivf_sq8: rawFileSize.ivf_sq8 + memorySize.ivf_sq8,
    ivf_sq8h: rawFileSize.ivf_sq8h + memorySize.ivf_sq8h,
    ivf_pq: rawFileSize.ivf_pq + pq_diskSize,
  };

  const byteRawFileSize = {
    flat: byteSize,
    ivf_flat: byteSize,
  };

  const byteMemorySize = {
    flat: byteSize,
    ivf_flat: dimensions * nlist + byteSize,
  };

  const byteDiskSize = {
    flat: byteSize,
    ivf_flat: byteRawFileSize.ivf_flat + byteMemorySize.ivf_flat,
  };

  return {
    rawFileSize,
    memorySize,
    diskSize,
    byteRawFileSize,
    byteMemorySize,
    byteDiskSize,
  };
};

export const formatSize = size => {
  let sizeStatus = 1;
  let status = 'BYTE';
  while (sizeStatus < 4 && size > 4096) {
    size = size / 1024;
    sizeStatus++;
  }
  sizeStatus === 2
    ? (status = 'KB')
    : sizeStatus === 3
    ? (status = 'MB')
    : sizeStatus === 4
    ? (status = 'GB')
    : sizeStatus === 5
    ? (status = 'TB')
    : (status = 'KB');

  size = Math.ceil(size);

  return `${size} ${status}`;
};

export const formatVectors = value => {
  return format('~s')(value).replace('G', 'B');
};
