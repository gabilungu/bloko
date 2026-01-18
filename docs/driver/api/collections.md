# Collections API

High-level collection queries.

## getWithNavigation

Get a collection with navigation tree for a specific language. Perfect for building sidebar navigation.

```typescript
const nav = await bloko.collections.getWithNavigation('glossary', 'en');
```

**Parameters:**
- `code: string` - Collection code
- `lang: string` - Language code

**Returns:** `CollectionWithNavigation | null`

```typescript
interface CollectionWithNavigation {
  id: string;
  code: string;
  notes: string | null;
  nodes: NavNode[];
}

interface NavNode {
  id: string;
  code: string;
  title: string;   // Localized title
  slug: string;    // Localized slug
  children: NavNode[];
}
```

**Example:**

```typescript
export async function load({ params }) {
  const nav = await bloko.collections.getWithNavigation(
    params.collection,
    params.lang
  );

  if (!nav) {
    error(404, 'Collection not found');
  }

  return {
    collection: {
      id: nav.id,
      code: nav.code
    },
    nodeTree: nav.nodes
  };
}
```

## findByCode

Find a collection by code.

```typescript
const collection = await bloko.collections.findByCode('glossary');
```

**Returns:** `{ id, code, notes } | null`

## findAll

Get all collections.

```typescript
const collections = await bloko.collections.findAll();
```

**Returns:** `Array<{ id, code, notes }>`

**Example:**

```typescript
// Build site-wide navigation
const collections = await bloko.collections.findAll();

const siteNav = await Promise.all(
  collections.map(async (c) => ({
    ...c,
    tree: await bloko.nodes.getTree(c.id)
  }))
);
```
