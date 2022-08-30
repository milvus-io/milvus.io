export const MANAGE_DATA = {
  collection: `
from pymilvus import CollectionSchema, FieldSchema, DataType, Collection
# Prepare Schema
book_id = FieldSchema(name="book_id", dtype=DataType.INT64, is_primary=True)
word_count = FieldSchema(name="word_count", dtype=DataType.INT64)
book_intro = FieldSchema(name="book_intro", dtype=DataType.FLOAT_VECTOR, dim=2)
schema = CollectionSchema(fields=[book_id, word_count, book_intro], description="Test book search")
collection_name = "book"
# Create a collection with the schema
collection = Collection(name=collection_name, schema=schema, using='default', shards_num=2)
`,

  index: `
from pymilvus import Collection

# Prepare index parameter
index_params = {"metric_type":"L2", "index_type":"IVF_FLAT", "params":{"nlist":1024}}
# Get an existing collection.
collection = Collection("book")
# Build Index with index params
collection.create_index(field_name="book_intro", index_params=index_params)
`,
  insert: `
import random
from pymilvus import Collection
# Parepare data
data = [
  [i for i in range(2000)],
  [i for i in range(10000, 12000)],
  [[random.random() for _ in range(2)] for _ in range(2000)],
]

# Get an existing collection.
collection = Collection("book")
mr = collection.insert(data)
`,
};

export const VECTOR_SEARCH = {
  vectorsearh: `
from pymilvus import Collection

# Get an existing collection.
collection = Collection("book")
# Vector search
search_params = {"metric_type": "L2", "params": {"nprobe": 10}}
results = collection.search(
  data=[[0.1, 0.2]],
  anns_field="book_intro", 
  param=search_params, 
  limit=10,
  expr=None
)
`,

  hybridsearch: `
from pymilvus import Collection

# Get an existing collection.
collection = Collection("book")
# Conduct a hybrid vector search
search_params = {"metric_type": "L2", "params": {"nprobe": 10}}
results = collection.search(
  data=[[0.1, 0.2]],
  anns_field="book_intro", 
  param=search_params, 
  limit=10,
  "expr": "word_count <= 11000", # specified field word_count value range
)
`,

  timetravel: `
from pymilvus import Collection

# Get an existing collection.
collection = Collection("book")
# Vector search with time travel
search_params = {"metric_type": "L2", "params": {"nprobe": 10}}
results = collection.search(
  data=[[0.1, 0.2]],
  anns_field="book_intro", 
  param=search_params, 
  limit=10,
  travel_timestamp: 428828271234252802, // Milvus hybrid timestamp
)
`,
};

export const INSTALL_MILVUS = {
  unbuntu: `
# Install via Launchpad PPA on Ubuntu
sudo apt install software-properties-common
sudo add-apt-repository ppa:milvusdb/milvus-standalone
sudo apt update
sudo apt install milvus
`,

  centos: `
# Install Milvus
sudo yum https://github.com/milvus-io/milvus/releases/download/v2.0.0-pre-ga/milvus-2.0.0-preGA.1.el7.x86_64.rpm

# Check Milvus status
sudo systemctl status milvus
sudo systemctl status milvus-etcd
sudo systemctl status milvus-minio
`,

  kubernetes: `
kubectl get sc
# Start a K8s cluster
minikube start
# Install Helm Chart for Milvus
helm repo add milvus https://milvus-io.github.io/milvus-helm/
helm repo update
# Configure and start Milvus
helm install my-release milvus/milvus --set cluster.enabled=false --set etcd.replicaCount=1 --set minio.mode=standalone --set pulsar.enabled=false
# Check the status of the running pods.
kubectl get pods
# Connect to Milvus
kubectl port-forward service/my-release-milvus 19530
`,
};
