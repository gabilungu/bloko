# Images

Store image files and metadata. Owned by collections.

## Table

```sql
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  _collection UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  s3_key VARCHAR(500) NOT NULL UNIQUE,
  file_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(50) NOT NULL,
  format VARCHAR(10) NOT NULL,
  file_size INTEGER NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  caption JSONB,
  credit JSONB
);
```

## Indexes

```sql
CREATE INDEX idx_images_collection ON images(_collection);
CREATE INDEX idx_images_caption_gin ON images USING GIN (caption);
```

## Triggers

### Remove from Nodes Gallery

When an image is deleted, remove it from all nodes' `_images` arrays:

```sql
CREATE OR REPLACE FUNCTION cascade_image_delete_from_nodes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE nodes SET _images = (
    SELECT COALESCE(jsonb_agg(elem), '[]'::jsonb)
    FROM jsonb_array_elements(_images) elem
    WHERE (elem->>'_image')::uuid != OLD.id
  )
  WHERE _images @> jsonb_build_array(jsonb_build_object('_image', OLD.id::text));

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_image_delete_from_nodes
  BEFORE DELETE ON images
  FOR EACH ROW
  EXECUTE FUNCTION cascade_image_delete_from_nodes();
```

## Cascade

- **Delete**: CASCADE to image_variants, SET NULL on nodes._cover_image, REMOVE from nodes._images
- **Collection Delete**: CASCADE
