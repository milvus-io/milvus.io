# GPU Sizing 工具：入参与结果展示规格

> 适用范围：`tools/sizing` 页面的 GPU 估算能力。
>
> 算法来源：内核提供的 `gpu-sizing-demo(1).html`（第二版）。本文只记录**能从该 demo 的自身逻辑闭合推导出来**的部分，未做任何外部联想。
>
> 已落地代码：`src/utils/sizingToolGpu.ts`、`src/types/sizingGpu.ts`、`src/consts/sizingGpu.ts`（纯函数，已通过 803 例对拍验证，0 不一致；UI 尚未接入）。

---

## 一、入参

### A. 数据规模

| 字段                         | 控件           | 范围 / 选项                   | 默认 | 用途                                                           |
| ---------------------------- | -------------- | ----------------------------- | ---- | -------------------------------------------------------------- |
| `num` 向量条数               | Range + 输入框 | 0.001 – 10000（单位 Million） | 1    | 总量 → 段数                                                    |
| `d` 向量维度                 | Range + 输入框 | 2 – 32768                     | 768  | 行宽、所有显存公式                                             |
| `withScalar` 含标量字段      | Switch         | —                             | 关   | 展开下一项                                                     |
| `scalarAvg` 单行平均标量字节 | 输入框（Byte） | ≥ 0                           | 0    | 只进 raw data 和 host 内存，**不进显存、不进 segmentRowCount** |

### B. 索引参数（随索引类型切换显隐）

| 字段                                        | 控件   | 范围                                                            | 默认              | 出现在           |
| ------------------------------------------- | ------ | --------------------------------------------------------------- | ----------------- | ---------------- |
| `indexType`                                 | Select | `GPU_BRUTE_FORCE` / `GPU_IVF_FLAT` / `GPU_IVF_PQ` / `GPU_CAGRA` | `GPU_BRUTE_FORCE` | 全部             |
| `nlist`                                     | 输入框 | 1 – 65536                                                       | 128               | IVF_FLAT、IVF_PQ |
| `trainFraction`（kmeans_trainset_fraction） | 输入框 | 0.01 – 1，step 0.05                                             | 0.5               | IVF_FLAT、IVF_PQ |
| `pqDim`（m / pq_dim）                       | 输入框 | 0 – 32768，**0 = cuVS Auto**                                    | 0                 | 仅 IVF_PQ        |
| `pqBits`（nbits）                           | Select | 4 / 5 / 6 / 7 / 8                                               | 8                 | 仅 IVF_PQ        |
| `graphDegree`                               | 输入框 | 1 – 1024                                                        | 64                | 仅 CAGRA         |
| `intermediateDegree`                        | 输入框 | 1 – 2048                                                        | 128               | 仅 CAGRA         |

`GPU_BRUTE_FORCE` 无任何可调参数——选中后这一块整体收起。

各索引真正进公式的参数见 `GPU_INDEX_PARAM_KEYS`（`src/consts/sizingGpu.ts`）；不属于当前索引的参数会保留默认值但不参与计算，保证切换索引时表单形状稳定。

### C. 部署

| 字段                   | 控件     | 选项                 | 默认       |
| ---------------------- | -------- | -------------------- | ---------- |
| `segSize` Segment 大小 | Select   | 512 / 1024 / 2048 MB | 1024       |
| `mode` 部署形态        | 两张卡片 | Standalone / Cluster | Standalone |

### D. 校验规则

按 demo 的原始判定顺序，命中即中断并展示提示（对应 `GpuValidationErrorEnum`）：

1. `InvalidNumber` — 非有限数 / 负数，或 `num <= 0`、`d < 2`、`segSize <= 0`
2. `NlistOutOfRange` — IVF 系列 `nlist` 越界
3. `TrainFractionOutOfRange` — IVF 系列 `trainFraction` 不在 `(0, 1]`
4. `PqDimOutOfRange` — IVF_PQ 的 `pqDim` 不在 `[1, d]`（自动解析后）
5. `PqCodeNotByteAligned` — IVF_PQ 的 `pqDim × pqBits` 不是 8 的整数倍
6. `IntermediateDegreeTooSmall` — CAGRA 的 `intermediateDegree < graphDegree`

### E. 现有 CPU 工具有、但 GPU demo 没有的（待定）

