import type { DB } from '../db.js';
import type { ImageVariant, ImageVariantInsert, ImageVariantUpdate } from '../types.js';

export function imageVariants(db: DB) {
  return {
    async findAll(): Promise<ImageVariant[]> {
      const result = await db.query('SELECT * FROM image_variants ORDER BY actual_width, actual_height');
      return result.rows;
    },

    async findById(id: string): Promise<ImageVariant | null> {
      const result = await db.query('SELECT * FROM image_variants WHERE id = $1', [id]);
      return result.rows[0] ?? null;
    },

    async findByImage(imageId: string): Promise<ImageVariant[]> {
      const result = await db.query(
        'SELECT * FROM image_variants WHERE _image = $1 ORDER BY actual_width, actual_height',
        [imageId]
      );
      return result.rows;
    },

    async findByS3Key(s3Key: string): Promise<ImageVariant | null> {
      const result = await db.query(
        'SELECT * FROM image_variants WHERE s3_key = $1',
        [s3Key]
      );
      return result.rows[0] ?? null;
    },

    /**
     * Find variant by request parameters.
     * Uses COALESCE to match null values (which represent "auto" dimensions).
     */
    async findByParams(
      imageId: string,
      reqWidth: number | null,
      reqHeight: number | null,
      format: string,
      quality: number
    ): Promise<ImageVariant | null> {
      const result = await db.query(
        `SELECT * FROM image_variants
         WHERE _image = $1
           AND COALESCE(req_width, 0) = COALESCE($2, 0)
           AND COALESCE(req_height, 0) = COALESCE($3, 0)
           AND format = $4
           AND quality = $5`,
        [imageId, reqWidth, reqHeight, format, quality]
      );
      return result.rows[0] ?? null;
    },

    async create(data: ImageVariantInsert): Promise<ImageVariant> {
      const result = await db.query(
        `INSERT INTO image_variants (
          _image, req_width, req_height, format, quality,
          actual_width, actual_height, s3_key, file_size
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          data._image,
          data.req_width,
          data.req_height,
          data.format,
          data.quality,
          data.actual_width,
          data.actual_height,
          data.s3_key,
          data.file_size,
        ]
      );
      return result.rows[0];
    },

    async update(id: string, data: ImageVariantUpdate): Promise<ImageVariant | null> {
      const fields: string[] = [];
      const values: unknown[] = [];
      let idx = 1;

      if (data._image !== undefined) {
        fields.push(`_image = $${idx++}`);
        values.push(data._image);
      }
      if (data.req_width !== undefined) {
        fields.push(`req_width = $${idx++}`);
        values.push(data.req_width);
      }
      if (data.req_height !== undefined) {
        fields.push(`req_height = $${idx++}`);
        values.push(data.req_height);
      }
      if (data.format !== undefined) {
        fields.push(`format = $${idx++}`);
        values.push(data.format);
      }
      if (data.quality !== undefined) {
        fields.push(`quality = $${idx++}`);
        values.push(data.quality);
      }
      if (data.actual_width !== undefined) {
        fields.push(`actual_width = $${idx++}`);
        values.push(data.actual_width);
      }
      if (data.actual_height !== undefined) {
        fields.push(`actual_height = $${idx++}`);
        values.push(data.actual_height);
      }
      if (data.s3_key !== undefined) {
        fields.push(`s3_key = $${idx++}`);
        values.push(data.s3_key);
      }
      if (data.file_size !== undefined) {
        fields.push(`file_size = $${idx++}`);
        values.push(data.file_size);
      }

      if (fields.length === 0) return this.findById(id);

      values.push(id);
      const result = await db.query(
        `UPDATE image_variants SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      );
      return result.rows[0] ?? null;
    },

    async delete(id: string): Promise<boolean> {
      const result = await db.query('DELETE FROM image_variants WHERE id = $1', [id]);
      return (result.rowCount ?? 0) > 0;
    },

    async deleteByImage(imageId: string): Promise<number> {
      const result = await db.query('DELETE FROM image_variants WHERE _image = $1', [imageId]);
      return result.rowCount ?? 0;
    },
  };
}
