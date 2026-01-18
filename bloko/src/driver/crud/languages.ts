import type { DB } from '../db.js';
import type { Language, LanguageInsert, LanguageUpdate } from '../types.js';

export function languages(db: DB) {
  return {
    async findAll(): Promise<Language[]> {
      const result = await db.query('SELECT * FROM languages ORDER BY sort, id');
      return result.rows;
    },

    async findById(id: string): Promise<Language | null> {
      const result = await db.query('SELECT * FROM languages WHERE id = $1', [id]);
      return result.rows[0] ?? null;
    },

    async create(data: LanguageInsert): Promise<Language> {
      const result = await db.query(
        'INSERT INTO languages (id, title, sort) VALUES ($1, $2, $3) RETURNING *',
        [data.id, data.title, data.sort]
      );
      return result.rows[0];
    },

    async update(id: string, data: LanguageUpdate): Promise<Language | null> {
      const fields: string[] = [];
      const values: unknown[] = [];
      let idx = 1;

      if (data.title !== undefined) {
        fields.push(`title = $${idx++}`);
        values.push(data.title);
      }
      if (data.sort !== undefined) {
        fields.push(`sort = $${idx++}`);
        values.push(data.sort);
      }

      if (fields.length === 0) return this.findById(id);

      values.push(id);
      const result = await db.query(
        `UPDATE languages SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      );
      return result.rows[0] ?? null;
    },

    async delete(id: string): Promise<boolean> {
      const result = await db.query('DELETE FROM languages WHERE id = $1', [id]);
      return (result.rowCount ?? 0) > 0;
    },
  };
}
