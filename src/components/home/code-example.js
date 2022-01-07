export const ManageVectorCodes = {
  python: `
from pymilvus import Collection, CollectionSchema

# create a collection
collection = Collection("book")
CollectionSchema(
  fields=[book_id, word_count, book_intro], 
  description="Test book search"
)

# insert data
mr = collection.insert(data)
`,

  javascript: `
const data = Array.from({ length: 2000 }, (v,k) => ({
  "book_id": k,
  "word_count": k+10000,
  "book_intro": Array.from({ length: 2 }, () => Math.random()),
}));

const mr = await milvusClient.dataManager.insert({{
  collection_name: "book",
  fields_data: data,
});
`,

  cli: `
# Prepare your data in a CSV file. Milvus CLI only supports importing data from local or remote files.

import -c book 'https://raw.githubusercontent.com/milvus-io/milvus_cli/main/examples/user_guide/search.csv'

`,
};

export const SearchCodes = {
  python: `
#search
search_params = {"metric_type": "L2", "params": {"nprobe": 10}}
results = collection.search(
  data=[[0.1, 0.2]],
  anns_field="book_intro", 
  param=search_params, 
  limit=10,
  expr=None
)

`,

  javascript: `
const searchParams = {
  anns_field: "book_intro",
  topk: "10",
  metric_type: "L2",
  params: JSON.stringify({ nprobe: 10 }),
};

const results = await milvusClient.dataManager.search({
  collection_name: "book",
  expr: "",
  vectors: [[0.1, 0.2]],
  search_params: searchParams,
  vector_type: 101,    // DataType.FloatVector
});

`,

  cli: `
search

Collection name (book): book

The vectors of search data(the length of data is number of query (nq), the dim of every vector in data must be equal to vector field’s of collection. You can also import a csv file without headers): [[0.1, 0.2]]

The vector field used to search of collection (book_intro): book_intro

Metric type: L2

Search parameter nprobe's value: 10

The max number of returned record, also known as topk: 10


`,
};

export const IndexCodes = {
  python: `
from pymilvus import Collection
collection = Collection("book")      # Get an existing collection.

index_params = {
    "metric_type":"L2",
    "index_type":"IVF_FLAT",
    "params":{"nlist":1024}
}

collection.create_index(
  field_name="book_intro", 
  index_params=index_params
)

`,

  javascript: `
const index_params = {
  metric_type: "L2",
  index_type: "IVF_FLAT",
  params: JSON.stringify({ nlist: 1024 }),
};

await milvusClient.indexManager.createIndex({
  collection_name: "book",
  field_name: "book_intro",
  extra_params: index_params,
});

`,

  cli: `
create index

Collection name (book): book

The name of the field to create an index for (book_intro): book_intro

Index type (FLAT, IVF_FLAT, IVF_SQ8, IVF_PQ, RNSG, HNSW, ANNOY): IVF_FLAT

Index metric type (L2, IP, HAMMING, TANIMOTO): L2

Index params nlist: 1024

Timeout []:

`,
};
