---
title: 在 Docker 容器中编译运行 Milvus
author: 莫毅华
---

# 在 Docker 容器中编译运行 Milvus

Milvus 主要是在 Ubuntu 环境下进行开发的，我们推荐的编译环境首选是 Ubuntu 18.04。在0.6.0之前的版本都是使用 GPU 加速的版本，但很多使用者反映他们希望在无 GPU 的机器上运行 Milvus，于是我们在0.6.0上通过编译选项提供了 CPU 和 GPU 两种版本。

但在 CPU 版本的 Docker 镜像没有发布前，很多使用者不得不自己去编译 CPU 版本，由于各人的机器环境千差万别而遇到了各种各样的编译问题。因此我们上传了两个 Docker 镜像，分别提供了 Milvus CPU 和 GPU 版本所需要的编译环境。

使用这两个镜像编译 Milvus，具体做法如下：

## 步骤1 拉取镜像

CPU 版编译环境的镜像：
```
docker pull milvusdb/milvus-cpu-build-env:v0.6.0-ubuntu18.04
```
GPU 版编译环境的镜像：
```
docker pull milvusdb/milvus-gpu-build-env:v0.6.0-ubuntu18.04
```
![docker_image](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/docker_compile/docker_image.png)

我的 docker 做了免 sudo 运行的设置，有些使用者可能需要加 sudo 才能运行，如果嫌麻烦，可以查阅 “免sudo使用docker” 相关文档。

这里需要注意的是，如果使用 GPU 版本的镜像，必须要安装 nvidia-docker，具体可参考: [nvidia-docker 官方文档](https://github.com/NVIDIA/nvidia-docker/)

## 步骤2 启动容器

启动 CPU 版本容器：
```
docker run  -it -p 19530:19530 -d milvusdb/milvus-cpu-build-env:v0.6.0-ubuntu18.04
```

启动 GPU 版本容器：
```
docker run --runtime=nvidia -it -p 19530:19530 -d milvusdb/milvus-gpu-build-env:v0.6.0-ubuntu1
```

![docker_run](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/docker_compile/docker_run_gpu.png)

容器创建出来后，会给出一个容器的 ID，比如上面这个 `d4adxxxxx`。我们现在要进入这个容器里：

```
docker exec -it [container_id] bash
```
这里的 `container_id` 就换成上一条命令看到的那个 `d4adxxxxx`，我们就进入了容器内部。

![docker_exec](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/docker_compile/docker_exec.png)

## 步骤3 在容器中下载 Milvus 源码并进行编译

先进入一个能往里写东西的目录，比如 home 目录：

```
cd /home
```

下载源码，目前是0.6.0：

```
wget https://github.com/milvus-io/milvus/archive/0.6.0.zip
```

更新一下apt-get，安装一个解压工具:

```
apt-get update
apt-get install unzip
```

解压源码包：

```
unzip ./0.6.0.zip
```

我们看到源码被解压到一个叫 milvus-0.6.0 的文件夹里，进入其 core 目录：

```
cd ./milvus-0.6.0/core
```

如果你用的是 CPU 镜像，就这么编译：

```
./build.sh -t Release
```

如果你用的是 GPU 镜像，就需要加一个 `-g` 参数：

```
./build.sh -g -t Release
```

参数 `-t Release` 意思是编译 Release 版本，如果你想调试的话，也可以编译 Debug 版本。

不出意外的话，编译成功。然后我们启动编译好的 Milvus 服务程序：

```
./start_server.sh
```

![server_start](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/docker_compile/server_start.png)

这个 `start_server.sh` 指定 `core/conf` 目录下的 `server_config.yaml` 和 `log_config.conf` 作为配置启动 Milvus。

Milvus 数据存储路径是由 `server_config.yaml` 文件里的 `primary_path` 这一项指定的，默认的路径是：`/tmp/milvus`。

所以，如果之后你想查看 Milvus 的日志文件，就可以到 `/tmp/milvus/logs` 目录里去看。

## 步骤4 使用 python 连接 Milvus 并做些操作

在写脚本之前，先确定 pymilvus 已经安装：
```
pip3 install pymilvus==0.2.5
```
pymilvus 的主页上有一张 Milvus 和 pymilvus 版本配对的表格，目前还没有0.6.0的配对信息，但之前0.5.3所对应的 pymilvus-0.2.5 也是能用在0.6.0上的，之后会有新的版本和0.6.0对应。

python 的环境都没问题的话，就可以写测试脚本了，比如可以在 pycharm 里写个脚本在 Milvus 里创建一张表，运行之后就能看到返回的成功信息：

![connect_py](https://raw.githubusercontent.com/milvus-io/www.milvus.io/master/website/blog/assets/docker_compile/connect_py.png)






