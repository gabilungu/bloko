import type { DB } from '../db.js';
import type { NodeRelationType, NodeRelationTypeInsert, NodeRelationTypeUpdate } from '../types.js';

export function nodeRelationTypes(db: DB) {
  return {
    async findAll(): Promise<NodeRelationType[]> {
      const result = await db.query('SELECT * FROM node_relation_types ORDER BY code');
      return result.rows;
    },

    async findById(id: string): Promise<NodeRelationType | null> {
      const result = await db.query('SELECT * FROM node_relation_types WHERE id = $1', [id]);
      return result.rows[0] ?? null;
    },

    async findByCollection(collectionId: string): Promise<NodeRelationType[]> {
      const result = await db.query(
        'SELECT * FROM node_relation_types WHERE _collection = $1 ORDER BY code',
        [collectionId]
      );
      return result.rows;
    },

    async findByCode(collectionId: string, code: string): Promise<NodeRelationType | null> {
      const result = await db.query(
        'SELECT * FROM node_relation_types WHERE _collection = $1 AND code = $2',
        [collectionId, code]
      );
      return result.rows[0] ?? null;
    },

    async create(data: NodeRelationTypeInsert): Promise<NodeRelationType> {
      const result = await db.query(
        `INSERT INTO node_relation_types (_collection, code, title, reverse_title, notes)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [data._collection, data.code, data.title, data.reverse_title, data.notes]
      );
      return result.rows[0];
    },

    async update(id: string, data: NodeRelationTypeUpdate): Promise<NodeRelationType | null> {
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
      if (data.reverse_title !== undefined) {
        fields.push(`reverse_title = $${idx++}`);
        values.push(data.reverse_title);
      }
      if (data.notes !== undefined) {
        fields.push(`notes = $${idx++}`);
        values.push(data.notes);
      }

      if (fields.length === 0) return this.findById(id);

      values.push(id);
      const result = await db.query(
        `UPDATE node_relation_types SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      );
      return result.rows[0] ?? null;
    },

    async delete(id: string): Promise<boolean> {
      const result = await db.query('DELETE FROM node_relation_types WHERE id = $1', [id]);
      return (result.rowCount ?? 0) > 0;
    },
  };
}
