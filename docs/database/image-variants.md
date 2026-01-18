# Image Variants

Store generated image size variants.

## Table

```sql
CREATE TABLE image_variants (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  _image UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  s3_key VARCHAR(500) NOT NULL UNIQUE,
  format VARCHAR(10) NOT NULL,
  file_size INTEGER NOT NULL,
  UNIQUE (_image, width, height, format)
);
```

## Indexes

```sql
CREATE INDEX idx_image_variants_image ON image_variants(_image);
```

## Cascade

- **Image Delete**: CASCADE
