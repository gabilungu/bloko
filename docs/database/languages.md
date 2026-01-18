# Languages

Define available languages for multi-language content.

## Table

```sql
CREATE TABLE languages (
  id VARCHAR(8) PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  sort INTEGER
);

ALTER TABLE languages ADD CONSTRAINT languages_id_format
  CHECK (id ~ '^[a-z]{2,3}(-[a-z]{2,4})?$');
```

## Triggers

### Delete Language

When a language is deleted, remove its key from all JSONB fields:

```sql
CREATE OR REPLACE FUNCTION cascade_language_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- nodes
  UPDATE nodes SET
    title = title - OLD.id,
    subtitle = subtitle - OLD.id,
    slug = slug - OLD.id
  WHERE title ? OLD.id OR subtitle ? OLD.id OR slug ? OLD.id;

  -- node_types
  UPDATE node_types SET title = title - OLD.id WHERE title ? OLD.id;

  -- templates
  UPDATE templates SET title = title - OLD.id WHERE title ? OLD.id;

  -- blocks
  UPDATE blocks SET title = title - OLD.id WHERE title ? OLD.id;

  -- node_relation_types
  UPDATE node_relation_types SET
    title = title - OLD.id,
    reverse_title = reverse_title - OLD.id
  WHERE title ? OLD.id OR reverse_title ? OLD.id;

  -- images
  UPDATE images SET
    caption = caption - OLD.id,
    credit = credit - OLD.id
  WHERE caption ? OLD.id OR credit ? OLD.id;

  -- contents (simple text)
  UPDATE contents SET value = value - OLD.id
  WHERE value ? OLD.id AND jsonb_typeof(value) = 'object';

  -- contents with arrays (text_list, titled_text_list)
  UPDATE contents SET value = (
    SELECT jsonb_agg(
      CASE
        WHEN jsonb_typeof(elem) = 'object' THEN elem - OLD.id
        ELSE elem
      END
    )
    FROM jsonb_array_elements(value) elem
  )
  WHERE jsonb_typeof(value) = 'array';

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_language_delete
  BEFORE DELETE ON languages
  FOR EACH ROW
  EXECUTE FUNCTION cascade_language_delete();
```

### Rename Language

When a language ID is updated, rename the key in all JSONB fields:

```sql
CREATE OR REPLACE FUNCTION cascade_language_rename()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.id != NEW.id THEN
    UPDATE nodes SET
      title = (title - OLD.id) || jsonb_build_object(NEW.id, title->OLD.id),
      subtitle = (subtitle - OLD.id) || jsonb_build_object(NEW.id, subtitle->OLD.id),
      slug = (slug - OLD.id) || jsonb_build_object(NEW.id, slug->OLD.id)
    WHERE title ? OLD.id OR subtitle ? OLD.id OR slug ? OLD.id;

    UPDATE node_types SET
      title = (title - OLD.id) || jsonb_build_object(NEW.id, title->OLD.id)
    WHERE title ? OLD.id;

    UPDATE templates SET
      title = (title - OLD.id) || jsonb_build_object(NEW.id, title->OLD.id)
    WHERE title ? OLD.id;

    UPDATE blocks SET
      title = (title - OLD.id) || jsonb_build_object(NEW.id, title->OLD.id)
    WHERE title ? OLD.id;

    UPDATE node_relation_types SET
      title = (title - OLD.id) || jsonb_build_object(NEW.id, title->OLD.id),
      reverse_title = (reverse_title - OLD.id) || jsonb_build_object(NEW.id, reverse_title->OLD.id)
    WHERE title ? OLD.id OR reverse_title ? OLD.id;

    UPDATE images SET
      caption = (caption - OLD.id) || jsonb_build_object(NEW.id, caption->OLD.id),
      credit = (credit - OLD.id) || jsonb_build_object(NEW.id, credit->OLD.id)
    WHERE caption ? OLD.id OR credit ? OLD.id;

    -- contents (simple text)
    UPDATE contents SET
      value = (value - OLD.id) || jsonb_build_object(NEW.id, value->OLD.id)
    WHERE value ? OLD.id AND jsonb_typeof(value) = 'object';

    -- contents with arrays (text_list, titled_text_list)
    UPDATE contents SET value = (
      SELECT jsonb_agg(
        CASE
          WHEN jsonb_typeof(elem) = 'object' AND elem ? OLD.id THEN
            (elem - OLD.id) || jsonb_build_object(NEW.id, elem->OLD.id)
          ELSE elem
        END
      )
      FROM jsonb_array_elements(value) elem
    )
    WHERE jsonb_typeof(value) = 'array';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_language_rename
  BEFORE UPDATE ON languages
  FOR EACH ROW
  EXECUTE FUNCTION cascade_language_rename();
```
