import type { DB } from '../db.js';
import type { Block, BlockInsert, BlockUpdate } from '../types.js';

export function blocks(db: DB) {
  return {
    async findAll(): Promise<Block[]> {
      const result = await db.query('SELECT * FROM blocks ORDER BY sort, code');
      return result.rows;
    },

    async findById(id: string): Promise<Block | null> {
      const result = await db.query('SELECT * FROM blocks WHERE id = $1', [id]);
      return result.rows[0] ?? null;
    },

    async findByTemplate(templateId: string): Promise<Block[]> {
      const result = await db.query(
        'SELECT * FROM blocks WHERE _template = $1 ORDER BY sort, code',
        [templateId]
      );
      return result.rows;
    },

    async findByCode(templateId: string, code: string): Promise<Block | null> {
      const result = await db.query(
        'SELECT * FROM blocks WHERE _template = $1 AND code = $2',
        [templateId, code]
      );
      return result.rows[0] ?? null;
    },

    async findChildren(parentId: string): Promise<Block[]> {
      const result = await db.query(
        'SELECT * FROM blocks WHERE _parent = $1 ORDER BY sort, code',
        [parentId]
      );
      return result.rows;
    },

    async create(data: BlockInsert): Promise<Block> {
      const result = await db.query(
        'INSERT INTO blocks (_template, _parent, code, title, content_type, sort, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [data._template, data._parent, data.code, data.title, data.content_type, data.sort, data.notes]
      );
      return result.rows[0];
    },

    async update(id: string, data: BlockUpdate): Promise<Block | null> {
      const fields: string[] = [];
      const values: unknown[] = [];
      let idx = 1;

      if (data._template !== undefined) {
        fields.push(`_template = $${idx++}`);
        values.push(data._template);
      }
      if (data._parent !== undefined) {
        fields.push(`_parent = $${idx++}`);
        values.push(data._parent);
      }
      if (data.code !== undefined) {
        fields.push(`code = $${idx++}`);
        values.push(data.code);
      }
      if (data.title !== undefined) {
        fields.push(`title = $${idx++}`);
        values.push(data.title);
      }
      if (data.content_type !== undefined) {
        fields.push(`content_type = $${idx++}`);
        values.push(data.content_type);
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
        `UPDATE blocks SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      );
      return result.rows[0] ?? null;
    },

    async delete(id: string): Promise<boolean> {
      const result = await db.query('DELETE FROM blocks WHERE id = $1', [id]);
      return (result.rowCount ?? 0) > 0;
    },
  };
}
