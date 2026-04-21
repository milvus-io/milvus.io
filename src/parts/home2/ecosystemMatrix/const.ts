import {
  MILVUS_INTEGRATION_LANGCHAIN_LINK,
  MILVUS_INTEGRATION_DSPY_LINK,
  MILVUS_INTEGRATION_HAYSTACK_LINK,
  MILVUS_INTEGRATION_HUGGING_FACE_LINK,
  MILVUS_INTEGRATION_LLAMA_INDEX_LINK,
  MILVUS_INTEGRATION_MEMGPT_LINK,
  MILVUS_INTEGRATION_OPENAI_LINK,
  MILVUS_INTEGRATION_RAGAS_LINK,
} from '@/consts/links';

export type Logo = { name: string; logo: string; href: string };

export type CategoryId = 'agent' | 'model' | 'rag' | 'eval';

export const CATEGORIES: { id: CategoryId; logos: Logo[] }[] = [
  {
    id: 'agent',
    logos: [
      {
        name: 'MemGPT',
        logo: '/images/home/mem-gpt.png',
        href: MILVUS_INTEGRATION_MEMGPT_LINK,
      },
      // ⚠️ Gap: add LangGraph, CrewAI, AutoGen, Mastra, Pydantic AI before public launch (spec §11).
    ],
  },
  {
    id: 'model',
    logos: [
      {
        name: 'OpenAI',
        logo: '/images/home/open-ai.png',
        href: MILVUS_INTEGRATION_OPENAI_LINK,
      },
      {
        name: 'Hugging Face',
        logo: '/images/home/hugging-face.png',
        href: MILVUS_INTEGRATION_HUGGING_FACE_LINK,
      },
    ],
  },
  {
    id: 'rag',
    logos: [
      {
        name: 'LangChain',
        logo: '/images/home/lang-chain.png',
        href: MILVUS_INTEGRATION_LANGCHAIN_LINK,
      },
      {
        name: 'LlamaIndex',
        logo: '/images/home/llama-index.png',
        href: MILVUS_INTEGRATION_LLAMA_INDEX_LINK,
      },
      {
        name: 'Haystack',
        logo: '/images/home/hay-stack.png',
        href: MILVUS_INTEGRATION_HAYSTACK_LINK,
      },
      {
        name: 'DSPy',
        logo: '/images/home/dspy.png',
        href: MILVUS_INTEGRATION_DSPY_LINK,
      },
    ],
  },
  {
    id: 'eval',
    logos: [
      {
        name: 'Ragas',
        logo: '/images/home/ragas.png',
        href: MILVUS_INTEGRATION_RAGAS_LINK,
      },
    ],
  },
];
