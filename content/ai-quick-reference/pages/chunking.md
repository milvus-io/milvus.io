---
slug: "what-is-the-optimal-chunk-size-for-rag-applications"
title: "How do you choose chunk size for RAG?"
topic: "rag-agents"
order: 19
---

A good default for RAG chunking is a recursive, structure-aware split of about 256-512 tokens with 10-20% overlap (for a 512-token chunk, roughly 50-100 tokens). Go smaller, around 128-256 tokens, when users ask short factual questions; go larger, 512-1,024 tokens or a whole section, when answers need explanation or comparison. Then tune on your own questions: the "optimal" chunk size depends on your documents, your queries, your embedding model's input limit, and how much context the generator can afford.

## Why does chunk size matter so much?

Each chunk becomes one embedding, and one embedding can only represent so much. If a chunk is too large, a single relevant sentence is averaged together with paragraphs about other topics, and its vector drifts away from the question. If a chunk is too small, it loses the context that makes it meaningful: "This limit does not apply to enterprise plans" is useless without knowing which limit.

Chunk size also sets the cost of everything downstream. Smaller chunks mean more vectors to store and search; larger chunks mean more tokens in every prompt. With top-k = 5, moving from 256 to 1,024-token chunks raises context from about 1,300 to about 5,100 tokens per query before the question and instructions are added.

| | Smaller chunks (≈128-256 tokens) | Larger chunks (≈512-1,024+ tokens) |
| --- | --- | --- |
| Retrieval precision | Higher: the vector represents one idea | Lower: the idea is diluted |
| Context for the LLM | Thin; may need neighbors | Rich; fewer follow-up fetches |
| Index size | More vectors | Fewer vectors |
| Prompt tokens per top-k | Fewer | More |
| Good for | FAQs, definitions, lookups, support answers | Explanations, policies, research, multi-step reasoning |

## What are the main chunking strategies?

| Strategy | How it splits | Typical settings | Use it when |
| --- | --- | --- | --- |
| Fixed-size | Every N tokens or characters | 256-512 tokens, 10-20% overlap | Prototypes and uniform text; fast but cuts sentences |
| Recursive character | Tries separators in order (blank line, newline, sentence end, space) until pieces fit | 400-512 tokens, 50-100 overlap | The default for prose, docs, and articles |
| Sentence / paragraph | Groups whole sentences or paragraphs up to a budget | 3-8 sentences or one paragraph | Q&A content, transcripts, support conversations |
| Structure-aware | Splits on Markdown/HTML headings, PDF sections, pages, code functions | One section, capped at ~1,000 tokens | Manuals, contracts, wikis, code |
| Semantic | Embeds sentences and starts a new chunk where adjacent similarity drops | Breakpoint at a similarity percentile | Long unstructured text with topic shifts; costs an embedding per sentence |
| Parent-child (small-to-big) | Index small child chunks, return their larger parent | Child 100-300 tokens, parent 1,000-2,000 | You need precise matching and wide context |
| Contextual chunk headers | Prepend title, section path, or a generated summary to each chunk before embedding | 50-100 extra tokens | Chunks that are ambiguous out of context |
| Late chunking | Embed the whole document with a long-context model, then pool token embeddings per chunk | Requires a long-context, mean-pooling model | Chunks that refer back to earlier text ("it", "the above") |

Two of these deserve a closer look because they attack the context problem directly. Anthropic's contextual retrieval experiment prepended a 50-100 token, LLM-written context to each chunk and reported that failed retrievals (1 − recall@20) fell by 35% with contextual embeddings alone, 49% when combined with contextual BM25, and 67% once reranking was added. Late chunking, proposed by Günther et al., runs the full document through the embedding model first and only then splits the token embeddings into chunks, so each chunk vector carries information from its surroundings without extra LLM calls.

## How does the embedding model limit chunk size?

Every embedding model has a maximum input length, and text beyond it is truncated silently. Many popular sentence-transformer models accept 256 or 512 tokens; newer API and long-context models accept 8,192 tokens or more. Your chunk plus any prepended header must fit inside that limit, or the tail of the chunk simply never gets embedded. A long input limit is a ceiling, not a target: models still tend to produce sharper vectors for focused passages than for multi-page inputs.

Measure in the tokenizer of the embedding model, not in characters. One token is roughly four characters of English text, but code, tables, and non-Latin scripts tokenize very differently.

## How do you tune chunk size step by step?

1. **Collect 50-200 real questions** with the passages that answer them. Include short lookups, questions whose answers span a section boundary, table and code questions, and a few with no answer in the corpus. Building this set is covered in [how to build an evaluation set](/ai-quick-reference/how-to-build-search-and-agent-evaluation-datasets).
2. **Fix everything except chunking**: same embedding model, index, top-k, and reranker.
3. **Index two to four configurations**, for example recursive 256/32, recursive 512/64, section-aware capped at 1,024, and parent-child 200→1,500.
4. **Measure retrieval first**: recall@5 and recall@10 on the labeled passages, and MRR for rank quality. The definitions are in [how to evaluate retrieval quality](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved).
5. **Then measure the answer and the bill**: answer correctness or faithfulness, prompt tokens per query, and end-to-end latency.
6. **Break results down by document type.** A setting that wins on FAQs can lose on contracts. Pick per collection or per source type if the differences are large.
7. **Confirm once on a held-out split** that you did not tune against.

