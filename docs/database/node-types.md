# Node Types

Organizational categorization for nodes.

## Table

```sql
CREATE TABLE node_types (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  code VARCHAR(50) NOT NULL UNIQUE,
  title JSONB,
  sort INTEGER,
  notes TEXT
);
```

## Indexes

```sql
-- GIN index for JSONB title queries
CREATE INDEX idx_node_types_title_gin ON node_types USING GIN (title);
```

## Cascade

- **Delete**: CASCADE to all nodes using this type
