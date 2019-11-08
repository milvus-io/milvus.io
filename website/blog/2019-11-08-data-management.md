---
title: Milvus 在大规模向量检索场景下的数据管理
author: 莫毅华
---

# Milvus 在大规模向量检索场景下的数据管理
## Milvus 是如何管理数据的？

先来说一些基本概念：

- 表：表可以理解为向量数据的集合，每条向量必须有一个唯一的 ID 来区分，每一条向量以及它的 ID 就是表里的一行数据，每个表里的所有向量必须是同一维度的。
下面是一张维度为10的表的示意图：

![table](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/data_manage/table.png)

- 索引：建立索引的过程可以理解为通过某种算法把大批向量分成很多簇。索引是要额外使用磁盘空间的。有些类型的索引会对数据压缩或简化，占用量相对较小；有的索引类型占用的空间甚至比原始向量数据都大。

用户可以有这些操作：创建表、插入向量、建立索引、搜索向量、获取表信息、获取索引信息、删除表、删除表里部分数据、删除索引等等。

假设现在我们有一亿条512维度的向量，需要把这些数据管理起来，并且能够做向量检索。

**（1）向量数据的录入：Insert**

我们先来看看向量数据是怎么录入的。

首先我们要把这一亿条向量录入向量数据库中，每条这样的向量要占据2 KB的空间，一亿条就是200 GB，显然想一次性导入不现实，写入磁盘的数据文件也不可能只有一个文件，肯定要分成多个文件。插入性能也是主要性能指标之一，Milvus 允许批量地插入向量，一次性地插入几百甚至几万条向量都是允许的，对于512维的高维向量，通常可以达到每秒三万条的插入速度。

![insert](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/data_manage/insert.png)

并不是每次插入向量数据都去写磁盘，系统会给每个表在内存里开辟一块空间作为可写缓冲（mutable buffer），数据可以很快速地直接写入可写缓冲里，当积累到一定数据量之后，这个可写缓冲就会被标记为只读的（immutable buffer），并且会自动开辟新的可写缓冲等待新的数据。immutable buffer 会被定时写入磁盘，写入完成后这块内存会被释放，这里的定时写磁盘机制与 Elasticsearch 类似（Elasticsearch 默认是每隔1秒将缓冲数据写入磁盘）。另外，熟悉 LevelDB/RocksDB 的读者能看出来这里面有 MemTable 的影子。

这样做的目的主要是为了兼顾以下几点：

- 数据导入效率要高
- 数据导入后尽快可见
- 数据文件不要过于碎片化

**（2）原始数据文件：Raw Data File**

数据写入磁盘后，成为原始数据文件（Raw Data File），保存的是向量的原始数据。前面我们说过，海量的数据肯定是分散成多个文件来管理的。插入向量的数据量是可大可小的，用户可能一次插入10条向量，也可能一次插入100万条向量。而写磁盘的操作是间隔一秒持续进行的，并不会等到插入满1 GB的数据之后再写磁盘，因此会形成很多大小不一的文件。

零碎的文件并不利于管理，也不利于向量检索操作，因此系统会不断地把这些小文件合并，直到合并后的文件大小达到或超过1 GB。Milvus有一个配置选项，用来确定每个原始数据文件的大小，默认是1 GB，也就是说，一亿条512维向量最终会被分散成大约200个文件来存储。

考虑增量库的使用场景，同时会有向量插入和向量检索操作，我们需要保证一旦数据落盘，就必须能够被检索到。所以，在小文件被合并完成之前，会使用这些小文件进行检索；一旦合并完成，就会删除这些小文件，用合并之后的文件进行检索。

下图是合并之前的检索：

![rawdata1](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/data_manage/rawdata1.png)

合并成功之后是这样检索：

![rawdata2](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/data_manage/rawdata2.png)

**（3）索引文件：Index File**

上面说的对 Raw Data File 的检索是一种暴力计算（brute-force search），即用目标向量和原始向量一条一条地计算距离，得出最近的 k 条向量，这是很低效的。建立索引可以大幅提高检索效率，之前我们说过索引是要占用额外磁盘空间的，而且建立索引也比较耗时。

