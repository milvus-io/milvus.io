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

export type CategoryId = 'agent' | 'model' | 'rag' | 'data' | 'eval';

// Milvus docs host — each href resolves to the tutorial for that
// integration, per src/docs/v2.6.x/site/en/integrations/integrations_overview.md.
const DOC = 'https://milvus.io/docs';

export const CATEGORIES: { id: CategoryId; logos: Logo[] }[] = [
  {
    id: 'agent',
    logos: [
      {
        name: 'MemGPT',
        logo: '/images/home/mem-gpt.png',
        href: MILVUS_INTEGRATION_MEMGPT_LINK,
      },
      {
        name: 'Mem0',
        logo: '/images/home2/logos/mem0.svg',
        href: `${DOC}/quickstart_mem0_with_milvus.md`,
      },
      {
        name: 'MCP',
        logo: '/images/home2/logos/mcp.svg',
        href: `${DOC}/milvus_and_mcp.md`,
      },
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
      {
        name: 'Cohere',
        logo: '/images/home/cohere.png',
        href: `${DOC}/integrate_with_cohere.md`,
      },
      {
        name: 'Gemini',
        logo: '/images/home2/logos/googlegemini.svg',
        href: `${DOC}/build_RAG_with_milvus_and_gemini.md`,
      },
      {
        name: 'Ollama',
        logo: '/images/home2/logos/ollama.svg',
        href: `${DOC}/build_RAG_with_milvus_and_ollama.md`,
      },
      {
        name: 'DeepSeek',
        logo: '/images/home2/logos/deepseek.svg',
        href: `${DOC}/build_RAG_with_milvus_and_deepseek.md`,
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
      {
        name: 'Dify',
        logo: '/images/home2/logos/dify.svg',
        href: `${DOC}/dify_with_milvus.md`,
      },
      {
        name: 'Langflow',
        logo: '/images/home2/logos/langflow.svg',
        href: `${DOC}/rag_with_langflow.md`,
      },
      {
        name: 'BentoML',
        logo: '/images/home2/logos/bentoml.svg',
        href: `${DOC}/integrate_with_bentoml.md`,
      },
      {
        name: 'n8n',
        logo: '/images/home2/logos/n8n.svg',
        href: `${DOC}/milvus_and_n8n.md`,
      },
    ],
  },
  {
    id: 'data',
    logos: [
      {
        name: 'Airbyte',
        logo: '/images/home2/logos/airbyte.svg',
        href: `${DOC}/integrate_with_airbyte.md`,
      },
      {
        name: 'Apache Kafka',
        logo: '/images/home2/logos/apachekafka.svg',
        href: `${DOC}/kafka-connect-milvus.md`,
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
      {
        name: 'Langfuse',
        logo: '/images/home2/logos/langfuse.svg',
        href: `${DOC}/integrate_with_langfuse.md`,
      },
    ],
  },
];
