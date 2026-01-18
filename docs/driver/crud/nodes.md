# Nodes

## Methods

```typescript
bloko.crud.nodes.findAll(): Promise<Node[]>
bloko.crud.nodes.findById(id: string): Promise<Node | null>
bloko.crud.nodes.findByCollection(collectionId: string): Promise<Node[]>
bloko.crud.nodes.findByCode(collectionId: string, code: string): Promise<Node | null>
bloko.crud.nodes.findChildren(parentId: string): Promise<Node[]>
bloko.crud.nodes.findRoots(collectionId: string): Promise<Node[]>
bloko.crud.nodes.findByTemplate(templateId: string): Promise<Node[]>
bloko.crud.nodes.findByNodeType(nodeTypeId: string): Promise<Node[]>
bloko.crud.nodes.findBySlug(lang: string, slug: string, parentId: string | null): Promise<Node | null>
bloko.crud.nodes.findRootAncestor(nodeId: string): Promise<string | null>
bloko.crud.nodes.create(data: NodeInsert): Promise<Node>
bloko.crud.nodes.update(id: string, data: NodeUpdate): Promise<Node | null>
bloko.crud.nodes.delete(id: string): Promise<boolean>
bloko.crud.nodes.updatePositions(updates: NodePositionUpdate[]): Promise<void>
```

## Types

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
  slug: MultiLang | null;         // Auto-generated
  sort: number | null;
  sort_children_by: SortChildrenBy | null;
  _cover_image: string | null;
  _images: ImageRef[] | null;
  notes: string | null;
}

type SortChildrenBy = 'sort' | 'title' | 'subtitle';

type NodeInsert = Omit<Node, 'id' | 'slug'>;  // slug is auto-generated
type NodeUpdate = Partial<NodeInsert>;

interface NodePositionUpdate {
  id: string;
  _parent: string | null;
  sort: number;
}
```

**Notes:**
- `slug` is auto-generated from `title` by the database trigger
- `sort` is auto-calculated on create if not provided (next available in parent/collection)

## Examples

```typescript
// Create a node
const node = await bloko.crud.nodes.create({
  _collection: collection.id,
  _template: template.id,
  _node_type: nodeType.id,
  _parent: null,
  code: 'hello-world',
  title: { en: 'Hello World', ro: 'Salut Lume' },
  subtitle: null,
  sort: 1,
  sort_children_by: null,
  _cover_image: null,
  _images: null,
  notes: null,
});

// Find root nodes
const roots = await bloko.crud.nodes.findRoots(collection.id);

// Find children
const children = await bloko.crud.nodes.findChildren(node.id);

// Find by slug (for routing)
const found = await bloko.crud.nodes.findBySlug('en', 'hello-world', null);

// Find root ancestor (top-level parent)
const rootId = await bloko.crud.nodes.findRootAncestor(node.id);

// Batch update positions (for drag-and-drop reordering)
await bloko.crud.nodes.updatePositions([
  { id: 'uuid-1', _parent: null, sort: 0 },
  { id: 'uuid-2', _parent: null, sort: 1 },
  { id: 'uuid-3', _parent: 'uuid-1', sort: 0 },
]);
```
