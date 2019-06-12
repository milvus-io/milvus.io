---
id: doc2
title: Milvus向量检索数据库系统
sidebar_label: 2. Milvus向量检索数据库系统
---

## 2.1 Milvus 简介

Milvus 是Zilliz公司为应对AI应用大规模落地，且当前工业界并没有一款成熟向量检索系统，而研制的面向海量特征向量检索的数据库系统。Milvus 旨在帮助用户实现非结构化数据的近似检索和分析，其实现原理是通过AI算法提取非结构化数据的特征，然后利用特征向量唯一标识该非结构化数据，然后用向量间的距离衡量非结构化数据之间的相似度。Milvus的产品特点包括：

- 高维向量数据、高准确度和高性能

Milvus可以提供百亿向量(512维)的秒级响应，数据召回率99%。

- 提供水平线性弹性扩展

Milvus可随着业务增长而伸缩，只需要通过增加更多的机器来满足业务增长需要。

- 高可用

Milvus内部三大集群，均允许部分实例失效，而不影响整个集群的可用性。　

- 支持结构化和向量数据的混合查询

Milvus支持存储结构化数据和非结构化数据，也支持针对结构化和非结构化数据的混合查询。

- 支持实时插入

和很多面向向量检索的算法要求不同，Milvus支持对于特征向量的实时插入，支持边插入数据边查询数据。

- 高易用性

Milvus提供了基于C++/Java/Python的客户端SDK。对于其他类型的语言，Milvus支持通过RESTful和RPC的访问方法。

- 易部署

Milvus是为云而设计的数据库，支持公有云、私有云和混合云，使部署、配置和维护变得十分简单。

- AI模型全支持

Milvus支持目前所有AI训练框架所训练的模型所产生的特征向量，涵盖图片、视频、文本、语音等等方面。

- 跨平台

Milvus可以运行在Linux和Windows平台上，支持x86/ARM/PowerPC等架构，为边缘计算应用提供基础支撑。

- 可视化监控

Milvus提供基于Prometheus的监控和Grafana的可视化展示。

- 易管理

Milvus提供了基于图形化和命令行管理工具。

## 2.2 Milvus产品架构图

![avatar](/img/docs/MilvusArchitecture.png)

2.2.1 Milvus Core Cluster

Milvus计算集群，负责接收SDK过来的查询请求，根据请求的类型，通过查询元数据管理集群，获得所需的数据所在存储集群的位置， 然后从存储节点交互的数据，最后在计算节点归并返回结果。Milvus计算节点本身无状态能够任何扩展，通过负载均衡组件对外提供请求接入。

2.2.2 Milvus Store Cluster

Milvus 数据存储上依据哈希的方式进行分区，每个Milvus存储节点会负责多个分区。Milvus 存储集群使用Raft协议做复制，保持数据的一致性和容灾。副本也是以分区进行管理的，相同Table的分区会分布在不同的存储节点上，互为备份。数据在多个存储节点上的负载均衡是有元数据管理集群进行调度。

2.2.3 Milvus Meta Management Cluster

Milvus 元数据管理集群的管理模块构建于ETCD之上，主要工作分成两部分：

- 存储集群的元数据信息，如某个数据分区在哪个存储节点上
- 对存储集群的调度，(数据迁移，选主等)

Milvus 元数据管理集群，使用Raft协议保证所存数据的安全性，所有的操作由Leader Server负责。

2.2.4 Milvus Cluster Monitoring

Milvus 使用开源时序数据库系统Prometheus，作为系统性能指标的监控系统，同时使用Grafana做可视化展示。Prometheus作为最新一代的监控系统，具有：

- 支持多维度数据模型
- 高效的存储
- 采用PromQL提供强大的查询功能
- 服务自动发现
- 易部署、易集成、外部依赖少
- 集成了Grafana，可视化功能强大

目前Prometheus作为云原生应用基金会(CNCF)已毕业项目，已经有了众多的成功案例。

2.2.5 Milvus Management Interface

除了监控组件外，Milvus还提供了基于命令行和图形化的两种管理接口，其中图形化界面类似于MySQL的PhpMyAdmin。通过管理接口，运维人员可以管理Milvus内部的数据表、分区和元数据，也可以查看当前的数据库状态。

