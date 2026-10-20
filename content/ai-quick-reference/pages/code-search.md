---
slug: "vector-search-for-coding-agents"
title: "How can vector search improve codebase retrieval for coding agents?"
topic: "applications"
order: 95
---

Vector search lets a coding agent find code by what it does rather than by what it is called. The repository is split into functions and classes, each unit is embedded with a code-aware model, and a natural-language request such as "where do we retry failed payments?" is matched against those vectors. In practice the best results come from combining that semantic signal with lexical search for exact identifiers, metadata filters for repository and revision, and an agent that still opens the files and checks callers before it edits anything.

## Why is code harder to search than ordinary text?

Source code mixes two kinds of meaning. One is exact: a function named `charge_with_backoff`, an error string like `ECONNRESET`, a config key, a file path. The other is conceptual: "the place where we throttle outbound requests" might live in a class called `RateGate` that never mentions throttling. Grep and keyword search are excellent at the first kind and blind to the second. Embedding search is the reverse: it connects intent to implementation, but it can blur two functions with nearly identical names, and a model trained on public code may not understand an organization's internal vocabulary.

That is why production coding tools treat semantic search as an additional tool, not a replacement for grep. Cursor reported that adding semantic search alongside grep raised its agent's question-answering accuracy by 12.5% on average (6.5% to 23.5% depending on the model), and that the combination beat either tool alone. Codebase size is the key variable: in a small repository an agent can grep its way to the answer cheaply, while in a monorepo, conceptual queries burn many tool calls and context tokens without an index.

## What does an end-to-end code search pipeline look like?

| Stage | What it does | Common choices |
| --- | --- | --- |
| Parse and chunk | Split files into functions, methods, classes, and top-level blocks | Tree-sitter grammars per language; fall back to line windows for unparsed files |
| Enrich | Attach repo, branch, commit, path, language, symbol name, line range, and sometimes a docstring or generated summary | Stored as scalar fields beside the vectors |
| Embed | Turn each chunk (and later each query) into a dense vector | A code-trained embedding model; the same model for both sides |
| Lexical index | Make identifiers, error messages, and literals matchable | BM25 over the chunk text |
| Retrieve | Run dense and lexical searches with the same filters, then fuse | Reciprocal Rank Fusion or weighted fusion |
| Rerank | Re-score the top 50-100 candidates against the query | A cross-encoder or LLM reranker |
| Act | The agent opens the files, follows references, runs tests | Editor tools, LSP, grep, version control |
| Refresh | Re-index only what changed on each commit or file save | Content hashes, Merkle trees, upsert and delete by path |

The rest of this page walks through the decisions that matter at each stage.

## How should you chunk source code?

Chunk along syntax, not character counts. A fixed 512-token window will happily cut a function in half, glue the tail of one method to the head of the next, or separate a guard clause from the code it protects. Parsing with an abstract syntax tree (AST) lets you emit one chunk per function or method, split oversized nodes recursively, and merge tiny siblings such as a run of constants until a chunk reaches a useful size. The cAST paper measured this on public benchmarks: AST-based chunking improved Recall@5 by 4.3 points on RepoEval retrieval and Pass@1 by 2.67 points on SWE-bench generation compared with line-based chunking.

Three refinements help agents in particular:

- **Carry context into the chunk.** Prepend the file path, the enclosing class name, and the signature so that a method body like `return self._client.post(...)` is still interpretable on its own.
- **Index more than code.** READMEs, ADRs, OpenAPI specs, and commit messages often describe intent in plain language and are the bridge between a vague question and the right module. See [how to choose chunk size for RAG](/ai-quick-reference/what-is-the-optimal-chunk-size-for-rag-applications) for prose documents.
- **Skip noise.** Exclude generated files, lockfiles, minified bundles, and vendored dependencies, or tag them so they can be filtered out. Otherwise a third-party copy of a retry helper can outrank your own.

## Which embedding model should you use for code?

Use a model trained on code and natural-language pairs rather than a general text model; code-specific models handle identifiers, syntax, and docstring-to-function matching far better. Embed queries and chunks with the same model and version, and plan a full re-embed when you upgrade, since vectors from different models are not comparable. Evaluate candidates on your own repositories: leaderboards measure public code, and internal naming conventions are exactly where models diverge. The [embedding model selection guide](/ai-quick-reference/what-factors-should-be-considered-when-selecting-an-embedding-model-for-a-rag-pipeline-such-as-the-models-domain-training-data-embedding-dimensionality-and-semantic-accuracy) and the [current model catalog](/ai-quick-reference/embedding-reranking-model-catalog) cover the trade-offs.

