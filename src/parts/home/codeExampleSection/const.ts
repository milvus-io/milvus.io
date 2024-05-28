export const CODE_CREATE_COLLECTION = `from pymilvus import MilvusClient
client = MilvusClient("milvus_demo.db")
client.create_collection(
  collection_name="demo_collection",
  dimension=5
)`;

export const CODE_INSERT_DATA = `res = client.insert(
  collection_name="demo_collection",
  data=[
    {"id": 0, "vector": [0.1, 0.2, 0.3, 0.2, 0.1], "text": "AI was proposed in 1956.", "subject": "history"},
    {"id": 1, "vector": [0.1, 0.2, 0.3, 0.2, 0.1], "text": "Alan Turing was born in London.", "subject": "history"},
    {"id": 2, "vector": [0.1, 0.2, 0.3, 0.2, 0.1], "text": "Computational synthesis with AI algorithms predicts molecular properties.", "subject": "biology"},
  ]
)`;

export const CODE_SEARCH = `res = client.search(
  collection_name="demo_collection",
  data=[[0.1, 0.2, 0.3, 0.2, 0.1]],
  filter="subject == 'history'",
  limit=2,
  output_fields=["text", "subject"],
)`;

export const CODE_DELETE_COLLECTION = `res = client.delete(
  collection_name="demo_collection",
  ids=[0,2]
)`;
