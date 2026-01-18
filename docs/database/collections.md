# Collections

Organizational containers that own templates, node relation types, and images.

## Table

```sql
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  code VARCHAR(50) NOT NULL UNIQUE,
  notes TEXT
);
```

## Indexes

```sql
-- Primary key index created automatically
-- Unique index on code created automatically
```

## Cascade

- **Delete**: CASCADE to nodes, templates, images, node_relation_types