2.2.6 Milvus SDK Interface

Milvus的客户端使用gRPC与服务端通信，目前Milvus提供了基于gRPC的C++、Java和Python的SDK供用户使用，对于以上三种以外的语言，可以使用gRPC与Milvus服务端通信。

## 2.3 Milvus 产品的技术优势

Milvus向量数据库是MPP查询架构以及混合索引结构，支持不同异构众核加速芯片，通过SIMD指令加速、高效索引算法、混合检索策略以及低成本存储技术，从而实现高性能，低成本的非结构化准确查询和近似查询。Milvus的具体技术优势如下：

- 异构计算

Milvus支持使用多种异构众核加速芯片(FPGA/GPU/AI加速芯片等)，其中就包括：NVIDIA的异构众核加速芯片GPU。Milvus 可以利用其大规模并行计算能力，可以提供费效比极低的向量能力，从而为提供高性能向量检索能力，提供硬件基础。

- 芯片指令级优化

Milvus在不同平台下会使用不同的指令级的优化，加速计算。例如在Intel的x86环境下，会采用Intel的SIMD扩展SSE和AVX指令集；而在使用NVIDIA GPU芯片计算时，则会使用cublas等向量计算库，加速计算。

- 内置多种向量检索算法

Milvus内部除了使用了目前业界主流面向向量检索的算法外，还集成了Zilliz自己研发的向量检索算法。由于目前没有一种算法能够应对当前所有的向量检索场景，Milvus集成的多种算法为全面支持向量检索，提供了算法基础。此外，由于不同的向量索引建立的规则和速度并不一样，Milvus还支持混合索引方式：同一张表不同时间和规模插入的数据，会允许采取不同的索引方式，以有效提高数据存储和查询效率。

- 混合存储和多级流水线

Milvus除了可以把数据存入本地的SSD外，还可以把冷数据归档到高可靠的海量对象式存储中。目前主流的海量对象式存储方案都支持：Minio/HDFS/S3/Blob等。此外，根据数据访问的热度，Milvus还实现了内存/显存的多级缓存，支持数据加载和计算的流水线。

- 智能适配向量检索算法

Milvus可根据数据分布、数据规模、用户配置等，智能从目前支持的向量检索算法中，选择最匹配的算法建立索引和进行数据检索。

- 面向特征向量的高效存储

Milvus提供了针对特征向量的高效存储，根据索引算法不同，支持针对不同格式索引文件的存储。

- 支持基于数据范围的分区

Milvus 支持基于数据范围的一级分区，用户可以业务形态的不同，定义一列或者多列的数据范围作为数据分区。对应的查询也会在对应的分区上进行，从而明确了数据搜索范围，可有效提高检索性能。

## 2.4 Milvus的安装、部署和运行

2.4.1 Milvus单机版的软硬件要求

2.4.1.1 Milvus软硬件环境的建议配置

Milvus是一款面向向量检索的数据库系统，可以很好的运行和部署在x86架构的服务器环境和主流的虚拟化环境下，也支持目前主流的网络硬件设备。操作系统方面，Milvus支持目前主流的Linux操作系统环境。

2.4.1.2 Linux操作系统版本要求

| Linux 操作系统平台       | 版本        |
| :----------------------- | :---------- |
| Red Hat Enterprise Linux | 7.5及以上   |
| CentOS                   | 7.5及以上   |
| Ubuntu LTS               | 16.04及以上 |

2.4.1.3 典型硬件配置要求

| 硬件名称 | 硬件要求         |
| -------- | ---------------- |
| CPU      | 16核+            |
| GPU      | Pascal系列及以上 |
| 内存     | 256GB及以上      |
| 硬盘类型 | SSD或者NVMe      |
| 网络     | 万兆网卡         |

2.4.1.4 客户端浏览器要求

Milvus 提供了基于Prometheus监控和Grafana的展示平台，可以对数据库的各项指标进行可视化展示，兼容目前主流的Web浏览器如：微软IE、Google Chrome、Mozilla Firefox和Safari等。

