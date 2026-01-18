# Types

TypeScript type definitions for all entities.

## Common Types

### MultiLang

Multi-language string stored as key-value pairs.

```typescript
type MultiLang = Record<string, string>;

// Example
const title: MultiLang = { en: 'Hello', ro: 'Salut' };
```

### ContentType

Enum for block content types.

```typescript
type ContentType =
  | 'number'
  | 'text'
  | 'text_list'
  | 'titled_text_list'
  | 'image'
  | 'image_list';
```

### SortChildrenBy

Enum for node child sorting options.

```typescript
type SortChildrenBy = 'sort' | 'title' | 'subtitle';
```

### ImageRef

Image reference in arrays.

```typescript
interface ImageRef {
  _image: string;  // UUID
  sort: number;
}
```

## Entity Types

### Collection

```typescript
interface Collection {
  id: string;
  code: string;
  notes: string | null;
}
```

### Language

```typescript
interface Language {
  id: string;      // e.g., 'en', 'ro', 'es-mx'
  title: string;
  sort: number | null;
}
```

### NodeType

```typescript
interface NodeType {
  id: string;
  code: string;
  title: MultiLang | null;
  sort: number | null;
  notes: string | null;
}
```

### Template

```typescript
interface Template {
  id: string;
  code: string;
  _collection: string;
  title: MultiLang | null;
  sort: number | null;
  notes: string | null;
}
```

### Block

```typescript
interface Block {
  id: string;
  code: string;
  _template: string;
  _parent: string | null;
  title: MultiLang | null;
  content_type: ContentType | null;
  sort: number | null;
  notes: string | null;
}
```

### Node

```typescript
interface Node {
  id: string;
  code: string;
  _collection: string;
  _template: string | null;
  _node_type: string;
  _parent: string | null;
  title: MultiLang | null;
  subtitle: MultiLang | null;
  slug: MultiLang | null;        // Auto-generated from title
  sort: number | null;
  sort_children_by: SortChildrenBy | null;
  _cover_image: string | null;
  _images: ImageRef[] | null;
  notes: string | null;
}
```

### Content

```typescript
interface Content {
  id: string;
  _node: string;
  _block: string;
  value: unknown;   // Type depends on block's content_type
}
```

**Value types by content_type:**

| content_type | value type |
|--------------|------------|
| `number` | `number` |
| `text` | `MultiLang` |
| `text_list` | `MultiLang[]` |
| `titled_text_list` | `{ title: MultiLang, text: MultiLang }[]` |
| `image` | `string` (UUID) |
| `image_list` | `ImageRef[]` |

### Image

```typescript
interface Image {
  id: string;
  _collection: string;
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
```

### ImageVariant

```typescript
interface ImageVariant {
  id: string;
  _image: string;
  width: number;
  height: number;
  s3_key: string;
  format: string;
  file_size: number;
}
```

### NodeRelationType

```typescript
interface NodeRelationType {
  id: string;
  code: string;
  _collection: string;
  title: MultiLang | null;
  reverse_title: MultiLang | null;
  notes: string | null;
}
```

### NodeRelation

```typescript
interface NodeRelation {
  id: string;
  _from: string;
  _to: string;
  _node_relation_type: string;
}
```

## Insert Types

For `create()` methods. Same as entity types but without `id` (auto-generated).

```typescript
type CollectionInsert = Omit<Collection, 'id'>;
type LanguageInsert = Language;  // id is user-provided
type NodeTypeInsert = Omit<NodeType, 'id'>;
type TemplateInsert = Omit<Template, 'id'>;
type BlockInsert = Omit<Block, 'id'>;
type NodeInsert = Omit<Node, 'id' | 'slug'>;  // slug auto-generated
type ContentInsert = Omit<Content, 'id'>;
type ImageInsert = Omit<Image, 'id'>;
type ImageVariantInsert = Omit<ImageVariant, 'id'>;
type NodeRelationTypeInsert = Omit<NodeRelationType, 'id'>;
type NodeRelationInsert = Omit<NodeRelation, 'id'>;
```

## Update Types

For `update()` methods. All fields optional.

```typescript
type CollectionUpdate = Partial<CollectionInsert>;
type LanguageUpdate = Partial<Omit<Language, 'id'>>;
type NodeTypeUpdate = Partial<NodeTypeInsert>;
// ... etc
```
