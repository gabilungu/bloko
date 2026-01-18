import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

// Lazy import sharp to avoid bundling issues
async function getSharp() {
  const sharp = await import('sharp');
  return sharp.default;
}
import type { S3Config } from './client.js';
import type { Crud } from '../crud/index.js';
import type { Image, ImageVariant } from '../types.js';

export interface VariantConfig {
  width: number;
  height: number;
  format: 'webp' | 'jpeg' | 'png';
  quality?: number;
}

export interface UploadResult {
  image: Image;
  variants: ImageVariant[];
}

export function createImageService(s3: S3Client, config: S3Config, crud: Crud) {
  return {
    /**
     * Upload an image and generate variants
     */
    async upload(
      collectionId: string,
      file: Buffer,
      fileName: string,
      variants: VariantConfig[] = []
    ): Promise<UploadResult> {
      // Get image metadata
      const sharp = await getSharp();
      const metadata = await sharp(file).metadata();
      if (!metadata.width || !metadata.height || !metadata.format) {
        throw new Error('Invalid image file');
      }

      const id = randomUUID();
      const ext = metadata.format;
      const s3Key = `images/${collectionId}/${id}.${ext}`;
      const mimeType = `image/${metadata.format}`;

      // Upload original image
      await s3.send(new PutObjectCommand({
        Bucket: config.bucket,
        Key: s3Key,
        Body: file,
        ContentType: mimeType,
      }));

      // Create image record
      const image = await crud.images.create({
        _collection: collectionId,
        s3_key: s3Key,
        file_name: fileName,
        mime_type: mimeType,
        format: ext,
        file_size: file.length,
        width: metadata.width,
        height: metadata.height,
        caption: null,
        credit: null,
      });

      // Generate and upload variants
      const createdVariants: ImageVariant[] = [];

      for (const variantConfig of variants) {
        const variant = await this.createVariant(image.id, file, variantConfig, collectionId);
        createdVariants.push(variant);
      }

      return { image, variants: createdVariants };
    },

    /**
     * Create a single variant for an existing image
     */
    async createVariant(
      imageId: string,
      originalBuffer: Buffer,
      variantConfig: VariantConfig,
      collectionId: string
    ): Promise<ImageVariant> {
      const { width, height, format, quality = 80 } = variantConfig;
      const sharp = await getSharp();

      // Generate variant
      let transformer = sharp(originalBuffer).resize(width, height, { fit: 'inside' });

      switch (format) {
        case 'webp':
          transformer = transformer.webp({ quality });
          break;
        case 'jpeg':
          transformer = transformer.jpeg({ quality });
          break;
        case 'png':
          transformer = transformer.png();
          break;
      }

      const variantBuffer = await transformer.toBuffer();
      const variantMetadata = await sharp(variantBuffer).metadata();

      const variantKey = `images/${collectionId}/${imageId}/${width}x${height}.${format}`;

      // Upload variant
      await s3.send(new PutObjectCommand({
        Bucket: config.bucket,
        Key: variantKey,
        Body: variantBuffer,
        ContentType: `image/${format}`,
      }));

      // Create variant record
      return crud.imageVariants.create({
        _image: imageId,
        width: variantMetadata.width ?? width,
        height: variantMetadata.height ?? height,
        s3_key: variantKey,
        format,
        file_size: variantBuffer.length,
      });
    },

    /**
     * Delete an image and all its variants from S3
     */
    async delete(imageId: string): Promise<void> {
      const image = await crud.images.findById(imageId);
      if (!image) return;

      const variants = await crud.imageVariants.findByImage(imageId);

      // Delete variant files from S3
      for (const variant of variants) {
        await s3.send(new DeleteObjectCommand({
          Bucket: config.bucket,
          Key: variant.s3_key,
        }));
      }

      // Delete original file from S3
      await s3.send(new DeleteObjectCommand({
        Bucket: config.bucket,
        Key: image.s3_key,
      }));

      // Delete from database (cascades to variants)
      await crud.images.delete(imageId);
    },

    /**
     * Get S3 URL for an image
     */
    getUrl(s3Key: string): string {
      return `${config.endpoint}/${config.bucket}/${s3Key}`;
    },
  };
}

export type ImageService = ReturnType<typeof createImageService>;
