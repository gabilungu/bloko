# Images

## Methods

```typescript
bloko.crud.images.findAll(): Promise<Image[]>
bloko.crud.images.findById(id: string): Promise<Image | null>
bloko.crud.images.findByCollection(collectionId: string): Promise<Image[]>
bloko.crud.images.findByS3Key(s3Key: string): Promise<Image | null>
bloko.crud.images.create(data: ImageInsert): Promise<Image>
bloko.crud.images.update(id: string, data: ImageUpdate): Promise<Image | null>
bloko.crud.images.delete(id: string): Promise<boolean>
```

## Types

```typescript
interface Image {
  id: string;
  _collection: string;
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

type ImageInsert = Omit<Image, 'id'>;
type ImageUpdate = Partial<ImageInsert>;
```

## Examples

```typescript
// Create image record
const image = await bloko.crud.images.create({
  _collection: collection.id,
  s3_key: 'images/photo.jpg',
  file_name: 'photo.jpg',
  mime_type: 'image/jpeg',
  format: 'jpeg',
  file_size: 102400,
  width: 1920,
  height: 1080,
  caption: { en: 'A beautiful photo' },
  credit: { en: 'Photo by John Doe' },
});

// Find by S3 key
const found = await bloko.crud.images.findByS3Key('images/photo.jpg');

// Find all images in a collection
const collectionImages = await bloko.crud.images.findByCollection(collection.id);
```

**Note:** Use `bloko.images` service for uploading images with automatic variant generation.
