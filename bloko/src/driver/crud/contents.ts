import type { DB } from '../db.js';
import type { Content, ContentInsert, ContentUpdate } from '../types.js';

export function contents(db: DB) {
  return {
    async findAll(): Promise<Content[]> {
      const result = await db.query('SELECT * FROM contents');
      return result.rows;
    },

    async findById(id: string): Promise<Content | null> {
      const result = await db.query('SELECT * FROM contents WHERE id = $1', [id]);
      return result.rows[0] ?? null;
    },

    async findByNode(nodeId: string): Promise<Content[]> {
      const result = await db.query(
        'SELECT * FROM contents WHERE _node = $1',
        [nodeId]
      );
      return result.rows;
    },

    async findByBlock(blockId: string): Promise<Content[]> {
      const result = await db.query(
        'SELECT * FROM contents WHERE _block = $1',
        [blockId]
      );
      return result.rows;
    },

    async findByNodeAndBlock(nodeId: string, blockId: string): Promise<Content | null> {
      const result = await db.query(
        'SELECT * FROM contents WHERE _node = $1 AND _block = $2',
        [nodeId, blockId]
      );
      return result.rows[0] ?? null;
    },

    async create(data: ContentInsert): Promise<Content> {
      const result = await db.query(
        'INSERT INTO contents (_node, _block, value) VALUES ($1, $2, $3) RETURNING *',
        [data._node, data._block, JSON.stringify(data.value)]
      );
      return result.rows[0];
    },

    async upsert(data: ContentInsert): Promise<Content> {
      const result = await db.query(
        `INSERT INTO contents (_node, _block, value) VALUES ($1, $2, $3)
         ON CONFLICT (_node, _block) DO UPDATE SET value = $3
         RETURNING *`,
        [data._node, data._block, JSON.stringify(data.value)]
      );
      return result.rows[0];
    },

    async update(id: string, data: ContentUpdate): Promise<Content | null> {
      const fields: string[] = [];
      const values: unknown[] = [];
      let idx = 1;

      if (data._node !== undefined) {
        fields.push(`_node = $${idx++}`);
        values.push(data._node);
      }
      if (data._block !== undefined) {
        fields.push(`_block = $${idx++}`);
        values.push(data._block);
      }
      if (data.value !== undefined) {
        fields.push(`value = $${idx++}`);
        values.push(JSON.stringify(data.value));
      }

      if (fields.length === 0) return this.findById(id);

      values.push(id);
      const result = await db.query(
        `UPDATE contents SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      );
      return result.rows[0] ?? null;
    },

    async delete(id: string): Promise<boolean> {
      const result = await db.query('DELETE FROM contents WHERE id = $1', [id]);
      return (result.rowCount ?? 0) > 0;
    },

    async deleteByNode(nodeId: string): Promise<number> {
      const result = await db.query('DELETE FROM contents WHERE _node = $1', [nodeId]);
      return result.rowCount ?? 0;
    },
  };
}
