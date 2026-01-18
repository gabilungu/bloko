# S3 Storage

S3-compatible storage for images with automatic variant generation. MinIO for local development, AWS S3 or compatible for production.

## Configuration

```typescript
import { createBloko } from 'bloko';

const bloko = createBloko({
  db: {
    host: 'localhost',
    port: 5432,
    database: 'bloko',
    user: 'postgres',
    password: 'password',
  },
  s3: {
    endpoint: 'http://localhost:9000',
    region: 'us-east-1',
    bucket: 'bloko',
    accessKeyId: 'admin',
    secretAccessKey: 'password',
    forcePathStyle: true, // Required for MinIO
  },
});
```

## Upload Image

Upload an image with automatic variant generation:

```typescript
const file = fs.readFileSync('photo.jpg');

const { image, variants } = await bloko.images.upload(
  collectionId,
  file,
  'photo.jpg',
  [
    { width: 150, height: 150, format: 'webp', quality: 80 },
    { width: 640, height: 480, format: 'webp', quality: 85 },
    { width: 1920, height: 1080, format: 'webp', quality: 90 },
  ]
);

console.log(image.id);        // UUID
console.log(image.s3_key);    // images/{collectionId}/{id}.jpg
console.log(variants.length); // 3
```

## Variant Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `width` | number | required | Max width in pixels |
| `height` | number | required | Max height in pixels |
| `format` | `'webp' \| 'jpeg' \| 'png'` | required | Output format |
| `quality` | number | 80 | Compression quality (1-100) |

Variants are resized using `fit: 'inside'` - the image is scaled to fit within the specified dimensions while maintaining aspect ratio.

## Create Additional Variants

Add variants to an existing image:

```typescript
const variant = await bloko.images.createVariant(
  imageId,
  originalBuffer,
  { width: 320, height: 240, format: 'webp' },
  collectionId
);
```

## Get Image URL

```typescript
const url = bloko.images.getUrl(image.s3_key);
// http://localhost:9000/bloko/images/{collectionId}/{id}.jpg

const variantUrl = bloko.images.getUrl(variant.s3_key);
// http://localhost:9000/bloko/images/{collectionId}/{imageId}/320x240.webp
```

## Delete Image

Deletes the original image, all variants, and database records:

```typescript
await bloko.images.delete(imageId);
```

## Bucket Structure

```
bloko/
└── images/
    └── {collectionId}/
        ├── {imageId}.{format}              # Original
        └── {imageId}/
            ├── 150x150.webp                # Variants
            ├── 640x480.webp
            └── 1920x1080.webp
```

## Suggested Variant Sizes

| Name | Width | Height | Use |
|------|-------|--------|-----|
| thumb | 150 | 150 | Thumbnails, grids |
| small | 320 | 240 | Mobile devices |
| medium | 640 | 480 | Tablets |
| large | 1024 | 768 | Desktop |
| xl | 1920 | 1080 | Full screen |

## Production Configuration

For production, use AWS S3 or any S3-compatible service:

```typescript
const bloko = createBloko({
  db: { /* ... */ },
  s3: {
    endpoint: 'https://s3.amazonaws.com',
    region: 'us-east-1',
    bucket: 'your-bucket',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    forcePathStyle: false, // Use virtual-hosted style for AWS
  },
});
```

## TypeScript Types

```typescript
interface S3Config {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  forcePathStyle?: boolean;
}

interface VariantConfig {
  width: number;
  height: number;
  format: 'webp' | 'jpeg' | 'png';
  quality?: number;
}

interface UploadResult {
  image: Image;
  variants: ImageVariant[];
}
```
