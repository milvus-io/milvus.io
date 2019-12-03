---
title: 如何选择索引类型 (一)
author: 蔡宇东
---

# 如何选择索引类型 (一)

在 Milvus v0.6.0 版本，支持的索引类型包括如下几种：

- FLAT
- IVFFLAT
- IVFSQ8
- IVFSQ8H

在不同的应用场景下该如何选择一种合适的索引并非那么地显而易见，需要在资源使用量、查询效率、查询召回率等多个指标中做权衡。

本文中用到的一些符号及专用名词说明如下：

| 专用名词       | 解释                            |
| -------------- | ---------------------------------- |
| nq             | 查询的目标向量条目数，在搜索时定义。       |
| topk 或 k      | 与查询的目标向量最相似的 topk 个结果。 |
| 召回率或 recall | 返回的结果集中正确的结果所占的比重。 |
| nlist          | 聚类时总的分桶数，在创建索引时定义。        |
| nprobe         | 查询时需要搜索的分桶数目，在搜索时定义。   |

## FLAT

FLAT 并不是一种真正的索引，但由于它与其它的索引有一致的接口及使用方法，Milvus 把它视为一种特殊的索引。FLAT 的查询速度在所有的索引中是最慢的，但是当需要查询的次数较少，构建索引的时间无法被有效均摊时，它反而是最有效的查询方式。FLAT 的另一个优点是，它能达到100％的查询召回率，这是所有其它索引类型所无法达到的。而且 FLAT 不需要数据做训练，不需要配置任何参数，也不需要占用额外的磁盘空间（其它的索引类型在保存成文件时需要占用额外的磁盘空间）。

- 优点：
  - 100％查询召回率
  - 无需训练数据，无需配置任何系统参数，也不会占用额外的磁盘空间

- 缺点：查询速度慢

Milvus 可以同时查询 nq 条向量，并一次性返回 nq 条向量的 topk 个最近邻向量（包括向量 id 和距离）。

下图是在2,000,000条128维向量数据集上测得的，分别在 CPU 和 GPU 模式下，FLAT 查询时间随 nq 的变化曲线 。查询时间与 topk 无关，随着 nq 的增大而增大。

![flat_query](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/index_select/flat_query.PNG)

用 GPU 能够获得更好的查询性能，但需要考虑额外的从内存到显存的数据拷贝时间。当 nq 小于20时，FLAT 在 CPU 上查询得更快。

除了 FLAT 之外，其它的索引方法都需要对原始数据集做预处理，包括训练（Train）和聚类（Clustering）。索引类型名称前带有 IVF 前缀说明聚类所采用的方法是倒排索引。在默认情况下，Milvus 每接收到1 GB 的原始数据（2,000,000条128维向量的数据大小约为1GB），就会启动一个新的线程对这1 GB 数据做训练和聚类，并将生成的索引文件保存到磁盘。数据的导入和索引的构建在不同线程并发执行。

## IVFFLAT

IVFFLAT 是最简单的索引类型。在聚类时，向量被直接添加到各个分桶中，不做任何压缩，存储在索引中的数据与原始数据大小相同。查询速度与召回率之间的权衡由参数 nprobe 来控制。nprobe 越大，召回率越高，但查询时间越长。IVFFLAT 是除了 FLAT 外召回率最高的索引类型。

- 优点：查询召回率高

- 缺点：占用空间大


用公开数据集 sift-1b（10亿条128维向量）建立 IVFFLAT 索引，并分别只用 CPU 或 GPU 做查询，在不同 nprobe 参数下测得的查询时间随 nq 变化曲线如下图：

![ivfflat_query](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/index_select/ivfflat_query.PNG)

IVFFLAT 在 CPU 上的查询时间与 nq、nprobe 正相关，而 IVFFLAT 在 GPU 上的查询时间对 nq 和 nprobe 的变化并不敏感。这是因为 IVFFLAT 的索引数据较大，将索引数据从 CPU 拷贝到 GPU 所用时间占了总查询时间的大部分。由图所示，除了 nq＝1000且 nprobe＝32的情况，IVFFLAT 在 CPU上的查询效率更高。

用公开数据集 sift-128-euclidean（1,000,000 条128维向量）和 glove-200-angular（1,183,514 条200维向量）分别建立 IVFFLAT 索引（nlist = 16384），并测得召回率（k = 10）随 nprobe 变化曲线如下图：

![ivfflat_recall](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/index_select/ivfflat_recall.PNG)

当 nprobe = 256时，IVFFLAT 在 sift-128-euclidean 数据集上的查询召回率（k=10）能达到0.99以上。

## IVFSQ8

