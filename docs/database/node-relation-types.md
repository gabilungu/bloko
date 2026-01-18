# Node Relation Types

Define types of relationships between nodes.

## Table

```sql
CREATE TABLE node_relation_types (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  code VARCHAR(50) NOT NULL,
  _collection UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  title JSONB,
  reverse_title JSONB,
  notes TEXT,
  UNIQUE (_collection, code)
);
```

## Indexes

```sql
CREATE INDEX idx_node_relation_types_collection ON node_relation_types(_collection);
CREATE INDEX idx_node_relation_types_title_gin ON node_relation_types USING GIN (title);
```

## Cascade

- **Delete**: CASCADE to node_relations
- **Collection Delete**: CASCADE
