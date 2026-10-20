---
slug: "tencent-r3-models"
title: "How do Tencent R3 embedding and reranking models retrieve agent skills?"
topic: "models"
order: 127
---

Tencent R3-Skill provides a query-conditional skill-retrieval task and a two-stage retrieval system. R3-Embedding-0.6B independently encodes requests and skills for candidate selection. R3-rerank-0.6b scores request/skill pairs to refine that shortlist. These released models are specialized agent-skill candidates, not evidence of universal superiority on ordinary document question answering.

## Represent a skill as an executable choice

Store a stable skill ID, description, input contract, relevant constraints, version, and source location. The embedding stage can identify promising skills from a large catalog. The reranker then inspects the candidate text with the actual request, helping distinguish a skill that merely mentions the right terms from one appropriate for the task.

For a Milvus-backed catalog, retain the original ID through both stages and apply mandatory organization or permission filters before sending candidates onward. Retrieval selects possibilities; it does not authorize executing a tool or resolve whether the tool's side effects are appropriate.

## Respect the published input format

The official project has specific query/skill serialization and truncation behavior. Pin the model and preprocessing together. Test a request whose correct choice changes because of a constraint, not just a keyword match. Keep skill updates synchronized with the embedding and any cached ranking inputs.

## Keep attribution and support precise

This is an official Tencent release. It should not be assigned to a specific Tencent sub-team or combined with WeMM merely because both are hosted under Tencent. Milvus Model 0.3.4 has no dedicated R3 export. Use the official implementation or a verified adapter and measure recall, constraint satisfaction, reranking cost, and abstention when no skill fits.

## Continue learning

- [What is agentic search, and where does a vector database fit?](/ai-quick-reference/what-is-agentic-search)
- [How should an agent choose between vector, keyword, and structured search?](/ai-quick-reference/how-agents-choose-retrieval-tools)
- [Which reranking models fit a Milvus retrieval pipeline?](/ai-quick-reference/reranking-model-catalog)
- [What does the released Milvus Model library actually support?](/ai-quick-reference/milvus-model-library-support)

## Implementation guides and sources

- [Tencent R3-Skill implementation](https://github.com/Tencent/R3-Skill)
- [Official model card: tencent/R3-embedding-0.6b](https://huggingface.co/tencent/R3-embedding-0.6b)
- [Official model card: tencent/R3-rerank-0.6b](https://huggingface.co/tencent/R3-rerank-0.6b)

Sources checked: 2026-10-20. Benchmark and package support claims are versioned snapshots; inference was not run for this documentation review.
