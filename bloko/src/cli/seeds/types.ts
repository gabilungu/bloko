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

export interface CollectionData {
  collection: CollectionInsert;
  templates: TemplateData[];
  nodes: NodeData[];
}

export interface TemplateData {
  template: Omit<TemplateInsert, '_collection'>;
  blocks: BlockData[];
}

export interface BlockData {
  block: Omit<BlockInsert, '_template' | '_parent'>;
  children?: BlockData[];
}

export interface NodeData {
  node: Omit<NodeInsert, '_collection' | '_template' | '_node_type' | '_parent'> & {
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
