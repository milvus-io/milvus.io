export interface OriginalLearnAiType {
  id: string;
  title: string;
  content: string;
  meta_keywords?: string;
}

export interface LearnAiDetailType {
  id: string;
  title: string;
  content: string;
  description: string;
  url: string;
  canonical_rel: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  curIndex?: number;
}
