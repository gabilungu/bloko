# Image Variants

## Methods

```typescript
bloko.crud.imageVariants.findAll(): Promise<ImageVariant[]>
bloko.crud.imageVariants.findById(id: string): Promise<ImageVariant | null>
bloko.crud.imageVariants.findByImage(imageId: string): Promise<ImageVariant[]>
bloko.crud.imageVariants.findByS3Key(s3Key: string): Promise<ImageVariant | null>
bloko.crud.imageVariants.findByDimensions(imageId: string, width: number, height: number, format: string): Promise<ImageVariant | null>
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
  width: number;
  height: number;
  s3_key: string;
  format: string;
  file_size: number;
}

type ImageVariantInsert = Omit<ImageVariant, 'id'>;
type ImageVariantUpdate = Partial<ImageVariantInsert>;
```

## Examples

```typescript
// Create a variant
const variant = await bloko.crud.imageVariants.create({
  _image: image.id,
  width: 400,
  height: 300,
  s3_key: 'images/photo_400x300.webp',
  format: 'webp',
  file_size: 25600,
});

// Find all variants for an image
const variants = await bloko.crud.imageVariants.findByImage(image.id);

// Find specific variant
const thumb = await bloko.crud.imageVariants.findByDimensions(
  image.id,
  100,
  100,
  'webp'
);

// Delete all variants when deleting an image
await bloko.crud.imageVariants.deleteByImage(image.id);
```

**Note:** Variants are typically created automatically by `bloko.images` service during upload.
