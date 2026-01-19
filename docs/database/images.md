# Images

Store image files and metadata. Each image belongs to a specific node (single-owner model).

## Table

```sql
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  _node UUID REFERENCES nodes(id) ON DELETE CASCADE,
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

## Fields

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key (UUIDv7) |
| _node | UUID | Owner node (CASCADE delete) |
| s3_key | VARCHAR(500) | S3 file path (unique) |
| file_name | VARCHAR(255) | Original filename |
| mime_type | VARCHAR(50) | MIME type (e.g., "image/jpeg") |
| format | VARCHAR(10) | File extension (e.g., "jpeg", "webp") |
| file_size | INTEGER | Size in bytes |
| width | INTEGER | Original width in pixels |
| height | INTEGER | Original height in pixels |
| caption | JSONB | Multi-language caption (optional) |
| credit | JSONB | Multi-language credit (optional) |

## Indexes

```sql
CREATE INDEX idx_images_node ON images(_node);
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

## Cascade Behavior

| Event | Action |
|-------|--------|
| Node deleted | Images owned by node are deleted (CASCADE) |
| Image deleted | Variants deleted, nodes._cover_image set to NULL, removed from nodes._images |

## Ownership Model

Images use a single-owner model:
- Each image belongs to exactly one node via the `_node` field
- When a node is deleted, all its images are automatically deleted
- Images without an owner (`_node = NULL`) are considered orphans
- Use `bloko images orphans` to list orphan images
- Use `bloko images cleanup` to delete orphan images
