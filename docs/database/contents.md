# Contents

Store actual content data for nodes, organized by blocks.

## Table

```sql
CREATE TABLE contents (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  _node UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  _block UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
  value JSONB NOT NULL,
  UNIQUE (_node, _block)
);
```

## Indexes

```sql
CREATE INDEX idx_contents_node ON contents(_node);
CREATE INDEX idx_contents_block ON contents(_block);
```

## Triggers

### Validate Block Template

Block's template must match node's template, and block must have a content_type:

```sql
CREATE OR REPLACE FUNCTION validate_content_block()
RETURNS TRIGGER AS $$
DECLARE
  node_template UUID;
  block_template UUID;
  block_content_type content_type;
BEGIN
  SELECT _template INTO node_template FROM nodes WHERE id = NEW._node;
  SELECT _template, content_type INTO block_template, block_content_type
    FROM blocks WHERE id = NEW._block;

  IF block_content_type IS NULL THEN
    RAISE EXCEPTION 'Block must have a content_type to store content';
  END IF;

  IF node_template IS DISTINCT FROM block_template THEN
    RAISE EXCEPTION 'Block template must match node template';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_content_validate
  BEFORE INSERT OR UPDATE ON contents
  FOR EACH ROW
  EXECUTE FUNCTION validate_content_block();
```

## Cascade

- **Node Delete**: CASCADE
- **Block Delete**: CASCADE
- **Block content_type Change**: CASCADE (content deleted)