## How do you combine semantic and keyword search in Milvus?

Milvus can hold the dense code vector and a BM25 index over the same chunk in one collection, so a single [hybrid search](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it) query covers both "what does this do" and "where is this exact name". The BM25 side uses a built-in function: you insert raw text into a `VARCHAR` field with `enable_analyzer=True`, and Milvus generates a `SPARSE_FLOAT_VECTOR` for it, indexed with `SPARSE_INVERTED_INDEX` and the `BM25` metric. Repository and revision become scalar fields, and a partition key on `repo` keeps each repository's data physically grouped.

```python
from pymilvus import (MilvusClient, DataType, Function, FunctionType,
                      AnnSearchRequest, RRFRanker)

client = MilvusClient(uri="http://localhost:19530")

schema = MilvusClient.create_schema(auto_id=False)
schema.add_field("chunk_id", DataType.VARCHAR, is_primary=True, max_length=64)
schema.add_field("repo", DataType.VARCHAR, max_length=256, is_partition_key=True)
schema.add_field("commit", DataType.VARCHAR, max_length=64)
schema.add_field("path", DataType.VARCHAR, max_length=1024)
schema.add_field("language", DataType.VARCHAR, max_length=32)
schema.add_field("symbol", DataType.VARCHAR, max_length=512)
schema.add_field("start_line", DataType.INT64)
schema.add_field("end_line", DataType.INT64)
schema.add_field("code", DataType.VARCHAR, max_length=65535, enable_analyzer=True)
schema.add_field("dense", DataType.FLOAT_VECTOR, dim=1024)
schema.add_field("sparse", DataType.SPARSE_FLOAT_VECTOR)
schema.add_function(Function(
    name="code_bm25",
    function_type=FunctionType.BM25,
    input_field_names=["code"],
    output_field_names=["sparse"],
))

index_params = client.prepare_index_params()
index_params.add_index(field_name="dense", index_type="HNSW", metric_type="COSINE")
index_params.add_index(field_name="sparse", index_type="SPARSE_INVERTED_INDEX",
                       metric_type="BM25")
client.create_collection("code_chunks", schema=schema, index_params=index_params)
```

At query time, run both searches under the same filter and fuse them:

```python
flt = 'repo == "payments" and language == "python" and not (path like "vendor/%")'

dense_req = AnnSearchRequest(data=[embed("retry failed card charges with backoff")],
                             anns_field="dense", param={}, limit=50, expr=flt)
sparse_req = AnnSearchRequest(data=["retry charge backoff 503"],
                              anns_field="sparse", param={}, limit=50, expr=flt)

hits = client.hybrid_search(
    "code_chunks", reqs=[dense_req, sparse_req], ranker=RRFRanker(60), limit=10,
    output_fields=["path", "symbol", "start_line", "end_line", "commit"],
)
```

`RRFRanker` scores each chunk as the sum of `1/(k + rank)` across the result lists (default `k` is 60), which works well when dense and BM25 scores live on different scales. `WeightedRanker` is the alternative when you want to lean deliberately toward one signal, for example toward BM25 for queries that look like identifiers. One practical detail: analyzers tokenize prose well, but identifiers such as `getUserById` or `retry_count` may reach the index as single tokens. Storing an extra text field with identifiers split into words (`get user by id`) gives BM25 a better chance at partial-name queries. For background on the sparse side, see [full-text search and BM25](/ai-quick-reference/what-is-fulltext-search).

## Why do metadata filters matter so much for code?

A semantically perfect match from the wrong branch is a wrong answer. Coding agents almost always know the repository and revision they are working on, so every search should be constrained by it. Useful fields include `repo`, `branch` or `commit`, `path`, `language`, `symbol_kind`, and `is_test` or `is_generated` flags. Filters also let the agent ask narrow follow-ups, such as "only tests under `services/billing/`", instead of retrieving broadly and discarding results in the prompt. When many repositories or tenants share a cluster, a partition key on that field keeps searches scoped; the [metadata filtering guide](/ai-quick-reference/how-does-applying-boolean-filters-or-metadatabased-prefiltering-alongside-vector-similarity-search-influence-the-overall-query-performance) explains how filters interact with ANN search performance.

## Should you rerank code search results?

Usually yes, if latency allows. Fusion produces a decent candidate list, but a cross-encoder or small LLM that reads the query and each candidate together is much better at telling the function that implements retries apart from the one that merely logs them. Rerank the top 50 to 100 fused candidates and pass 5 to 10 to the agent. For the trade-offs, see [when to apply vector reranking](/ai-quick-reference/what-is-vector-reranking-and-when-should-you-apply-it).

