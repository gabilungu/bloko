# Image Variants

## Methods

```typescript
bloko.crud.imageVariants.findAll(): Promise<ImageVariant[]>
bloko.crud.imageVariants.findById(id: string): Promise<ImageVariant | null>
bloko.crud.imageVariants.findByImage(imageId: string): Promise<ImageVariant[]>
bloko.crud.imageVariants.findByS3Key(s3Key: string): Promise<ImageVariant | null>
bloko.crud.imageVariants.findByParams(
  imageId: string,
  reqWidth: number | null,
  reqHeight: number | null,
  format: string,
  quality: number
): Promise<ImageVariant | null>
bloko.crud.imageVariants.create(data: ImageVariantInsert): Promise<ImageVariant>
bloko.crud.imageVariants.update(id: string, data: ImageVariantUpdate): Promise<ImageVariant | null>
bloko.crud.imageVariants.delete(id: string): Promise<boolean>
bloko.crud.imageVariants.deleteByImage(imageId: string): Promise<number>
```

## Types

```typescript
interface ImageVariant {
  id: string;
  _image: string;

  // Request params (null means "auto" / use original)
  req_width: number | null;
  req_height: number | null;
  format: string;
  quality: number;

  // Actual output dimensions after resize/crop
  actual_width: number;
  actual_height: number;

  s3_key: string;
  file_size: number;
}

type ImageVariantInsert = Omit<ImageVariant, 'id'>;
type ImageVariantUpdate = Partial<ImageVariantInsert>;
```

## Examples

```typescript
// Find variant by exact params
const variant = await bloko.crud.imageVariants.findByParams(
  image.id,
  1000,    // req_width
  null,    // req_height (auto)
  'webp',
  80
);

// Find all variants for an image
const variants = await bloko.crud.imageVariants.findByImage(image.id);

// Delete all variants when deleting an image
await bloko.crud.imageVariants.deleteByImage(image.id);
```

**Note:** Variants are typically created automatically by `bloko.images.getUrl()` on-demand.

## Using the Image Service

The recommended way to work with images is through the `bloko.images` service:

```typescript
// Get URL with auto-generated variant
const url = await bloko.images.getUrl(imageId, {
  width: 1000,      // Scale to 1000px wide
  height: null,     // Auto height (maintain aspect ratio)
  format: 'webp',   // Default: 'webp'
  quality: 80,      // Default: 80
});

// Get URL for a specific crop
const thumbnailUrl = await bloko.images.getUrl(imageId, {
  width: 200,
  height: 200,  // Both specified = crop/cover
});

// Get original (re-encoded to webp at quality 80)
const originalUrl = await bloko.images.getUrl(imageId);
```

### Dimension Behavior

| width | height | result |
|-------|--------|--------|
| null | null | Original dimensions (re-encode to format/quality) |
| 1000 | null | Scale to 1000px wide, auto height |
| null | 600 | Scale to 600px tall, auto width |
| 1000 | 600 | Crop/cover to exactly 1000×600 |

### No Upscaling

If requested dimensions exceed original, output is clamped:

```typescript
// Original: 800×600
await bloko.images.getUrl(imageId, { width: 2000 });
// Returns: 800×600 (clamped, no upscaling)

await bloko.images.getUrl(imageId, { width: 400 });
// Returns: 400×300 (scaled down)
```
