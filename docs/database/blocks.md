# Blocks

Define content areas within templates with hierarchical nesting.

## Table

```sql
CREATE TABLE blocks (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  code VARCHAR(50) NOT NULL,
  _template UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  _parent UUID REFERENCES blocks(id) ON DELETE CASCADE,
  title JSONB,
  content_type content_type,
  sort INTEGER,
  notes TEXT,
  UNIQUE (_template, code)
);
```

## Indexes

```sql
CREATE INDEX idx_blocks_template ON blocks(_template);
CREATE INDEX idx_blocks_parent ON blocks(_parent);
CREATE INDEX idx_blocks_title_gin ON blocks USING GIN (title);
```

## Triggers

### Content Type Change

Delete contents when block's content_type changes:

```sql
CREATE OR REPLACE FUNCTION cascade_block_content_type_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.content_type IS DISTINCT FROM NEW.content_type THEN
    DELETE FROM contents WHERE _block = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_block_content_type
  BEFORE UPDATE OF content_type ON blocks
  FOR EACH ROW
  EXECUTE FUNCTION cascade_block_content_type_change();
```

## Cascade

- **Delete**: CASCADE to child blocks and contents
- **Template Delete**: CASCADE
- **Parent Delete**: CASCADE