那原始数据文件和索引文件的格式有何区别？简单来说，原始数据文件就是把 n 个向量一个接一个地记录下来，包括向量的 ID 以及向量数据；索引文件则记录了聚类运算后的结果，包括索引的类型，每个簇的中心向量，以及每个簇分别有哪些向量。

下图是这两种文件格式上的简化表示：

![indexfile](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/data_manage/indexfile.png)

总的来说索引文件包含的信息比原始数据文件要多，不过有的索引类型对向量数据进行了简化或者压缩，所以总的文件 size 会小很多。

当用户建了一张新表，这张表的索引类型默认是无索引，检索都是通过暴力计算的方式进行；一旦建立了索引之后，系统会对合并后达到1 GB的原始数据文件自动建立索引，这个事情是由一个单独的线程来完成的。建立好索引后，会生成一个新的索引文件，而原来的原始数据文件不会被删掉，会被备份起来，以便以后可以切换成别的索引类型。

系统自动对达到1 GB的原始数据文件建立索引：

![buildindex](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/data_manage/buildindex.png)

1 GB的原始数据文件索引完成：

![indexcomplete](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/data_manage/indexcomplete.png)

未达到1 GB的文件不会被自动建立索引，会影响检索速度。如果想得到更好的检索效率，就要对该表进行强制建立索引的操作：

![forcebuild](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/data_manage/forcebuild.png)

强制建立索引后，检索速度最快：

![indexfinal](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/data_manage/indexfinal.png)

**（4）数据的信息：Meta Data**

前面我们说一亿条512维向量大约会有200个磁盘文件，如果建立了索引，就是大约400个文件。Milvus 在运行过程中要修改这些文件的状态，删除文件，创建文件等等，所以就需要一套机制来管理文件的状态和信息，这就是元数据（meta data）。

使用 OLTP 数据库来管理这些信息是一个很好的选择，在单机模式下，Milvus 使用 SQLite 来管理元数据，而在分布式模式下，Milvus 使用 MySQL 来管理元数据。程序启动后，会在 SQLite/MySQL 中建立两张表，分别叫 Tables 和 TableFiles。Tables 是用来记录全部表的信息，TableFiles 则是记录全部数据文件以及索引文件的信息。

如下图所示，Tables 元数据信息中包括了表名（table_id)、表的向量维度（dimension）、创建日期（created_on）、状态（state）、索引类型（engine_type）、聚类的分簇数量（nlist）、距离计算方式（metric_type）等。

TableFiles 则记录了文件所属的表名（table_id）、文件的索引类型（engine_type）、文件名（file_id）、文件类型（file_type）、文件大小（file_size）、向量行数（row_count）、创建日期（created_on）。

![metadata](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/data_manage/Metadata.png)

有了这些元数据，就可以根据元数据来进行各种操作了。

