---
title: Milvus 0.6.0新增功能：分区表
author: 莫毅华
---

# Milvus 0.6.0新增功能：分区表

## （一）什么是分区？

经常使用数据库的人应该都了解，随着单张表的数据量不断增长，查询性能也会不断下降。单张表的数据变得很臃肿的时候，就要考虑将这张表拆分。

第一种做法是手工分表，比如某条经常使用的查询语句有查询范围的，没必要对该表的每条数据都过滤一遍，那么用户可以根据自己的业务逻辑将这张表的数据分散到若干个新建表里，这样就可以只针对其中一张表做查询，大幅提高查询效率。不过这样做的缺点是用户不得不自己去维护多张表的关系，不同的查询需要访问不同的表，用户必须自己要知道哪条查询应该去查哪张表。

![manual partition](https://raw.githubusercontent.com/milvus-io/www.milvus.io/tree/master/website/blog/assets/partition/manual_partition.png)

另外一种做法是借助数据库的分区（partition）功能，由数据库内部帮你把数据分散到多个“区”，所有查询仍然是针对一张表的，只不过数据库根据解析查询语句获知应该去哪个“区”去做查询。这个分区的意思是，所有的数据仍然从属于这张表，只不过从存储空间上把数据隔离开了。

![partition](https://raw.githubusercontent.com/milvus-io/www.milvus.io/tree/master/website/blog/assets/partition/partition.png)

当然，如果数据量再大到连单台服务器都无法承受了，那就要考虑分库了，不过这不是这篇文章要说的重点，所以就不赘述。

对于典型的数据库（如 MySQL，PostgresSQL），常见的分区方式有两种：by-range 和 by-list。 By-range 的意思是按某个字段的数值范围来分区，比如某张表里有一个日期字段，那我可以把1月1日到2月1日的作为一个分区，把2月2日到3月1日的作为下一个分区，以此类推。By-list 的意思是把某个字段中出现的数值分组决定分区，比如某张表里有一个表示颜色的字段，1代表红色，2代表黄色，3代表蓝色，那我们可以把数值为1的记录作为一个分区，数值为2的记录作为一个分区，同理3作为另一个分区。

## （二）Milvus 新增的 partition 接口

在0.6.0中，我们增加了几个关于 partition 的接口，并且给 add_vectors/search_vectors 这两个接口各增加了一个参数。

假设已经存在一张叫‘my_table’的表，以下是为该表创建分区/显示分区信息/删除分区的 Python 示例：

```
create_partition({'table_name':"my_table", 'partition_name': "partition_1", 'tag':"aaa"});
show_partitions(table_name="my_table");
delete_partion('table_name':"my_table", 'tag':"aaa");
```

将向量插入到指定的分区：
```
add_vector(table_name="my_table", records=vec_list, ids=vec_ids, partition_tag="aaa");
```
对该表指定分区进行查询：
```
search_vectors(table_name="my_table", query_records=vec_nq, top_k=k, nprobe=p, partition_tags=["aaa"]);
```


这里我们看到一个叫 'tag' 的东西，这和前面说的 by-range 和 by-list 不一样。这是因为目前在 Milvus 的存储系统中并不负责存储向量的属性数据。可以说 Milvus 里每张表只有 'ID' 和 'DATA' 两个字段，'ID' 是向量的唯一标识，'DATA' 是向量的数值数据（比如512维向量就是512个 float 数值的数组），所以目前还无法对属性做 by-range 或 by-list 那样的区分。为了实现把一张表分成多个区的功能，我们引入了 tag 这个概念，tag 就是一个分区的表内唯一标签。

Milvus 的每一个分区实际上都是一张表，其内部运行逻辑和之前的表是几乎相同的。只不过你可以把分区表看成从属于某张表的‘子表’，Partition name 就是分区表的表名。

假设我们有一张表叫 'my_table'，我们用 create_partition 给它创建了两个分区，名字分别是 'partition_1' 和 'partition_2'，标签分别是 'aaa' 和 'bbb'。当我们使用 add_vector 插入向量时，如果标签指定的是 'aaa'，则数据会存储到 'partition_1' 里；如果标签指定了 'bbb'，则数据会存储到 'partition_2' 里；如果没有指定标签，则数据会存在母表 'my_table' 里。当我们使用 search_vectors 指定标签 'aaa' 时，只会对 'partition_1' 进行查询；如果标签指定 'bbb'，只会对 'partition_2' 查询；如果不指定标签，系统会认为你想对 'my_table' 全表做查询，因此会在 'my_table'，'partition_1' 和 'partition_2' 三张表里进行查询。

![tag partition](https://raw.githubusercontent.com/milvus-io/www.milvus.io/tree/master/website/blog/assets/partition/tag_partition.png)

例如用户的向量数据是增量式的，每天都会有新的向量数据录入系统，而热点查询大多数都是针对当天的数据，那么他只需要把日期字符串作为一个 tag，每天的数据都放在一个分区里。比如把'2019-11-11'作为 tag 建立一个分区，查询的时候指定这个 tag 就可以了。

受限于目前的存储方式，使用 tag 来分区的做法有一定的局限性，不能做到像 by-range/by-list 那样灵活。为了增强这种分区规则的灵活性，我们除了让查询能够精确匹配 tag 之外，还允许用户在查询时使用正则表达式匹配分区。Partition 标签是表内唯一的，插入向量时要明确指定 tag，但在查询的时候，用户可以根据 ECMAScript 正则式规则进行模糊查询。比如用户已经按照日期创建了多个分区，分区的 tag 从'2019-1-1'一直到'2019-12-31'，那我想在8月份的数据里进行查询怎么办？那我们给 search_vectors 指定 partition_tags 时，可以有两种方式：一种是把从'2019-8-1'到'2019-8-31'一共31个 tag 都列出来，交给 search_vectors 的 partition_tags 参数；另一种使用正则表达式，只需要一个 regex tag 就能做到：'2019-8-\\d+'。再举个例子，某地区有很多交通卡口，每天有很多过往车辆，智能监控系统把探头拍到的车辆影像从照片中截提取出来，每个车辆影像转换成一个高维向量，并且提取出一些属性，比如车型和颜色等。接着我们按照属性作为 tag 分区，比如'卡车，黑色'，'卡车，黄色'，'轿车，白色'，'轿车，红色'，'电瓶车'，等等。可以看到每个 tag 字符串代表了一部分车辆的共同特点。如果我们想要在轿车里查询，那就把查询 tag 设为'轿车.*'，这是一个正则匹配，所有标签里带有'轿车'字样的分区都会被搜索到，不管是白色还是红色。

## （三）Milvus partition 功能的内部实现

在《Milvus在大规模向量检索场景下的数据管理》这篇文章中我们了解了 Milvus 是怎样管理向量数据的。我们有元数据（meta data）记录了每张表的基础信息以及每个数据文件的信息，当有向量搜索的请求进来时，系统会先去 meta data 里通过 SQL query 得到哪些数据文件要被检索，然后交给查询调度器（Query Scheduler）去执行。

![metadata](https://raw.githubusercontent.com/milvus-io/www.milvus.io/tree/master/website/blog/assets/partition/metadata.png)

为了增加 partition 的功能，我们在 Tables 表里增加了两个字段，分别是 'owner_table' 和 'partition_tag'：

![table](https://raw.githubusercontent.com/milvus-io/www.milvus.io/tree/master/website/blog/assets/partition/table.png)

这样可以很容易地兼容0.4.x和0.5.x版本的数据。分区表在内部也是作为一张真实的表而存在的，因此分区表的名称也是要求全局唯一的，它们有自己的数据空间，它们的索引参数则继承自母表，'owner_table'字段记录的就是它们的母表名字，'partition_tag'则记录了每个分区的标签。

具体到实现上，create_partition实际上做的事情和create_table是基本一样的，只不过多了'owner_table'和'partition_tag'两个字段的设置。show_partitions用来显示一个表的所有分区信息（如果它有分区的话），实际上内部是执行了一个SQL命令：SELECT table_id, partition_tag FROM Tables WHERE owner_table='table_0'。对于add_vector/search_vectors来说，如果用户指定了分区标签，则先找出标签所对应的分区表，然后把插入/查询转发到对应的分区表上。



好了，就说这么多。希望通过这篇文章，能让读者了解到 Milvus 分区功能的原理和特性。各位读者如有建议或意见，可以到我们的 GitHub 项目提 issue 或者 Slack 社区来联系我们.

