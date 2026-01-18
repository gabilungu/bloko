import type { DB } from '../db.js';
import type { ImageVariant, ImageVariantInsert, ImageVariantUpdate } from '../types.js';

export function imageVariants(db: DB) {
  return {
    async findAll(): Promise<ImageVariant[]> {
      const result = await db.query('SELECT * FROM image_variants ORDER BY width, height');
      return result.rows;
    },

    async findById(id: string): Promise<ImageVariant | null> {
      const result = await db.query('SELECT * FROM image_variants WHERE id = $1', [id]);
      return result.rows[0] ?? null;
    },

    async findByImage(imageId: string): Promise<ImageVariant[]> {
      const result = await db.query(
        'SELECT * FROM image_variants WHERE _image = $1 ORDER BY width, height',
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

    async findByDimensions(imageId: string, width: number, height: number, format: string): Promise<ImageVariant | null> {
      const result = await db.query(
        'SELECT * FROM image_variants WHERE _image = $1 AND width = $2 AND height = $3 AND format = $4',
        [imageId, width, height, format]
      );
      return result.rows[0] ?? null;
    },

    async create(data: ImageVariantInsert): Promise<ImageVariant> {
      const result = await db.query(
        `INSERT INTO image_variants (_image, width, height, s3_key, format, file_size)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [data._image, data.width, data.height, data.s3_key, data.format, data.file_size]
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
      if (data.width !== undefined) {
        fields.push(`width = $${idx++}`);
        values.push(data.width);
      }
      if (data.height !== undefined) {
        fields.push(`height = $${idx++}`);
        values.push(data.height);
      }
      if (data.s3_key !== undefined) {
        fields.push(`s3_key = $${idx++}`);
        values.push(data.s3_key);
      }
      if (data.format !== undefined) {
        fields.push(`format = $${idx++}`);
        values.push(data.format);
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
