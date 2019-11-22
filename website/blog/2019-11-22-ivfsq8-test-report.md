---
title: Milvus 测试报告：IVF_SQ8 索引
author: 陈子睿
---

# Milvus 测试报告：IVF_SQ8 索引

本文描述了 IVF_SQ8 索引在 Milvus 单机部署方式下的测试结果。

## 测试目标

参数不同情况下的**查询时间**和**召回率**。

## 测试指标

**Query Elapsed Time:** 数据库查询所有向量的时间（以秒计）。影响 Query Elapsed Time 的变量：nq (被查询向量的数量)。

**Recall:** 实际返回的正确结果占总数之比。影响 Recall 的变量：a）nq (被查询向量的数量); b）topk (单条查询中最相似的 K 个结果)。

## 软硬件环境

- 操作系统：CentOS Linux release 7.6.1810 (Core) 

- CPU：Intel(R) Xeon(R) CPU E5-2678 v3 @ 2.50 GHz

- GPU0：GeForce GTX 1080

- GPU1：GeForce GTX 1080

- 内存：503 GB

- Docker 版本：18.09

- NVIDIA Driver 版本：430.34

- Milvus 版本：0.5.3

- SDK 接口：Python 3.6.8

- pymilvus 版本：0.2.5

## 参数设置

- 数据集（[SIFT1B](http://corpus-texmex.irisa.fr/)）

  - 数据：1,000,000,000向量, 128维
  
  - 数据类型：hdf5

- 表格属性

  - nlist: 16384

  - metric_type: L2

- 查询设置

  - nprobe: 32

- Milvus 设置

  - cpu_cache_capacity: 150

  - gpu_cache_capacity: 6

  - use_blas_threshold: 1100

- 查询后是否重启 Milvus：否

## 查询时间测试

### GPU 模式（search_resources: gpu0, gpu1）

![query_gpu](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/test_report/ivfsq8_query_time_gpu.png)

当 nq 为1000时，在 GPU 模式下查询一条128维向量需要耗时约17毫秒。

### CPU 模式（search_resources: cpu, gpu0）

![query_cpu](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/test_report/ivfsq8_query_time_gpu.png)

当 nq 为1000时，在 GPU 模式下查询一条128维向量需要耗时约27毫秒。

### 结果分析

在 CPU 模式下查询耗时随 nq 的增长快速增大，而在 GPU 模式下查询耗时的增大则缓慢许多。当 nq 较小时，CPU 模式比 GPU 模式耗时更少。但当 nq 足够大时，GPU 模式则更具有优势。

在 GPU 模式下的查询耗时由两部分组成：（1）索引从 CPU 到 GPU 的拷贝时间；（2）所有分桶的查询时间。当 nq 小于500时，索引从 CPU 到 GPU 的拷贝时间无法被有效均摊，此时 CPU 模式时一个更优的选择；当 nq 大于500时，选择 GPU 模式更合理。

和 CPU 相比，GPU 具有更多的核数和更强的算力。当 nq 较大时，GPU 在计算上的优势能被更好地被体现。

## 召回率测试

### GPU 模式（search_resources: gpu0, gpu1）

![recall_gpu](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/test_report/ivfsq8_recall_gpu.png)

### CPU 模式（search_resources: cpu, gpu0）

![recall_cpu](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/test_report/ivfsq8_recall_cpu.png)

### 结果分析

随着 nq 的增大，召回率逐渐稳定至93%以上。

如果您想了解更详细的测试报告结果，请参阅 [IVF_SQ8 测试报告](https://github.com/milvus-io/milvus/blob/0.6.0/docs/test_report/milvus_ivfsq8_test_report_detailed_version_cn.md)。


