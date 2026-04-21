// ⚠️ All code snippets below are marked `needs verification` in the spec.
// All snippets use uri="http://localhost:19530" — do NOT use Milvus Lite.

export const CODE_ADD_MEMORY = `from pymilvus import MilvusClient

client = MilvusClient(uri="http://localhost:19530")

client.create_collection(
    "agent_memory",
    dimension=1536,
    auto_id=True,
    vector_field_name="text_vec",
    enable_dynamic_field=True,
)

client.insert("agent_memory", [
    {"user_id": "u_123", "text": "User prefers dark mode", "ts": 1734567890},
    {"user_id": "u_123", "text": "User is learning Rust",  "ts": 1734567891},
])`;

export const CODE_SEMANTIC_RECALL = `results = client.search(
    "agent_memory",
    data=["What are the user's UI preferences?"],
    limit=5,
    filter='user_id == "u_123"',
    output_fields=["text", "ts"],
)

for hit in results[0]:
    print(hit["entity"]["text"], hit["distance"])`;

export const CODE_MULTI_TENANT = `client.create_collection(
    "agent_memory",
    dimension=1536,
    partition_key_field="user_id",
    num_partitions=64,
)`;

export const CODE_MCP_SERVER = `# Launch Milvus as an MCP server (one command)
uvx mcp-server-milvus --uri http://localhost:19530

# Claude Desktop, Cursor, LangGraph, CrewAI — all connect directly`;
