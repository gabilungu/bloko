import type { DB } from '../db.js';
import type { Template, TemplateInsert, TemplateUpdate } from '../types.js';

export function templates(db: DB) {
  return {
    async findAll(): Promise<Template[]> {
      const result = await db.query('SELECT * FROM templates ORDER BY sort, code');
      return result.rows;
    },

    async findById(id: string): Promise<Template | null> {
      const result = await db.query('SELECT * FROM templates WHERE id = $1', [id]);
      return result.rows[0] ?? null;
    },

    async findByCollection(collectionId: string): Promise<Template[]> {
      const result = await db.query(
        'SELECT * FROM templates WHERE _collection = $1 ORDER BY sort, code',
        [collectionId]
      );
      return result.rows;
    },

    async findByCode(collectionId: string, code: string): Promise<Template | null> {
      const result = await db.query(
        'SELECT * FROM templates WHERE _collection = $1 AND code = $2',
        [collectionId, code]
      );
      return result.rows[0] ?? null;
    },

    async create(data: TemplateInsert): Promise<Template> {
      const result = await db.query(
        'INSERT INTO templates (_collection, code, title, sort, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [data._collection, data.code, data.title, data.sort, data.notes]
      );
      return result.rows[0];
    },

    async update(id: string, data: TemplateUpdate): Promise<Template | null> {
      const fields: string[] = [];
      const values: unknown[] = [];
      let idx = 1;

      if (data._collection !== undefined) {
        fields.push(`_collection = $${idx++}`);
        values.push(data._collection);
      }
      if (data.code !== undefined) {
        fields.push(`code = $${idx++}`);
        values.push(data.code);
      }
      if (data.title !== undefined) {
        fields.push(`title = $${idx++}`);
        values.push(data.title);
      }
      if (data.sort !== undefined) {
        fields.push(`sort = $${idx++}`);
        values.push(data.sort);
      }
      if (data.notes !== undefined) {
        fields.push(`notes = $${idx++}`);
        values.push(data.notes);
      }

      if (fields.length === 0) return this.findById(id);

      values.push(id);
      const result = await db.query(
        `UPDATE templates SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      );
      return result.rows[0] ?? null;
    },

    async delete(id: string): Promise<boolean> {
      const result = await db.query('DELETE FROM templates WHERE id = $1', [id]);
      return (result.rowCount ?? 0) > 0;
    },
  };
}
