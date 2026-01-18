# API

High-level methods for common use cases like navigation, content fetching, and tree building.

## Overview

The API provides convenient methods at `bloko.nodes.*` and `bloko.collections.*` that handle common patterns:

```typescript
// Get collection with navigation tree (for sidebar)
const nav = await bloko.collections.getWithNavigation('glossary', 'en');

// Find node by slug path with contents and breadcrumb
const result = await bloko.nodes.findByPath('en', ['programming', 'api']);

// Get node tree
const tree = await bloko.nodes.getTree(collectionId);
```

## Entities

- [Collections](./collections) - Collection queries and navigation
- [Nodes](./nodes) - Node queries with contents

## When to Use

Use the **API** when you need:
- Navigation trees for sidebars
- Node content with block info
- Breadcrumb trails
- Localized data for a specific language

Use the **CRUD API** when you need:
- Low-level entity operations
- Create, update, delete operations
- Direct database access patterns
