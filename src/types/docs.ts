import { LanguageEnum } from '@/components/language-selector';
import { BlogFrontMatterType } from './blogs';

export interface DocFrontMatterType {
  id: string;
  title: string;
  summary: string;
  group?: string;
  label?: string;
  related_key?: string;
  order?: number;
  deprecate?: boolean;
}

export interface DocFileDataInfoType {
  frontMatter: DocFrontMatterType;
  content: string;
  editPath: string;
  propsInfo: object;
}

export interface DocVersionInfoType {
  version: string;
  data: DocFileDataInfoType[];
}

export interface AllMdVersionIdType {
  version: string;
  mds: string[];
}

export interface OriginMenuStructureType {
  id: string;
  title: string;
  label1: string;
  label2: string;
  label3: string;
  order?: number;
  isMenu?: boolean;
  outLink?: string;
}

export interface FinalMenuStructureType {
  label: string;
  id: string;
  isMenu: boolean;
  externalLink: string;
  href: string;
  parentId: string;
  parentIds: string[];
  level: number;
  children: FinalMenuStructureType[];
}

export interface ApiMenuStructureType {
  id: string;
  label: string;
  children: ApiMenuStructureType[];
}

export enum ApiReferenceLanguageEnum {
  Restful = 'milvus-restful',
  Csharp = 'milvus-sdk-csharp',
  Go = 'milvus-sdk-go',
  Java = 'milvus-sdk-java',
  Node = 'milvus-sdk-node',
  Python = 'pymilvus',
}

export enum ApiReferenceLabelEnum {
  Restful = 'RESTful',
  Csharp = 'C#',
  Go = 'Go',
  Java = 'Java',
  Node = 'Node',
  Python = 'Python',
}

export enum ApiReferenceRouteEnum {
  Restful = 'restful',
  Csharp = 'csharp',
  Go = 'go',
  Java = 'java',
  Node = 'node',
  Python = 'pymilvus',
}

export enum ApiReferenceMetaInfoEnum {
  Restful = 'restful api',
  Csharp = 'csharp',
  Go = 'go',
  Java = 'java',
  Node = 'nodejs',
  Python = 'pymilvus',
}

export interface ApiContentFrontMatterType {
  id: string;
  parentIds: string[];
  relativePath: string;
  category: ApiReferenceRouteEnum;
  version: string;
}
export interface ApiFileDateInfoType {
  frontMatter: ApiContentFrontMatterType;
  content: string;
}

export interface ApiRoutesDataType {
  language: ApiReferenceLanguageEnum;
  category: ApiReferenceRouteEnum;
  versions: string[];
  data: {
    version: string;
    menuData: FinalMenuStructureType[];
    contentList: ApiFileDateInfoType[];
  }[];
}
export interface AsideAnchorType {
  label: string;
  href: string;
  type: number;
  isActive: boolean;
}

export interface DocDetailPageProps {
  homeData: {
    tree: string;
    codeList: string[];
    headingContent: string;
    anchorList: AsideAnchorType[];
    summary: string;
    editPath: string;
    frontMatter: DocFrontMatterType;
  };
  isHome: boolean;
  blog: BlogFrontMatterType | null;
  version: string;
  lang: LanguageEnum;
  versions: string[];
  latestVersion: string;
  menus: FinalMenuStructureType[];
  id: string;
  mdListData: AllMdVersionIdType[];
}

export interface DocAnchorItemType {
  label: string;
  href: string;
  type: number;
  isActive: boolean;
}