2.4.2 Milvus的安装、License申请与启动

2.4.2.1安装准备

在安装Milvus之前，首先请确保您的机器上已经安装了：

- CUDA 9.0及以上
- Docker CE
- NVIDIA-Docker2

对于CUDA的安装方法和步骤，请移步：https://docs.nvidia.com/cuda/

对于Docker CE的安装方法和步骤，请移步：https://docs.docker.com/install/

对于NVIDIA-Docker2的安装方法和步骤，请移步：https://github.com/NVIDIA/nvidia-docker

2.4.2.2 Milvus的安装

首先请先通过Zilliz官方网站，申请使用Milvus，然后客服人员会向您提供Milvus的Docker Image，拿到Docker Image后，将其下载到安装机器内，然后运行下面的命令导入Milvus容器：

```
# 导入 Milvus Docker Image
docker load < milvus.tar
docker tag IMAGEID milvus/ubuntu16.04:beta
```

2.4.3 License的申请与安装

2.4.3.1 License的申请

首先在Milvus的Docker Container内找到获取系统信息的工具: get_sys_info，运行产生系统信息文件。

```
# 产生 Milvus运行系统信息文件：system.info
./get_sys_info -s system.info
```

然后，将该文件发送给Zilliz技术支持人员，Zilliz技术支持人员会据此产生针对您的系统运行的License Key文件：system.license

2.4.3.2 License的安装

在收到Zilliz技术支持人员给您发的LicenseKey后，请把它放到Milvus系统配置文件里license_config下的license_path所给的目录下。

2.4.4 启动Milvus

启动Milvus，并且在端口33001端口接受客户端请求：

```
# 启动 Milvus
nvidia-docker run -p 33001:33001 milvus/ubuntu16.04:beta
```

检查 Milvus 运行状态：

```
# 查看 Milvus 的日志输出
docker logs <Milvus container id>
```

通过上面的命令可以看到Milvus的启动状态和运行日志。

## 2.5 Milvus的配置详解

目前Milvus的配置共分成三部分，下面会一一说明。

2.5.1 server_config: Milvus服务配置

- address: 目前Milvus server监听的ip地址。
- port: 目前Milvus server监听的端口号。
- transfer_protocol：Milvus client与server通信的协议，可以是：binary, compact和json。
- server_mode: 目前支持simple：单线程和thread_pool：线程池，两种模式。
- gpu_index: 目前使用的GPU

2.5.2 db_config: Milvus数据库配置

- db_path: Milvus数据库文件存储的路径。
- db_backend_url: 使用RESTFul API接口访问数据库的ip地址。
- db_flush_interval: 插入数据持久化的时间间隔

2.5.3 metric_config: Milvus监控参数配置

- startup: 是否启动监控：on或off。
- collector: 连接的监控系统：目前支持prometheus。
- prometheus_config: promethus监控相关配置。
  - collect_type: prometheus的监控获取方式：支持pull或者push方式。
  - port: 访问prometheus的端口号。
  - push_gateway_ip_address: push gateway的ip地址，push方式有效。
  - push_gateway_port: push gateway的端口号，push方式有效。

## 2.6 Milvus的监控　

2.6.1 概述

Milvus的监控系统是基于开源监控框架Prometheus搭建的。目前，Milvus server收集数据后，利用的pull模式把所有数据导入Prometheus。然后，我们就通过Grafana展示所有监控指标了，同时一旦发生告警Prometheus会将告警信息可以推送给AlertManager，后通过E-Mail或者WeChat将通知用户用户。告警系统架构如下：

![avatar](/img/docs/Monitoring.png)

2.6.2 使用Prometheus和Grafana监控Milvus

搭建监控系统：

- Prometheus Server 参考：https://github.com/prometheus/prometheus#install
- Grafana 参考：[http://docs.grafana.org](http://docs.grafana.org/)

Milvus配置：

- 参考3.5.3章节的Metrics配置

Prometheus Server配置：

**TBD**

Grafana配置：

**TBD**

2.6 Milvus最佳实践

**TBD**

## 2.7 Milvus技术支持

**TBD**



