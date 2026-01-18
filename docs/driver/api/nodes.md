# Nodes API

High-level node queries with contents.

## findByPath

Find a node by walking a slug path. Returns the node with contents and breadcrumb.

```typescript
const result = await bloko.nodes.findByPath('en', ['programming', 'api']);
```

**Parameters:**
- `lang: string` - Language code
- `slugPath: string[]` - Array of slugs to traverse

**Returns:** `FindByPathResult | null`

```typescript
interface FindByPathResult {
  node: NodeWithContents;
  breadcrumb: Array<{
    id: string;
    code: string;
    title: Record<string, string>;
    slug: Record<string, string>;
  }>;
}
```

**Example:**

```typescript
export async function load({ params }) {
  const slugPath = params.slugs.split('/');
  const result = await bloko.nodes.findByPath(params.lang, slugPath);

  if (!result) {
    error(404, 'Node not found');
  }

  return {
    node: result.node,
    contents: result.node.contents,
    breadcrumb: result.breadcrumb
  };
}
```

## findById

Get a node by ID with its contents.

```typescript
const node = await bloko.nodes.findById('uuid');
```

**Returns:** `NodeWithContents | null`

```typescript
interface NodeWithContents {
  id: string;
  code: string;
  title: Record<string, string>;
  subtitle: Record<string, string>;
  slug: Record<string, string>;
  contents: ContentItem[];
}

interface ContentItem {
  id: string;
  blockCode: string;
  blockTitle: Record<string, string>;
  contentType: string;
  sort: number;
  value: Record<string, unknown>;
}
```

## getTree

Get a node tree for a collection.

```typescript
const tree = await bloko.nodes.getTree(collectionId);
const tree = await bloko.nodes.getTree(collectionId, { depth: 3 });
```

**Parameters:**
- `collectionId: string` - Collection UUID
- `options.depth?: number` - Maximum depth (default: 10)

**Returns:** `TreeNode[]`

```typescript
interface TreeNode {
  id: string;
  code: string;
  title: Record<string, string>;
  slug: Record<string, string>;
  childrenCount: number;
  children: TreeNode[];
}
```

## findChildren

Get children of a node with their contents.

```typescript
const children = await bloko.nodes.findChildren(parentId);
```

**Returns:** `NodeWithContents[]`

## findRoots

Get root nodes of a collection with their contents.

```typescript
const roots = await bloko.nodes.findRoots(collectionId);
```

**Returns:** `NodeWithContents[]`

## getRootAncestor

Get the root ancestor (top-level parent) of a node with its contents.

```typescript
const root = await bloko.nodes.getRootAncestor(nodeId);
```

**Parameters:**
- `nodeId: string` - Node UUID

**Returns:** `NodeWithContents | null`

Returns the top-level ancestor in the node hierarchy. If the node is already a root node (no parent), returns itself.
