# Images API

High-level image service with S3 storage and on-demand variant generation.

## Methods

```typescript
bloko.images.upload(file: Buffer, fileName: string, nodeId: string): Promise<UploadResult>
bloko.images.getUrl(imageId: string, options?: VariantOptions): Promise<string>
bloko.images.delete(imageId: string): Promise<void>
bloko.images.getDirectUrl(s3Key: string): string
```

## Upload

Upload an image owned by a specific node. Returns the created image record.

```typescript
const buffer = fs.readFileSync('photo.jpg');
const { image } = await bloko.images.upload(buffer, 'photo.jpg', nodeId);

console.log(image.id);      // UUID
console.log(image._node);   // Owner node ID
console.log(image.width);   // Original width
console.log(image.height);  // Original height
```

**Note:** Images must belong to a node. When the node is deleted, its images are automatically deleted.

## Get URL

Get a URL for an image, optionally with variant options. Variants are generated on-demand and cached.

```typescript
// Original (re-encoded to webp at quality 80)
const url = await bloko.images.getUrl(imageId);

// Scaled to width (auto height)
const url = await bloko.images.getUrl(imageId, { width: 800 });

// Scaled to height (auto width)
const url = await bloko.images.getUrl(imageId, { height: 600 });

// Cropped to exact dimensions
const url = await bloko.images.getUrl(imageId, { width: 400, height: 400 });

// Custom format and quality
const url = await bloko.images.getUrl(imageId, {
  width: 1000,
  format: 'jpeg',
  quality: 90,
});
```

### Variant Options

```typescript
interface VariantOptions {
  width?: number | null;   // null = auto
  height?: number | null;  // null = auto
  format?: 'webp' | 'jpeg' | 'png';  // default: 'webp'
  quality?: number;        // default: 80 (1-100)
}
```

### Dimension Behavior

| width | height | result |
|-------|--------|--------|
| null | null | Original dimensions (re-encode to format/quality) |
| 1000 | null | Scale to 1000px wide, auto height |
| null | 600 | Scale to 600px tall, auto width |
| 1000 | 600 | Crop/cover to exactly 1000×600 |

### No Upscaling

If requested dimensions exceed original, output is clamped to the largest possible size:

```typescript
// Original: 800×600
await bloko.images.getUrl(imageId, { width: 2000 });
// Returns: 800×600 (clamped, no upscaling)

await bloko.images.getUrl(imageId, { width: 400 });
// Returns: 400×300 (scaled down)
```

## Delete

Delete an image and all its variants from S3 and database.

```typescript
await bloko.images.delete(imageId);
```

## Types

```typescript
interface UploadResult {
  image: Image;
}

interface Image {
  id: string;
  _node: string | null;  // Owner node ID
  s3_key: string;
  file_name: string;
  mime_type: string;
  format: string;
  file_size: number;
  width: number;
  height: number;
  caption: MultiLang | null;
  credit: MultiLang | null;
}
```

## Low-Level CRUD

For direct database access without S3 operations, see:
- [crud/images](../crud/images.md) - Image records
- [crud/image-variants](../crud/image-variants.md) - Variant records