## How do you keep the index fresh as code changes?

Freshness is the most common complaint about code indexes: grep always reflects the working tree, while an index reflects the last sync. Make updates incremental and cheap:

- **Derive chunk IDs from content.** A hash of path plus normalized chunk text means unchanged chunks keep their IDs and embeddings, and only edited functions need new vectors.
- **Detect changes at the file level.** Compare file hashes against the last indexed state, or use a Merkle tree over the directory so unchanged subtrees are skipped entirely. Git diffs between the indexed commit and `HEAD` work too.
- **Retire what disappeared.** When a file is deleted or moved, delete its chunks with a filter such as `path == "old/location.py"` before inserting the new ones. Stale chunks pointing at deleted lines mislead agents more than missing chunks do.
- **Use upsert for metadata changes.** Milvus `upsert` replaces an entity with the same primary key, and with `partial_update=True` it can update only some fields, such as a new `commit` value or shifted line numbers, without re-sending the vector.

The guide on [incremental updates in a vector database](/ai-quick-reference/how-do-you-handle-incremental-updates-in-a-vector-database) covers delete, upsert, and compaction behavior in more depth.

## How do you evaluate code retrieval for agents?

Build a small, honest test set from your own repositories rather than relying on public benchmarks alone. Mix four kinds of query: behavior discovery ("where are webhooks verified?"), exact lookup (a function or error string), cross-file impact ("what calls the ledger writer?"), and real past bug investigations where you know which files were changed in the fix. Measure recall@k against the known-relevant chunks, then measure what actually matters downstream: does the agent finish the task correctly, with fewer tool calls and tokens? Cursor built its evaluation this way, comparing agent outcomes with and without semantic search on a benchmark with known answers.

Also test the failure modes: renamed and moved files, deleted functions, mixed-language repositories, and queries whose best answer lives on another branch. The [evaluation dataset guide](/ai-quick-reference/how-to-build-search-and-agent-evaluation-datasets) shows how to structure such a set.

## A worked example: tracing retry behavior

An engineer asks why some card charges are retried three times. The agent sends a hybrid query filtered to `repo == "payments"` on the current commit. The dense side surfaces `ChargeExecutor.run`, which wraps the processor call in a backoff loop without ever saying "retry"; the BM25 side surfaces `MAX_CHARGE_ATTEMPTS = 3` in a settings module. A similar helper in a vendored SDK is excluded by the path filter, and a stale branch never appears because the commit is constrained. The agent then opens both files, finds every caller through language-server references, and confirms the behavior with the unit test before proposing a change. Vector search narrowed thousands of files to two; exact navigation and tests established the answer.

## Is there a ready-made implementation?

[Claude Context](https://github.com/zilliztech/claude-context) is an open-source MCP server that applies this architecture to coding agents such as Claude Code. It chunks code by AST with a fallback splitter, runs hybrid BM25 plus dense search on Milvus or Zilliz Cloud, re-indexes only changed files using Merkle trees, and exposes tools such as `index_codebase` and `search_code`. Its README reports roughly 40% token reduction at comparable retrieval quality. Check the current project version for supported embedding providers and options. For the broader picture of how agents decide when to search, see [what agentic search is](/ai-quick-reference/what-is-agentic-search) and [how agents choose between vector, keyword, and structured search](/ai-quick-reference/how-agents-choose-retrieval-tools).

## Next steps

To try the pattern, start with the [Milvus Quickstart](https://milvus.io/docs/quickstart.md), then follow the [full-text search](https://milvus.io/docs/full-text-search.md) and [hybrid search](https://milvus.io/docs/multi-vector-search.md) guides to add BM25 next to your code embeddings. If you would rather not operate the cluster, [Zilliz Cloud](https://zilliz.com/cloud) runs the same APIs as a managed service.

## Sources and further reading

- [cAST: Structural chunking via abstract syntax trees for code RAG (arXiv)](https://arxiv.org/abs/2506.15655)
- [Claude Context: code indexing and hybrid search with Milvus](https://github.com/zilliztech/claude-context)
- [Milvus: full-text search with BM25](https://milvus.io/docs/full-text-search.md)
- [Milvus: multi-vector hybrid search](https://milvus.io/docs/multi-vector-search.md)
- [Milvus: RRF ranker](https://milvus.io/docs/rrf-ranker.md)
- [Milvus: filtered search](https://milvus.io/docs/filtered-search.md)
- [Milvus: partition key](https://milvus.io/docs/use-partition-key.md)
- [Milvus: upsert entities](https://milvus.io/docs/upsert-entities.md)
