// ⚠️ All code snippets below are marked `needs verification` in the spec.
// Do not modify without updating the spec first.

export type Pillar = {
  id: 'hybrid' | 'embeddings' | 'memory' | 'mcp';
  code: string;
  language: 'python' | 'bash';
  learnMoreHref: string;
};

export const PILLARS: Pillar[] = [
  {
    id: 'hybrid',
    language: 'python',
    learnMoreHref: '/docs/multi-vector-search.md', // ⚠️ verify
    code: `client.hybrid_search(
    "docs",
    [AnnSearchRequest(dense_vec, ...),
     AnnSearchRequest(sparse_vec, ...)],
    rerank=RRFRanker(),
)`,
  },
  {
    id: 'embeddings',
    language: 'python',
    learnMoreHref: '/docs/embedding-function-overview.md', // ⚠️ verify
    code: `schema.add_function(Function(
    name="embed",
    input_field_names=["text"],
    function_type=FunctionType.TEXT_EMBEDDING,
    params={"provider": "openai",
            "model": "text-embedding-3-small"},
))`,
  },
  {
    id: 'memory',
    language: 'python',
    learnMoreHref: '/docs/partition-key.md', // ⚠️ verify (agent memory guide may not exist yet)
    code: `client.insert("agent_memory",
    {"user_id": "u_123", "text": "...", "ts": now()})

client.search("agent_memory", queries=[...],
    filter='user_id == "u_123"')`,
  },
  {
    id: 'mcp',
    language: 'bash',
    learnMoreHref: 'https://github.com/zilliztech/mcp-server-milvus', // ⚠️ verify URL
    code: `uvx mcp-server-milvus --uri http://localhost:19530`,
  },
];
