# Image Variants

Low-level CRUD for image variant records. For high-level usage with automatic variant generation, see [Images API](../api/images.md).

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

**Note:** Variants are typically created automatically by `bloko.images.getUrl()`. Use the [Images API](../api/images.md) for the recommended approach.
