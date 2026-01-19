# Image Variants

Store generated image size variants with lazy loading.

## Table

```sql
CREATE TABLE image_variants (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  _image UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,

  -- Request params (nullable means "auto" / use original)
  req_width INTEGER,
  req_height INTEGER,
  format VARCHAR(10) NOT NULL DEFAULT 'webp',
  quality INTEGER NOT NULL DEFAULT 80,

  -- Actual output dimensions after resize/crop
  actual_width INTEGER NOT NULL,
  actual_height INTEGER NOT NULL,

  s3_key VARCHAR(500) NOT NULL UNIQUE,
  file_size INTEGER NOT NULL
);
```

## Indexes

```sql
CREATE INDEX idx_image_variants_image ON image_variants(_image);

-- Unique constraint for variant lookup (COALESCE handles nullable req_width/req_height)
CREATE UNIQUE INDEX idx_image_variants_params ON image_variants (
  _image,
  COALESCE(req_width, 0),
  COALESCE(req_height, 0),
  format,
  quality
);
```

## Cascade

- **Image Delete**: CASCADE

## Dimension Behavior

| req_width | req_height | result |
|-----------|------------|--------|
| null | null | Use original dimensions (re-encode to format/quality) |
| 1000 | null | Scale to 1000px wide, auto height |
| null | 600 | Scale to 600px tall, auto width |
| 1000 | 600 | Crop/cover to exactly 1000×600 |

**No upscaling:** If requested dimensions exceed original, output is clamped to the largest possible size within the original.
