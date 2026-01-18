# Driver

TypeScript driver for Bloko CMS with PostgreSQL.

## Installation

```bash
npm install bloko
```

## Quick Start

```typescript
import { createBloko } from 'bloko';

const bloko = createBloko({
  db: {
    host: 'localhost',
    port: 5432,
    database: 'bloko',
    user: 'admin',
    password: 'password',
  }
});

// API - High-level methods for common patterns
const nav = await bloko.collections.getWithNavigation('glossary', 'en');
const result = await bloko.nodes.findByPath('en', ['programming', 'api']);

// CRUD API - Low-level entity operations
const collection = await bloko.crud.collections.create({
  code: 'blog',
  notes: null,
});

// Clean up
await bloko.disconnect();
```

## Two API Layers

Bloko provides two complementary API layers:

### API (`bloko.*`)

High-level methods for common use cases like navigation, content fetching, and tree building:

```typescript
// Get collection with navigation tree
const nav = await bloko.collections.getWithNavigation('glossary', 'en');

// Find node by slug path with contents
const result = await bloko.nodes.findByPath('en', ['programming', 'api']);

// Get node tree
const tree = await bloko.nodes.getTree(collectionId);
```

See [API Reference](./api/) for full documentation.

### CRUD API (`bloko.crud.*`)

Low-level entity operations following standard CRUD patterns:

```typescript
// Standard CRUD operations
const node = await bloko.crud.nodes.findById(id);
const contents = await bloko.crud.contents.findByNode(nodeId);
await bloko.crud.nodes.create({ ... });
await bloko.crud.nodes.update(id, { ... });
await bloko.crud.nodes.delete(id);
```

See [CRUD API Reference](./crud/) for full documentation.

## Configuration

```typescript
interface BlokoConfig {
  db: DBConfig;
  s3?: S3Config;
}

interface DBConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

interface Bloko {
  // API - High-level methods
  nodes: NodesApi;
  collections: CollectionsApi;

  // CRUD API - Low-level entity operations
  crud: Crud;

  // Image service (when S3 configured)
  images?: ImageService;

  // Database access
  db: Pool;

  // Connection info (host, port, database, S3 config)
  connectionInfo(): ConnectionInfo;

  disconnect(): Promise<void>;
}

interface ConnectionInfo {
  pg: { host: string; port: number; database: string };
  s3: { endpoint: string; region: string; bucket: string } | null;
}
```

## Direct Database Access

For custom queries, use `bloko.db`:

```typescript
const result = await bloko.db.query(
  'SELECT * FROM nodes WHERE title->>$1 ILIKE $2',
  ['en', '%hello%']
);
```

## Disconnect

Always call `disconnect()` when done:

```typescript
await bloko.disconnect();
```
