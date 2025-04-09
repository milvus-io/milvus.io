export interface OriginalFAQDetailType {
  Order: number;
  Questions: string;
  Answers: string;
  URL: string;
  Meta_title: string;
  Demo?: string;
  Demo_description?: string;
}

export interface FAQDetailType {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  canonical_rel: string;
  curIndex?: number;
  demo?: DemoTypeEnum;
  demoDescription?: string;
}

export enum DemoTypeEnum {
  HybridSearch = 'hybrid search',
  imageSearch = 'multimodal image search',
  Rag = 'RAG',
}
