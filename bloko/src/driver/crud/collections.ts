import type { DB } from '../db.js';
import type { Collection, CollectionInsert, CollectionUpdate } from '../types.js';

export function collections(db: DB) {
  return {
    async findAll(): Promise<Collection[]> {
      const result = await db.query('SELECT * FROM collections ORDER BY sort, code');
      return result.rows;
    },

    async findById(id: string): Promise<Collection | null> {
      const result = await db.query('SELECT * FROM collections WHERE id = $1', [id]);
      return result.rows[0] ?? null;
    },

    async findByCode(code: string): Promise<Collection | null> {
      const result = await db.query('SELECT * FROM collections WHERE code = $1', [code]);
      return result.rows[0] ?? null;
    },

    async create(data: CollectionInsert): Promise<Collection> {
      // Auto-calculate sort if not provided
      let sort = data.sort;
      if (sort === undefined || sort === null) {
        const sortResult = await db.query(
          'SELECT COALESCE(MAX(sort), -1) + 1 AS next_sort FROM collections'
        );
        sort = sortResult.rows[0]?.next_sort ?? 0;
      }

      const result = await db.query(
        'INSERT INTO collections (code, sort, notes) VALUES ($1, $2, $3) RETURNING *',
        [data.code, sort, data.notes]
      );
      return result.rows[0];
    },

    async update(id: string, data: CollectionUpdate): Promise<Collection | null> {
      const fields: string[] = [];
      const values: unknown[] = [];
      let idx = 1;

      if (data.code !== undefined) {
        fields.push(`code = $${idx++}`);
        values.push(data.code);
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
        `UPDATE collections SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      );
      return result.rows[0] ?? null;
    },

    async delete(id: string): Promise<boolean> {
      const result = await db.query('DELETE FROM collections WHERE id = $1', [id]);
      return (result.rowCount ?? 0) > 0;
    },
  };
}
