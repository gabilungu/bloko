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
  width?: number | null;   // null = auto (scale from height or use original)
  height?: number | null;  // null = auto (scale from width or use original)
  format?: 'webp' | 'jpeg' | 'png';  // default: webp
  quality?: number;        // default: 80 (1-100)
}

export interface UploadResult {
  image: Image;
}

/**
 * Calculate output dimensions based on request and original image.
 *
 * Rules:
 * - Both null: use original dimensions
 * - Width only: scale proportionally, height auto
 * - Height only: scale proportionally, width auto
 * - Both specified: crop/cover to exact aspect ratio
 * - No upscaling: clamp to largest possible within original
 */
function calculateDimensions(
  original: { width: number; height: number },
  reqWidth: number | null,
  reqHeight: number | null
): { width: number; height: number; fit: 'inside' | 'cover' } {
  const origW = original.width;
  const origH = original.height;
  const origAspect = origW / origH;

  // Both null: use original dimensions
  if (reqWidth === null && reqHeight === null) {
    return { width: origW, height: origH, fit: 'inside' };
  }

  // Width only: scale proportionally
  if (reqWidth !== null && reqHeight === null) {
    // Clamp width to original (no upscaling)
    const w = Math.min(reqWidth, origW);
    const h = Math.round(w / origAspect);
    return { width: w, height: h, fit: 'inside' };
  }

  // Height only: scale proportionally
  if (reqWidth === null && reqHeight !== null) {
    // Clamp height to original (no upscaling)
    const h = Math.min(reqHeight, origH);
    const w = Math.round(h * origAspect);
    return { width: w, height: h, fit: 'inside' };
  }

  // Both specified: crop/cover mode
  // Find the largest crop of target aspect ratio that fits within original
  const targetAspect = reqWidth! / reqHeight!;

  let maxCropW: number;
  let maxCropH: number;

  if (targetAspect > origAspect) {
    // Target is wider than original - width-limited
    maxCropW = origW;
    maxCropH = Math.round(origW / targetAspect);
  } else {
    // Target is taller than original - height-limited
    maxCropH = origH;
    maxCropW = Math.round(origH * targetAspect);
  }

  // Clamp to requested size (no upscaling)
  const finalW = Math.min(reqWidth!, maxCropW);
  const finalH = Math.min(reqHeight!, maxCropH);

  return { width: finalW, height: finalH, fit: 'cover' };
}

export function createImageService(s3: S3Client, config: S3Config, crud: Crud) {
  /**
   * Generate variant S3 key from options
   */
  function getVariantKey(
    imageId: string,
    reqWidth: number | null,
    reqHeight: number | null,
    format: string,
    quality: number
  ): string {
    const w = reqWidth ?? 'auto';
    const h = reqHeight ?? 'auto';
    return `images/${imageId}/w${w}_h${h}_q${quality}.${format}`;
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

      // Apply defaults
      const reqWidth = options?.width ?? null;
      const reqHeight = options?.height ?? null;
      const format = options?.format ?? 'webp';
      const quality = options?.quality ?? 80;

      // If no transformation needed (original format, full quality, no resize), return original
      if (
        reqWidth === null &&
        reqHeight === null &&
        format === image.format &&
        quality === 100
      ) {
        return getS3Url(image.s3_key);
      }

      // Check if variant already exists in DB
      const existingVariant = await crud.imageVariants.findByParams(
        imageId,
        reqWidth,
        reqHeight,
        format,
        quality
      );

      if (existingVariant) {
        return getS3Url(existingVariant.s3_key);
      }

      // Generate variant on-demand (with race condition handling)
      try {
        const variant = await this.generateVariant(image, reqWidth, reqHeight, format, quality);
        return getS3Url(variant.s3_key);
      } catch (err: unknown) {
        // Handle duplicate key error (race condition - another request created it)
        if (err && typeof err === 'object' && 'code' in err && err.code === '23505') {
          const variant = await crud.imageVariants.findByParams(
            imageId,
            reqWidth,
            reqHeight,
            format,
            quality
          );
          if (variant) {
            return getS3Url(variant.s3_key);
          }
        }
        throw err;
      }
    },

    /**
     * Generate a variant for an image.
     * Calculates optimal dimensions based on request and original image size.
     */
    async generateVariant(
      image: Image,
      reqWidth: number | null,
      reqHeight: number | null,
      format: 'webp' | 'jpeg' | 'png',
      quality: number
    ): Promise<ImageVariant> {
      const sharp = await getSharp();

      // Calculate actual output dimensions
      const { width: actualWidth, height: actualHeight, fit } = calculateDimensions(
        { width: image.width, height: image.height },
        reqWidth,
        reqHeight
      );

      // Fetch original from S3
      const response = await s3.send(new GetObjectCommand({
        Bucket: config.bucket,
        Key: image.s3_key,
      }));

      const originalBuffer = Buffer.from(await response.Body!.transformToByteArray());

      // Generate variant
      let transformer = sharp(originalBuffer).resize(actualWidth, actualHeight, { fit });

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
      const variantKey = getVariantKey(image.id, reqWidth, reqHeight, format, quality);

      // Upload variant to S3
      await s3.send(new PutObjectCommand({
        Bucket: config.bucket,
        Key: variantKey,
        Body: variantBuffer,
        ContentType: `image/${format}`,
      }));

      // Save variant record to DB
      return crud.imageVariants.create({
        _image: image.id,
        req_width: reqWidth,
        req_height: reqHeight,
        format,
        quality,
        actual_width: actualWidth,
        actual_height: actualHeight,
        s3_key: variantKey,
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
