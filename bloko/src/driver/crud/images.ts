import type { DB } from '../db.js';
import type { Image, ImageInsert, ImageUpdate } from '../types.js';

export function images(db: DB) {
  return {
    async findAll(): Promise<Image[]> {
      const result = await db.query('SELECT * FROM images ORDER BY file_name');
      return result.rows;
    },

    async findById(id: string): Promise<Image | null> {
      const result = await db.query('SELECT * FROM images WHERE id = $1', [id]);
      return result.rows[0] ?? null;
    },

    async findByCollection(collectionId: string): Promise<Image[]> {
      const result = await db.query(
        'SELECT * FROM images WHERE _collection = $1 ORDER BY file_name',
        [collectionId]
      );
      return result.rows;
    },

    async findByS3Key(s3Key: string): Promise<Image | null> {
      const result = await db.query(
        'SELECT * FROM images WHERE s3_key = $1',
        [s3Key]
      );
      return result.rows[0] ?? null;
    },

    async create(data: ImageInsert): Promise<Image> {
      const result = await db.query(
        `INSERT INTO images (_collection, s3_key, file_name, mime_type, format, file_size, width, height, caption, credit)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [
          data._collection, data.s3_key, data.file_name, data.mime_type,
          data.format, data.file_size, data.width, data.height,
          data.caption, data.credit
        ]
      );
      return result.rows[0];
    },

    async update(id: string, data: ImageUpdate): Promise<Image | null> {
      const fields: string[] = [];
      const values: unknown[] = [];
      let idx = 1;

      if (data._collection !== undefined) {
        fields.push(`_collection = $${idx++}`);
        values.push(data._collection);
      }
      if (data.s3_key !== undefined) {
        fields.push(`s3_key = $${idx++}`);
        values.push(data.s3_key);
      }
      if (data.file_name !== undefined) {
        fields.push(`file_name = $${idx++}`);
        values.push(data.file_name);
      }
      if (data.mime_type !== undefined) {
        fields.push(`mime_type = $${idx++}`);
        values.push(data.mime_type);
      }
      if (data.format !== undefined) {
        fields.push(`format = $${idx++}`);
        values.push(data.format);
      }
      if (data.file_size !== undefined) {
        fields.push(`file_size = $${idx++}`);
        values.push(data.file_size);
      }
      if (data.width !== undefined) {
        fields.push(`width = $${idx++}`);
        values.push(data.width);
      }
      if (data.height !== undefined) {
        fields.push(`height = $${idx++}`);
        values.push(data.height);
      }
      if (data.caption !== undefined) {
        fields.push(`caption = $${idx++}`);
        values.push(data.caption);
      }
      if (data.credit !== undefined) {
        fields.push(`credit = $${idx++}`);
        values.push(data.credit);
      }

      if (fields.length === 0) return this.findById(id);

      values.push(id);
      const result = await db.query(
        `UPDATE images SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      );
      return result.rows[0] ?? null;
    },

    async delete(id: string): Promise<boolean> {
      const result = await db.query('DELETE FROM images WHERE id = $1', [id]);
      return (result.rowCount ?? 0) > 0;
    },
  };
}