由于 IVFFLAT 未对原始的向量数据做任何压缩，IVFFLAT 索引文件的大小与原始数据文件大小相当。例如 sift-1b 数据集原始数据文件的大小为 476 GB，生成的 IVFFLAT 索引文件大小有470 GB左右，若将全部索引文件加载进内存，就需要470 GB的内存资源。

当磁盘或内存、显存资源有限时，IVFSQ8 是一个更好的选择。它通过对向量进行标量量化（Scalar Quantization），能把原始向量中每个 FLOAT（4字节）转为 UINT8（1字节），从而可以把磁盘及内存、显存资源的消耗量减少为原来的1/4~1/3。同样以 sift-1b 数据集为例，生成的 IVFSQ8 索引文件只有140 GB。

-  优点：查询速度快，资源占用仅为IVFFLAT的1/4~1/3

-  缺点：查询召回率比IVFFLAT低

用公开数据集sift-1b（10亿条128维向量）建立 IVFSQ8 索引，并分别只用 CPU 或 GPU 做查询，在不同 nprobe 参数下测得的查询时间随 nq 变化曲线如下图：

![ivfsq8_query](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/index_select/ivfsq8_query.PNG)

IVFSQ8 的查询性能曲线跟 IVFFLAT 非常相似，但索引大小的精减带来了全面的性能提升。同样，在 nq 和 nprobe 较小时，IVFSQ8 在 CPU 上的查询性能更高。

公开数据集 sift-128-euclidean（1,000,000 条128维向量）和 glove-200-angular（1,183,514 条200维向量）分别建立 IVFSQ8 索引（nlist = 16384），并测得召回率（k = 10）随 nprobe 变化曲线如下图：

![ivfsq8_recall](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/index_select/ivfsq8_recall.PNG)

对比IVFSQ 和 IVFSQ8 的召回率，IVFSQ8 对原始数据的压缩并未导致明显的查询召回率下降。对应不同的 nprobe，IVFSQ8 的召回率（k = 10）最多只比 IVFFLAT 低1个百分点。

## IVFSQ8H

IVFSQ8H 是 Milvus 对 IVFSQ8 进行深度优化后新建的一种索引类型。IVFSQ8 索引在 CPU 上查询时，找出距离被查询向量最近的 nprobe 个分桶（Coarse Quantizer）所用的时间占了总查询时间的大部分。IVFSQ8H 把用于 Coarse Quantizer 运算的数据（大小远小于索引数据）单独拷贝到 GPU运算，能大大缩短 Coarse Quantizer 时间。Coarse Quantizer 之后，每个分桶中的查询受配置参数 `gpu_search_threshold` 控制，当nq >= gpu_search_threshold 时，查询在 GPU 上进行；反之在 CPU 上进行。

- 优点：同 IVFSQ8，且查询性能优于IVFSQ8

- 缺点：同 IVFSQ8

IVFSQ8H 需要 CPU 和 GPU 协同工作，因此必须安装支持 GPU 的 Milvus。

用公开数据集 sift-1b（10亿条128维向量）建立 IVFSQ8H 索引，在 `gpu_search_threshold`=1001 时，在不同 nprobe 参数下测得的查询时间随 nq 变化曲线如下图：

![img](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/index_select/ivfsq8h_query.PNG)

当 nq <= 1000时，对比 IVFSQ8 在 CPU 上运行的两条曲线（青色、蓝色）可见，在优化了 Coarse Quantizer 之后，IVFSQ8H 的查询时间比 IVFSQ8 几乎缩减了一半。当 nq=2000时，因为 nq > gpu_search_threshold，分桶内的搜索转为在 GPU 上执行，IVFSQ8H 的查询时间与 IVFSQ8 持平。只要选择合理的 gpu_search_threshold 配置，能保证 IVFSQ8H 的查询性能不会差于 IVFSQ8。

IVFSQ8H 的查询召回率与 IVFSQ8 完全相同。

## 总结

简而言之，每种索引都有自己的适用场景，如何选择合适的索引可以简单遵循如下原则：

1）当查询数据规模小，且需要100％查询召回率时，用 FLAT；

2）当需要高性能查询，且要求召回率尽可能高时，用 IVFFLAT；

3）当需要高性能查询，且磁盘、内存、显存资源有限时，用 IVFSQ8H；

4）当需要高性能查询，且磁盘、内存资源有限，且只有 CPU 资源时，用 IVFSQ8。

 

注：文中测试所用服务器配置如下：

- Intel(R) Xeon(R) Platinum 8163 @ 2.50GHz, 24 cores

- GeForce GTX 2080Ti x 4

- 768GB memory