- **mmap offloading 勾选框** —— demo 完全没有。标量卸载到磁盘对显存无影响，但会影响 host 内存
- **依赖组件选择（Pulsar / Kafka / Woodpecker）** —— demo 没有，因此也没有 etcd / MinIO / MQ 的配置输出
- **Standalone 自动降级逻辑** —— CPU 工具在 raw data 超过阈值时自动切 Cluster 并禁用 Standalone 卡片；demo 是纯手选

---

## 二、结果展示：三层结构

### 第 1 层：结论区（对应现有 "Approximate Capacity"）

| 展示项             | 字段            | 说明                                                                   |
| ------------------ | --------------- | ---------------------------------------------------------------------- |
| Raw Data Size      | `rawDataSize`   | 向量 + 标量原始大小                                                    |
| CPU Loading Memory | `memorySize`    | 沿用现有 FLAT 公式 `(向量原始 + 2 × 段大小) × 1.15 + 标量`             |
| **GPU Memory**     | `gpuMemorySize` | 主结论。附注：「当前上限由 {build / resident} 决定，再保留 1.5× 余量」 |

### 第 2 层：计算过程（对应 demo 的 Core calculation）

建议做成可折叠、默认展开——GPU 估算比 CPU 更需要向用户交代推导过程。

| 展示项              | 字段                                       | 示例渲染                                                                                                  |
| ------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| 单行字节            | 由 `d` 推                                  | `768 × 4 = 3,072 Bytes`                                                                                   |
| 单段行数            | `segmentRowCount`                          | `1024 MiB ÷ 3,072 = 349,525 vectors`                                                                      |
| 段数                | `segmentCount`                             | `ceil(1,000,000 ÷ 349,525) = 3`                                                                           |
| 生效索引参数        | `effectiveIndexParams`                     | 展示**钳制 / 自动解析后**的值：`nlist` 被 `min(nlist, 段行数)` 压过、`pqDim = 0` 被 cuVS 规则解析成实际值 |
| PQ 单向量编码字节   | `segmentIndexMemory.codeBytes`             | 仅 IVF_PQ：`ceil(m × pq_bits ÷ 8)`                                                                        |
| 单段索引公式 + 分项 | `segmentIndexMemory`                       | 分项 `dataset / norms / lists / centers / centerNorms / graph`，随索引类型不同                            |
| 单段索引数据量      | `segmentIndexMemory.total`                 |                                                                                                           |
| 构建临时显存        | `segmentBuildTemporaryMemory`              | IVF 是训练集，CAGRA 是中间图，BRUTE_FORCE 为 0                                                            |
| **Build 峰值**      | `buildMemorySize`                          | 单段索引 + 临时                                                                                           |
| **Resident 常驻**   | `residentMemorySize`                       | 单段索引 × 段数                                                                                           |
| 生命周期最大值      | `lifecycleMaxMemorySize` / `limitingStage` | 两者取大                                                                                                  |

单段索引数据公式（`gpuIndexMemoryCalculator`）：

| 索引              | 公式                                                               |
| ----------------- | ------------------------------------------------------------------ |
| `GPU_BRUTE_FORCE` | `N × D × 4 + N × 4`                                                |
| `GPU_IVF_FLAT`    | `N × (D × 4 + 8) + nlist × D × 4 + nlist × 4`                      |
| `GPU_IVF_PQ`      | `N × (ceil(pq_dim × pq_bits ÷ 8) + 8) + nlist × D × 4 + nlist × 4` |
| `GPU_CAGRA`       | `N × D × 4 + N × graph_degree × 4`                                 |

构建临时显存（`gpuBuildTemporaryMemoryCalculator`）：

| 索引              | 公式                                                                 |
| ----------------- | -------------------------------------------------------------------- |
| IVF_FLAT / IVF_PQ | `N_train × (D × 4 + 4)`，其中 `N_train = floor(N段 × trainFraction)` |
| CAGRA             | `N段 × intermediate_graph_degree × 4`                                |
| BRUTE_FORCE       | `0`                                                                  |

