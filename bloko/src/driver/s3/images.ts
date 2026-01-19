import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

// Lazy import sharp to avoid bundling issues
async function getSharp() {
  const sharp = await import('sharp');
  return sharp.default;
}
import type { S3Config } from './client.js';
import type { Crud } from '../crud/index.js';
import type { Image, ImageVariant } from '../types.js';

export interface VariantOptions {
  width?: number;
  height?: number;
  format?: 'webp' | 'jpeg' | 'png';
  quality?: number;
}

export interface UploadResult {
  image: Image;
}

export function createImageService(s3: S3Client, config: S3Config, crud: Crud) {
  /**
   * Generate variant S3 key from options
   */
  function getVariantKey(imageId: string, options: Required<VariantOptions>): string {
    const { width, height, format, quality } = options;
    return `images/${imageId}/w${width}_h${height}_q${quality}.${format}`;
  }

  /**
   * Get S3 URL for an S3 key
   */
  function getS3Url(s3Key: string): string {
    return `${config.endpoint}/${config.bucket}/${s3Key}`;
  }

  return {
    /**
     * Upload an image (original only, variants generated on-demand)
     */
    async upload(file: Buffer, fileName: string): Promise<UploadResult> {
      const sharp = await getSharp();
      const metadata = await sharp(file).metadata();
      if (!metadata.width || !metadata.height || !metadata.format) {
        throw new Error('Invalid image file');
      }

      const id = randomUUID();
      const ext = metadata.format;
      const s3Key = `images/${id}.${ext}`;
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

      return { image };
    },

    /**
     * Get URL for an image, optionally with variant options.
     * If options are provided and variant doesn't exist, it will be generated on-demand.
     *
     * @param imageId - The image ID
     * @param options - Optional variant options (width, height, format, quality)
     * @returns The S3 URL for the image or variant
     */
    async getUrl(imageId: string, options?: VariantOptions): Promise<string> {
      const image = await crud.images.findById(imageId);
      if (!image) {
        throw new Error(`Image not found: ${imageId}`);
      }

      // No options = return original
      if (!options || Object.keys(options).length === 0) {
        return getS3Url(image.s3_key);
      }

      // Fill in defaults from original image
      const fullOptions: Required<VariantOptions> = {
        width: options.width ?? image.width,
        height: options.height ?? image.height,
        format: options.format ?? (image.format as 'webp' | 'jpeg' | 'png'),
        quality: options.quality ?? 80,
      };

      // Check if variant already exists in DB by s3_key (uses requested dimensions)
      const variantKey = getVariantKey(imageId, fullOptions);
      const existingVariant = await crud.imageVariants.findByS3Key(variantKey);

      if (existingVariant) {
        return getS3Url(existingVariant.s3_key);
      }

      // Generate variant on-demand (with race condition handling)
      try {
        const variant = await this.generateVariant(image, fullOptions);
        return getS3Url(variant.s3_key);
      } catch (err: unknown) {
        // Handle duplicate key error (race condition - another request created it)
        if (err && typeof err === 'object' && 'code' in err && err.code === '23505') {
          const variant = await crud.imageVariants.findByS3Key(variantKey);
          if (variant) {
            return getS3Url(variant.s3_key);
          }
        }
        throw err;
      }
    },

    /**
     * Generate a variant for an image (internal method, use getUrl instead)
     */
    async generateVariant(image: Image, options: Required<VariantOptions>): Promise<ImageVariant> {
      const { width, height, format, quality } = options;
      const sharp = await getSharp();

      // Fetch original from S3
      const response = await s3.send(new GetObjectCommand({
        Bucket: config.bucket,
        Key: image.s3_key,
      }));

      const originalBuffer = Buffer.from(await response.Body!.transformToByteArray());

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
      const variantKey = getVariantKey(image.id, options);

      // Upload variant to S3
      await s3.send(new PutObjectCommand({
        Bucket: config.bucket,
        Key: variantKey,
        Body: variantBuffer,
        ContentType: `image/${format}`,
      }));

      // Save variant record to DB
      // Store REQUESTED dimensions (not actual output) to match s3_key and lookup
      return crud.imageVariants.create({
        _image: image.id,
        width,
        height,
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
     * Get direct S3 URL for an S3 key (no variant generation)
     */
    getDirectUrl(s3Key: string): string {
      return getS3Url(s3Key);
    },
  };
}

export type ImageService = ReturnType<typeof createImageService>;
