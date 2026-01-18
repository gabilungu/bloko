import type {
  LanguageInsert,
  NodeTypeInsert,
  CollectionInsert,
  TemplateInsert,
  BlockInsert,
  NodeInsert,
} from '../../driver/types.js';

export interface Preset {
  name: string;
  description: string;
  languages: LanguageInsert[];
  nodeTypes: NodeTypeInsert[];
  collections: CollectionData[];
}

export interface RelationTypeData {
  code: string;
  title: Record<string, string>;
  reverse_title: Record<string, string>;
  notes?: string | null;
}

export interface RelationData {
  relationTypeCode: string;
  fromNodeCode: string;
  toNodeCode: string;
}

export interface CollectionData {
  collection: CollectionInsert;
  templates: TemplateData[];
  nodes: NodeData[];
  relationTypes?: RelationTypeData[];
  relations?: RelationData[];
}

export interface TemplateData {
  template: Partial<Omit<TemplateInsert, '_collection'>> & { code: string };
  blocks: BlockData[];
}

export interface BlockData {
  block: Partial<Omit<BlockInsert, '_template' | '_parent'>> & { code: string };
  children?: BlockData[];
}

export interface NodeData {
  node: Partial<Omit<NodeInsert, '_collection' | '_template' | '_node_type' | '_parent'>> & {
    code: string;
    templateCode: string;
    nodeTypeCode: string;
  };
  contents?: ContentData[];
  children?: NodeData[];
}

export interface ContentData {
  blockCode: string;
  value: unknown;
}