> **结构性事实（值得在 UI 上体现）**：Build 分支能否在多段场景胜出，取决于「临时量 vs 单段索引数据量」，而这**因索引而异**：
>
> | 索引              | 段数 ≥ 2 时 Build 能否胜出 | 原因                                                                                                 |
> | ----------------- | -------------------------- | ---------------------------------------------------------------------------------------------------- |
> | `GPU_BRUTE_FORCE` | 不能                       | 临时量恒为 0                                                                                         |
> | `GPU_IVF_FLAT`    | 不能                       | `临时量 = trainRows × (4d+4) ≤ N × (4d+4) < N × (4d+8) ≤ 索引数据量`                                 |
> | `GPU_IVF_PQ`      | **能**                     | 训练集是未压缩的 float32 向量，而索引数据是压缩后的 PQ code——`0.5 × (4d+4)` 轻易超过 `codeBytes + 8` |
> | `GPU_CAGRA`       | **能**                     | 当 `intermediate_graph_degree > (d + graph_degree) × (段数 − 1)` 时成立                              |
>
> 803 例对拍中实测：`ivfPq | build | 多段` 出现 49 次，`cagra | build | 多段` 出现 1 次，而 `bf` / `ivfFlat` 一次都没有。
>
> 所以 UI 提示不能写成「只有单段才可能 build 胜出」，应当直接以 `limitingStage` 为条件。

### 第 3 层：节点配置（对应现有 "Milvus Components"）

**Standalone** —— 一行：`standaloneNodeConfig` 的 `cpu / memory / count`，外加 `gpuMemory`（= 第 1 层的 GPU Memory 全量）。

**Cluster** —— 五行，每行 `CPU / 内存 / 数量`，其中两行带显存：

| 节点            | 显存                               | 备注                         |
| --------------- | ---------------------------------- | ---------------------------- |
| Query Node      | `residentMemorySize × 1.5 ÷ count` | 常驻分摊到每张卡             |
| Data Node       | `buildMemorySize × 1.5`            | 构建端峰值                   |
| Proxy           | —                                  |                              |
| Mix Coord       | —                                  |                              |
| **Stream Node** | —                                  | demo 新增，现有 CPU 工具没有 |

> ⚠️ 与现有 CPU 工具的节点表**不一致**：demo 去掉了 Index Node、加了 Stream Node，档位数值也自成一套。两套表是否统一需要确认。

---

## 三、现有工具有、GPU 侧目前空缺的

- **Setup overview（总 CPU / 总内存）** —— 可从节点配置聚合得到，另可加一行「总显存」
- **依赖组件（etcd / MinIO / Pulsar-Kafka）** —— demo 完全没算，Cluster 模式下这块是空的
- **安装命令 / helm & operator yaml 下载** —— GPU 版 yaml 需要带 GPU resource limit，现有生成器不支持

---

## 四、待决策项

1. **节点表**：沿用 demo 那套（去 Index Node、加 Stream Node），还是对齐现有 CPU 工具？
2. **依赖组件和安装引导**：GPU 页面是否保留？保留的话依赖组件算法需复用 CPU 侧。
3. **落地形态**：新开 `/tools/sizing-gpu` 页面，还是在现有 sizing 页面加 CPU / GPU 切换？

这三条确定后即可推进 `config.ts` + `formSection` + `resultSection`。

---

## 五、仍需向内核确认的算法问题

以下在两版材料中均无出处，代码里已提成具名常量，拿到答案后是一行改动：

| #   | 问题                                                                                                     |
| --- | -------------------------------------------------------------------------------------------------------- |
| A   | 峰值究竟是 `max(build, resident)`，还是 `resident + buildTemp × 并发度`？Standalone 下尤其存疑           |
| B   | Workspace Pool 的 1 GB 下限目前**完全没有计入**                                                          |
| C   | `T(n_queries)` 检索工作区按 0 处理，没有 topk / nprobe / 并发度入参                                      |
| D   | `GPU_MEMORY_SAFETY_FACTOR = 1.5` 无出处，且未覆盖 RMM 池非连续扩张导致的碎片化 OOM                       |
| E   | IVF-PQ 的 codebook 项在第一版 demo 中存在、第二版被删除，需确认是 per-subspace 还是 per-cluster          |
| F   | segment → GPU / 显卡的映射关系未定义；无显卡容量表，也无 `gpu.initMemSize` / `gpu.maxMemSize` 的配置建议 |
| G   | 节点档位表与 Stream Node 零出处，且与现网 CPU 工具存在分歧                                               |
| H   | 仅支持 float32；`segmentRowCount` 忽略标量字节；Vamana 未暴露故省略；host 与 GPU 双份常驻未经确认        |
