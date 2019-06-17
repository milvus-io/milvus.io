---
id: quick_start
title: Milvus 快速入门
sidebar_label: 快速入门
---
##  1. Milvus 快速入门

目前Milvus支持以下版本的Linux: 

| Linux 操作系统平台       | 版本        |
| :----------------------- | :---------- |
| Red Hat Enterprise Linux | 7.5及以上   |
| CentOS                   | 7.5及以上   |
| Ubuntu LTS               | 16.04及以上 |

此外，Milvus安装前，还需要在系统内安装下面软件包：

- CUDA 9.0及以上
- Docker CE
- NVIDIA-Docker2

Milvus镜像大小约2.5GB， 从DockerHub上下载Milvus镜像:

```
$ docker pull milvusdb/milvus:0.3.0
```

您可以通过下面命令启动Milvus Server，并且在端口33001端口接受客户端请求：

```
$ nvidia-docker run --runtime=nvidia -p 33001:33001 -v /home/$USER/milvus:/tmp milvus/ubuntu16.04:0.3.0
```

## 2. Milvus 开发者手册

### 2.1 Milvus 基本架构图

![avatar](/img/docs/Milvus_Singleton_Architecture.png)

Milvus 系统由：Milvus Server，Storage Cluster，Milvus Monitor和 元数据管理四个模块组成。

- Milvus Server是 Milvus核心计算服务，内部由：Engine、Index Builder和Cache三部分组成。
  - Engine负责客户请求的分析，任务的建立和调度，向量的计算，资源的管理等。
  - Index Builder是负责建立向量的索引。
  - Cache 负责计算数据和元数据的缓存。

- Storage Cluster是Milvus存储数据的集群，目前由MinIO对象存储服务集群组成。

- Minvus Monitor是基于开源系统Prometheus框架搭建，负责接收Milvus Server发出的各种监控信息，通过Grafana展示，通过AlertManager发出告警。

- 元数据管理，目前Milvus的元数据是存储在MySQL中的。



### 2.2 Milvus Python SDK Install

```
$ pip install pymilvus
```

Milvus Python SDK的快速入门，请访问：https://pypi.org/project/pymilvus/



### 2.3 Milvus Python Examples

```
from client.Client import Milvus, Prepare, IndexType
import random
import struct
from pprint import pprint


def main():
    # Get client version
    milvus = Milvus()
    print('# Client version: {}'.format(milvus.client_version()))

    # Connect
    # Please change HOST and PORT to correct one
    param = {'host': 'HOST', 'port': 'PORT'}
    cnn_status = milvus.connect(**param)
    print('# Connect Status: {}'.format(cnn_status))

    # Check if connected
    is_connected = milvus.connected
    print('# Is connected: {}'.format(is_connected))

    # Get server version
    print('# Server version: {}'.format(milvus.server_version()))

    # Describe table
    # Check if `test01` exists, if not, create a table test01
    table_name = 'test01'
    res_status, table = milvus.describe_table(table_name)
    print('# Describe table status: {}'.format(res_status))
    print('# Describe table:{}'.format(table))

    # Create table
    #   01.Prepare data
    if not table:
        param = {
            'table_name': 'test01',
            'dimension': 256,
            'index_type': IndexType.IDMAP,
            'store_raw_vector': False
        }

        #   02.Create table
        res_status = milvus.create_table(Prepare.table_schema(**param))
        print('# Create table status: {}'.format(res_status))

    # Show tables and their description
    status, tables = milvus.show_tables()
    print('# Show tables: {}'.format(tables))

    # Add vectors to table 'test01'
    #   01. Prepare data
    dim = 256
    # list of binary vectors
    vectors = [Prepare.row_record(struct.pack(str(dim)+'d',
                                              *[random.random()for _ in range(dim)]))
               for _ in range(20)]
    #   02. Add vectors
    status, ids = milvus.add_vectors(table_name=table_name, records=vectors)
    print('# Add vector status: {}'.format(status))
    pprint(ids)

    # Search vectors
    # When adding vectors for the first time, server will take at least 5s to
    # persist vector data, so we have wait for 6s to search correctly
    import time
    print('Waiting for 6s...')
    time.sleep(6)  # Wait for server persist vector data

    q_records = [Prepare.row_record(struct.pack(str(dim) + 'd',
                                                *[random.random() for _ in range(dim)]))
                 for _ in range(5)]
    param = {
        'table_name': 'test01',
        'query_records': q_records,
        'top_k': 10,
        # 'query_ranges':   # Optional
    }
    sta, results = milvus.search_vectors(**param)
    print('# Search vectors status: {}'.format(sta))
    pprint(results)

    # Get table row count
    sta, result = milvus.get_table_row_count(table_name)
    print('# Status: {}'.format(sta))
    print('# Count: {}'.format(result))

    # Disconnect
    discnn_status = milvus.disconnect()
    print('# Disconnect Status: {}'.format(discnn_status))


if __name__ == '__main__':
    main()
```



