# Node Relations

Create directed relationships between nodes.

## Table

```sql
CREATE TABLE node_relations (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  _from UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  _to UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  _node_relation_type UUID NOT NULL REFERENCES node_relation_types(id) ON DELETE CASCADE,
  UNIQUE (_from, _to, _node_relation_type)
);
```

## Indexes

```sql
CREATE INDEX idx_node_relations_from ON node_relations(_from);
CREATE INDEX idx_node_relations_to ON node_relations(_to);
CREATE INDEX idx_node_relations_type ON node_relations(_node_relation_type);
```

## Triggers

### Validate From Node Collection

From node must be in the same collection as the relation type:

```sql
CREATE OR REPLACE FUNCTION validate_node_relation()
RETURNS TRIGGER AS $$
DECLARE
  from_collection UUID;
  type_collection UUID;
BEGIN
  SELECT _collection INTO from_collection FROM nodes WHERE id = NEW._from;
  SELECT _collection INTO type_collection FROM node_relation_types WHERE id = NEW._node_relation_type;

  IF from_collection != type_collection THEN
    RAISE EXCEPTION 'From node must be in the same collection as the relation type';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_node_relation_validate
  BEFORE INSERT OR UPDATE ON node_relations
  FOR EACH ROW
  EXECUTE FUNCTION validate_node_relation();
```

## Cascade

- **From Node Delete**: CASCADE
- **To Node Delete**: CASCADE
- **Relation Type Delete**: CASCADE
