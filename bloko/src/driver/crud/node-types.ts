import type { DB } from '../db.js';
import type { NodeType, NodeTypeInsert, NodeTypeUpdate } from '../types.js';

export function nodeTypes(db: DB) {
  return {
    async findAll(): Promise<NodeType[]> {
      const result = await db.query('SELECT * FROM node_types ORDER BY sort, code');
      return result.rows;
    },

    async findById(id: string): Promise<NodeType | null> {
      const result = await db.query('SELECT * FROM node_types WHERE id = $1', [id]);
      return result.rows[0] ?? null;
    },

    async findByCode(code: string): Promise<NodeType | null> {
      const result = await db.query('SELECT * FROM node_types WHERE code = $1', [code]);
      return result.rows[0] ?? null;
    },

    async create(data: NodeTypeInsert): Promise<NodeType> {
      const result = await db.query(
        'INSERT INTO node_types (code, title, sort, notes) VALUES ($1, $2, $3, $4) RETURNING *',
        [data.code, data.title, data.sort, data.notes]
      );
      return result.rows[0];
    },

    async update(id: string, data: NodeTypeUpdate): Promise<NodeType | null> {
      const fields: string[] = [];
      const values: unknown[] = [];
      let idx = 1;

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
        `UPDATE node_types SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      );
      return result.rows[0] ?? null;
    },

    async delete(id: string): Promise<boolean> {
      const result = await db.query('DELETE FROM node_types WHERE id = $1', [id]);
      return (result.rowCount ?? 0) > 0;
    },
  };
}
