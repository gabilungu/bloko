# CRUD API

Low-level CRUD operations for all entities.

## Overview

The CRUD API provides standard database operations at `bloko.crud.*`:

```typescript
// Standard CRUD pattern
const item = await bloko.crud.nodes.findById(id);
const items = await bloko.crud.nodes.findAll();
const created = await bloko.crud.nodes.create({ ... });
const updated = await bloko.crud.nodes.update(id, { ... });
await bloko.crud.nodes.delete(id);
```

## Common Methods

All entities have these standard methods:

| Method | Description |
|--------|-------------|
| `findAll()` | Get all records |
| `findById(id)` | Get by UUID |
| `create(data)` | Create new record |
| `update(id, data)` | Update existing record |
| `delete(id)` | Delete record |

## Entities

**Core:**
- [Collections](./collections)
- [Languages](./languages)
- [Node Types](./node-types)

**Templates:**
- [Templates](./templates)
- [Blocks](./blocks)

**Content:**
- [Nodes](./nodes)
- [Contents](./contents)

**Media:**
- [Images](./images)
- [Image Variants](./image-variants)

**Relations:**
- [Node Relation Types](./node-relation-types)
- [Node Relations](./node-relations)
