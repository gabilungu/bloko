# Nodes

Content instances that use templates to structure data. Form hierarchical trees within collections.

## Table

```sql
CREATE TABLE nodes (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  code VARCHAR(50) NOT NULL,
  _collection UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  _template UUID REFERENCES templates(id) ON DELETE SET NULL,
  _node_type UUID NOT NULL REFERENCES node_types(id) ON DELETE CASCADE,
  _parent UUID REFERENCES nodes(id) ON DELETE CASCADE,
  title JSONB,
  subtitle JSONB,
  slug JSONB,
  sort INTEGER,
  sort_children_by sort_children_by,
  _cover_image UUID REFERENCES images(id) ON DELETE SET NULL,
  _images JSONB,
  notes TEXT,
  UNIQUE (_collection, code)
);
```

## Indexes

```sql
CREATE INDEX idx_nodes_collection ON nodes(_collection);
CREATE INDEX idx_nodes_template ON nodes(_template);
CREATE INDEX idx_nodes_node_type ON nodes(_node_type);
CREATE INDEX idx_nodes_parent ON nodes(_parent);
CREATE INDEX idx_nodes_cover_image ON nodes(_cover_image);

-- JSONB indexes
CREATE INDEX idx_nodes_title_gin ON nodes USING GIN (title);
CREATE INDEX idx_nodes_slug_gin ON nodes USING GIN (slug);

-- Slug uniqueness for top-level nodes
CREATE UNIQUE INDEX idx_nodes_slug_unique_top_level
  ON nodes ((slug->>'en'))
  WHERE _parent IS NULL;
```

## Triggers

### Parent Same Collection

Validate parent is in the same collection:

```sql
CREATE OR REPLACE FUNCTION validate_node_parent()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW._parent IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM nodes
      WHERE id = NEW._parent AND _collection = NEW._collection
    ) THEN
      RAISE EXCEPTION 'Parent node must be in the same collection';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_node_parent_validate
  BEFORE INSERT OR UPDATE OF _parent, _collection ON nodes
  FOR EACH ROW
  EXECUTE FUNCTION validate_node_parent();
```

### Slug Generation

Auto-generate slugs from title:

```sql
CREATE OR REPLACE FUNCTION generate_slug()
RETURNS TRIGGER AS $$
DECLARE
  lang TEXT;
  title_value TEXT;
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  FOR lang IN SELECT jsonb_object_keys(NEW.title)
  LOOP
    title_value := NEW.title->>lang;
    IF title_value IS NOT NULL AND title_value != '' THEN
      base_slug := lower(regexp_replace(title_value, '[^a-zA-Z0-9]+', '-', 'g'));
      base_slug := trim(both '-' from base_slug);

      final_slug := base_slug;
      counter := 0;

      WHILE EXISTS (
        SELECT 1 FROM nodes
        WHERE id != NEW.id
          AND COALESCE(_parent, '00000000-0000-0000-0000-000000000000') =
              COALESCE(NEW._parent, '00000000-0000-0000-0000-000000000000')
          AND slug->>lang = final_slug
      ) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
      END LOOP;

      NEW.slug := COALESCE(NEW.slug, '{}'::jsonb) || jsonb_build_object(lang, final_slug);
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_node_slug
  BEFORE INSERT OR UPDATE OF title, _parent ON nodes
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug();
```

## Cascade

- **Delete**: CASCADE to child nodes and contents
- **Collection Delete**: CASCADE
- **Template Delete**: SET NULL
- **Node Type Delete**: CASCADE
- **Parent Delete**: CASCADE
- **Cover Image Delete**: SET NULL

## Fields

### _images

JSONB array of image UUIDs for gallery display. Unlike `_cover_image` which references a single image, `_images` stores multiple image IDs:

```json
["550e8400-e29b-41d4-a716-446655440000", "6ba7b810-9dad-11d1-80b4-00c04fd430c8"]
```

Images in this array should exist in the `images` table. The array maintains insertion order for display purposes
