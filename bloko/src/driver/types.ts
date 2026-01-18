// Multi-language string type
export type MultiLang = Record<string, string>;

// Enums
export type ContentType = 'number' | 'text' | 'text_list' | 'titled_text_list' | 'image' | 'image_list';
export type SortChildrenBy = 'sort' | 'title' | 'subtitle';

// Image reference in arrays
export interface ImageRef {
  _image: string;
  sort: number;
}

// Entity types
export interface Collection {
  id: string;
  code: string;
  sort: number | null;
  notes: string | null;
}

export interface Language {
  id: string;
  title: string;
  sort: number | null;
}

export interface NodeType {
  id: string;
  code: string;
  title: MultiLang | null;
  sort: number | null;
  notes: string | null;
}

export interface Template {
  id: string;
  code: string;
  _collection: string;
  title: MultiLang | null;
  sort: number | null;
  notes: string | null;
}

export interface Block {
  id: string;
  code: string;
  _template: string;
  _parent: string | null;
  title: MultiLang | null;
  content_type: ContentType | null;
  sort: number | null;
  notes: string | null;
}

export interface Node {
  id: string;
  code: string;
  _collection: string;
  _template: string | null;
  _node_type: string;
  _parent: string | null;
  title: MultiLang | null;
  subtitle: MultiLang | null;
  slug: MultiLang | null;
  sort: number | null;
  sort_children_by: SortChildrenBy | null;
  _cover_image: string | null;
  _images: ImageRef[] | null;
  notes: string | null;
}

export interface Content {
  id: string;
  _node: string;
  _block: string;
  value: unknown;
}

export interface Image {
  id: string;
  s3_key: string;
  file_name: string;
  mime_type: string;
  format: string;
  file_size: number;
  width: number;
  height: number;
  caption: MultiLang | null;
  credit: MultiLang | null;
}

export interface ImageVariant {
  id: string;
  _image: string;
  width: number;
  height: number;
  s3_key: string;
  format: string;
  file_size: number;
}

export interface NodeRelationType {
  id: string;
  code: string;
  _collection: string;
  title: MultiLang | null;
  reverse_title: MultiLang | null;
  notes: string | null;
}

export interface NodeRelation {
  id: string;
  _from: string;
  _to: string;
  _node_relation_type: string;
}

// Insert types (without id, which is auto-generated)
export type CollectionInsert = Omit<Collection, 'id'>;
export type LanguageInsert = Language; // id is user-provided
export type NodeTypeInsert = Omit<NodeType, 'id'>;
export type TemplateInsert = Omit<Template, 'id'>;
export type BlockInsert = Omit<Block, 'id'>;
export type NodeInsert = Omit<Node, 'id'>;
export type ContentInsert = Omit<Content, 'id'>;
export type ImageInsert = Omit<Image, 'id'>;
export type ImageVariantInsert = Omit<ImageVariant, 'id'>;
export type NodeRelationTypeInsert = Omit<NodeRelationType, 'id'>;
export type NodeRelationInsert = Omit<NodeRelation, 'id'>;

// Update types (partial, without id)
export type CollectionUpdate = Partial<CollectionInsert>;
export type LanguageUpdate = Partial<Omit<Language, 'id'>>;
export type NodeTypeUpdate = Partial<NodeTypeInsert>;
export type TemplateUpdate = Partial<TemplateInsert>;
export type BlockUpdate = Partial<BlockInsert>;
export type NodeUpdate = Partial<NodeInsert>;
export type ContentUpdate = Partial<ContentInsert>;
export type ImageUpdate = Partial<ImageInsert>;
export type ImageVariantUpdate = Partial<ImageVariantInsert>;
export type NodeRelationTypeUpdate = Partial<NodeRelationTypeInsert>;
export type NodeRelationUpdate = Partial<NodeRelationInsert>;

// Position update for batch reordering
export interface NodePositionUpdate {
  id: string;
  _parent: string | null;
  sort: number;
}
