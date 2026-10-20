---
slug: "how-to-score-data-quality-for-curation"
title: "How should you design a quality score for data curation?"
topic: "data"
order: 92
---

A quality score estimates whether a record is useful for a specified downstream task. It can combine deterministic checks, heuristics, classifiers, or reviewed model judgments. Its meaning comes from the rubric and validation data, not from the fact that it is a number between zero and one.

## Separate independent criteria

For a training document, useful dimensions might include parseability, language confidence, repetition, source eligibility, and domain relevance. For an agent trajectory, tool success, final outcome, and instruction compliance can differ. Preserve separate scores when one aggregate would hide a critical failure.

Treat mandatory eligibility as an explicit rule. A high fluency score should not compensate for an unusable license or an invalid source mapping. Likewise, short code or formula-heavy documents can be valuable despite failing a generic prose heuristic.

## Calibrate against reviewed examples

Create labeled examples covering the intended domains and known failure cases. Measure disagreement and false rejection across languages, formats, and rare groups. A classifier or model judge can reflect its own training distribution and should be checked on the data it will actually score.

Keep rubric, model, prompt, threshold, and processing revisions with the output. Save the component scores and reasons needed to inspect a decision. If the rubric changes, version the new results rather than overwriting the only explanation of an earlier dataset release.

## Judge the policy by its consequence

Run the selection in observation mode first. Review accepted and rejected samples, then compare a curated dataset with a baseline under a matched downstream evaluation. Track coverage, false removals, labeling effort, and training or retrieval quality alongside dataset reduction.

Use vector search to discover clusters with unexpectedly high rejection or low-quality labels. Inspect source evidence before propagating a score across similar records. A reliable quality policy makes its assumptions and errors visible and improves the intended task without quietly removing important variation.

## Continue learning

- [What is data curation, and how can vector search help?](/ai-quick-reference/what-is-data-curation-for-vector-ai)
- [How can vector search help choose examples for human labeling?](/ai-quick-reference/how-vector-search-supports-active-learning)
- [How can embeddings improve dataset diversity sampling?](/ai-quick-reference/how-to-sample-diverse-data-with-embeddings)
- [How can vector retrieval support pretraining data preparation?](/ai-quick-reference/how-vector-search-supports-pretraining-data-preparation)

## Implementation guides and sources

- [Quality assessment and filtering](https://docs.nvidia.com/nemo/curator/latest/curate-text/process-data/quality-assessment)
- [Heuristic filtering examples](https://docs.nvidia.com/nemo/curator/latest/curate-text/process-data/quality-assessment/heuristic)
- [Keep reviewable score metadata](https://milvus.io/docs/schema.md)

Sources checked: 2026-10-20. Use the implementation guide for your deployed version.