- 如果要创建一张表，Meta Manager 会执行一条 SQL 语句：INSERT INTO TABLES VALUES(1, 'table_2, 512, xxx, xxx, ...)；

- 如果要对表 table_2 执行向量检索，Meta Manager 先去 SQLite/MySQL 中做一个查询，实际上就是运行一条SQL语句：SELECT * FROM TableFiles WHERE table_id='table_2' ，这样就得到了table_2表所有的文件信息，然后这些文件就会被查询调度器（Query Scheduler）调入内存，就可以进行运算了。

- 如果要删除表 table_2，我们是不能立即把这个表以及它的文件全部删除的，因为这个时候有可能正在执行对这张表的检索。因此删除操作有软删除（soft-delete）和硬删除（hard-delete）。执行了删除表的操作后，该表会被标记为 soft-delete 状态，之后对该表的检索或修改操作都是不允许的。但删除之前所执行的查询操作仍在进行，只有当所有对该表的查询操作完成之后，该表才会被真正地删除，包括它的元数据信息以及各种文件。

**（5）查询调度：Query Scheduler**

下图表示了一个有若干文件（包括原始数据文件和索引文件）的表做一次 top-k 查询时，数据在磁盘、内存、显存中发生拷贝，分别在 CPU 和 GPU 进行向量搜索得出最终结果的过程：

![topkresult](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/data_manage/topkresult.png)

查询调度算法对性能的影响极为明显，其基本原则是最大程度地利用硬件资源获得最好的查询性能。以后我们会有专门文章讲解 Milvus 的查询调度机制。这里只是先简单讲解一下。

我们把对某张表的第一次查询称为冷查询，其后的查询叫热查询。当 Milvus 服务启动后，第一次查询时数据都在硬盘上，需要把数据加载到内存，另外还有部分数据会加载到显存，从硬盘加载数据到内存相对是比较耗时的；而第二次查询时，部分或者全部数据已经在内存里，就省去了读硬盘的时间，查询就会变得很快。

为了避免第一次查询时间过长，Milvus 提供了预加载机制，用户可以指定服务启动后自动加载数据到内存。对于一亿级别的表（512维），数据量是200 GB，好一点的服务器有足够的内存装载全部数据。这种条件下的查询速度是最快的。而对于十亿以上级别的表，查询时就无法避免地要对数据做置换，也就是把使用完的部分数据从内存或显存中释放，换上其他未查询的数据。目前我们使用LRU（Latest Recently Used）策略作为数据的置换策略。

如下图所示，假设某张表有六个索引文件存在服务器磁盘上，该服务器的内存只够装得下三个文件，而显存只能装一个文件。

查询开始时，先从磁盘读入三个文件装进内存，对第一个文件查询完成后，把它从内存中释放，同时从磁盘装入第四个文件。同理，第二个文件交给显卡处理，对该文件查询完成后把它从显存中释放，再从内存调入其他文件。

调度器中主要有两组任务队列，一个是加载数据的任务队列，另一个是执行搜索队列，它们就像流水线一样处理这些任务。

![queryschedule](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/data_manage/queryschedule.png)

**（6）结果集的归并：Result Reducer**
向量检索有两个关键参数：一个是 n，指 n 条目标向量；另一个是 k，指最相似的前 k 个向量。对于一次查询来说，结果集是 n 组 key-value 键值对，每组键值对有 k 对键值。一张表包含了多个文件，不管是原始数据文件还是索引文件，都要单独做一次检索。因此，每个文件检索出 n 组 top-k 结果集。然后，将多个文件的结果集进行归并，得出全表最接近的 top-k。

下图是一个示例，假设某张表有四个索引文件，对其做一个 n=2, k=3的查询。示例中结果集的两列数字，左边代表相似向量的编号，右边代表欧氏距离，我们之前已经知道，欧氏距离越小，意味着和目标向量越相似。调度器先分别对四个文件检索得出四组结果集，然后分别两两归并，经过两轮归并后，得到最终的结果集。

![result](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/data_manage/resultreduce.png)

**（7）可能的优化方向**

对于可能的优化方向，目前有几个想法。

- 目前的检索无法检索到 immutable buffer 里的数据，只有等数据落盘了之后才会被检索到，对于有些用户来说，可能会更关心数据的瞬时可见性，如果能检索到 immutable buffer 甚至 mutable buffer 里的数据，那么数据插入即可见。

- 提供分区表的功能，使得用户可以根据自己的需求把数据按照一定规则进行分区，可以针对某个分区的数据进行查询。

- 有些需求希望能够让向量带上属性，还希望能够对属性进行过滤，比如我只想在满足某个属性条件的向量中进行查询。还要能在查询结果中返回向量的属性甚至是向量的原始数据。可能的做法是借助 KV 数据库（比如 RocksDB）来实现。

- 对于某些无时无刻都有数据流入的场景，数据可能存在老化现象，比如用户可能仅仅关心近一个月以来的数据，大部分查询都是在一个月以内的数据进行查询（我们是允许用户根据时间范围进行查询的）。一个月以前的数据就变得不那么有用了，但是又占用了很多磁盘空间，那么我们希望系统可以把这些数据自动迁移到更便宜的存储空间去，需要的时候再调出来，这是一个对旧数据迁移的机制。

## 结语

这篇文章主要集中介绍了 Milvus 数据管理的策略，以后还有专门的文章介绍 Milvus 分布式、向量索引算法以及查询调度器的知识，敬请关注！