### Worked example

A team indexes 3,000 pages of product documentation and support articles. On 120 labeled questions:

| Configuration | Vectors | Recall@5 | Avg prompt tokens (k=5) |
| --- | --- | --- | --- |
| Fixed 1,024 / 0 | 9,800 | 0.71 | 5,200 |
| Recursive 512 / 64 | 21,500 | 0.82 | 2,700 |
| Recursive 256 / 32 | 44,000 | 0.84 | 1,400 |
| Child 200 → parent section | 51,000 | 0.86 | 3,900 |

The figures are illustrative, but the pattern is typical: small chunks find the right place, and the parent-child setup keeps that precision while handing the model whole sections. Here the team would choose recursive 256/32 for cost or parent-child for answer quality on how-to questions, depending on which they value more.

## What about overlap?

Overlap protects facts that straddle a boundary by repeating the last tokens of one chunk at the start of the next. 10-20% is a reasonable starting range. It is not free: storage grows by roughly chunk_size / (chunk_size − overlap), so 512/128 stores about 33% more text than 512/0, and adjacent overlapping chunks often both land in the top-k and repeat the same sentences in the prompt. Structure-aware splitting, parent-child retrieval, and contextual headers reduce the need for large overlaps; if you use them, try 0-10% and measure.

## How should chunks be stored in Milvus?

Treat a chunk as a derived record that always points back to its source. A practical schema:

- `chunk_id` (primary key), `doc_id`, `doc_version`, `chunk_index`
- `text` (VARCHAR), `section_path` such as "Billing > Refunds", `start_offset` / `end_offset` or page number
- `embedding` (dense vector), and optionally a BM25 sparse field generated from `text` for [hybrid search](/ai-quick-reference/what-is-hybrid-search-and-when-should-i-use-it)
- `parent_id` for small-to-big retrieval, plus filterable fields such as `tenant`, `language`, `source_type`
- a JSON field for loose metadata, filterable with expressions like `metadata["category"] == "billing"`

With `parent_id` stored, small-to-big retrieval is two calls: search the child chunks, then `query` the parents by ID. Grouping search with `group_by_field="doc_id"` prevents one long document from filling every result slot.

Changing the chunking strategy changes record boundaries, so plan for re-embedding. Keep `doc_id` and `doc_version` stable so you can delete a document's old chunks with a single filter (`doc_id == "..."`) before inserting the new ones, and so citations resolve to the correct revision. More on keeping indexes current is in [incremental updates in a vector database](/ai-quick-reference/how-do-you-handle-incremental-updates-in-a-vector-database).

## Bottom line

Start with recursive 256-512 tokens and 10-20% overlap, respect headings and tables, attach a section path to each chunk, and measure recall@k on your own questions before reaching for semantic or LLM-based chunking. To try it end to end, the [Build RAG with Milvus](https://milvus.io/docs/build-rag-with-milvus.md) tutorial gives a working pipeline you can swap chunkers into, and the [Milvus Bootcamp](https://milvus.io/bootcamp) has larger examples.

## Related reading

- [What is retrieval-augmented generation (RAG)?](/ai-quick-reference/what-is-rag-retrievalaugmented-generation-in-nlp)
- [What is late-interaction retrieval, and how can embedding lists help?](/ai-quick-reference/what-is-late-interaction-retrieval)
- [How do you choose an embedding model for retrieval?](/ai-quick-reference/what-factors-should-be-considered-when-selecting-an-embedding-model-for-a-rag-pipeline-such-as-the-models-domain-training-data-embedding-dimensionality-and-semantic-accuracy)
- [How can vector search improve codebase retrieval for coding agents?](/ai-quick-reference/vector-search-for-coding-agents)
- [How do you evaluate retrieval quality?](/ai-quick-reference/how-can-we-measure-the-accuracy-of-the-retrieval-component-in-a-rag-system-for-example-using-metrics-like-precisionk-and-recallk-on-the-documents-retrieved)

## Sources

- [Günther et al., Late Chunking: Contextual Chunk Embeddings Using Long-Context Embedding Models](https://arxiv.org/abs/2409.04701)
- [Anthropic, Introducing Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval)
- [RAG tutorial with Milvus](https://milvus.io/docs/build-rag-with-milvus.md)
- [Ingestion and chunking guidance](https://milvus.io/docs/rag_pipeline.md)
- [Grouping search in Milvus](https://milvus.io/docs/grouping-search.md)
- [JSON fields in Milvus](https://milvus.io/docs/use-json-fields.md)
