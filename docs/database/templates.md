# Templates

Define the structure and layout for nodes using blocks.

## Table

```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  code VARCHAR(50) NOT NULL,
  _collection UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  title JSONB,
  sort INTEGER,
  notes TEXT,
  UNIQUE (_collection, code)
);
```

## Indexes

```sql
CREATE INDEX idx_templates_collection ON templates(_collection);
CREATE INDEX idx_templates_title_gin ON templates USING GIN (title);
```

## Cascade

- **Delete**: CASCADE to blocks, SET NULL on nodes._template
- **Collection Delete**: CASCADE
