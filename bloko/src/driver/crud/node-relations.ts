import type { DB } from '../db.js';
import type { NodeRelation, NodeRelationInsert, NodeRelationUpdate } from '../types.js';

export function nodeRelations(db: DB) {
  return {
    async findAll(): Promise<NodeRelation[]> {
      const result = await db.query('SELECT * FROM node_relations');
      return result.rows;
    },

    async findById(id: string): Promise<NodeRelation | null> {
      const result = await db.query('SELECT * FROM node_relations WHERE id = $1', [id]);
      return result.rows[0] ?? null;
    },

    async findByFrom(fromNodeId: string): Promise<NodeRelation[]> {
      const result = await db.query(
        'SELECT * FROM node_relations WHERE _from = $1',
        [fromNodeId]
      );
      return result.rows;
    },

    async findByTo(toNodeId: string): Promise<NodeRelation[]> {
      const result = await db.query(
        'SELECT * FROM node_relations WHERE _to = $1',
        [toNodeId]
      );
      return result.rows;
    },

    async findByType(typeId: string): Promise<NodeRelation[]> {
      const result = await db.query(
        'SELECT * FROM node_relations WHERE _node_relation_type = $1',
        [typeId]
      );
      return result.rows;
    },

    async findByNodes(fromNodeId: string, toNodeId: string): Promise<NodeRelation[]> {
      const result = await db.query(
        'SELECT * FROM node_relations WHERE _from = $1 AND _to = $2',
        [fromNodeId, toNodeId]
      );
      return result.rows;
    },

    async create(data: NodeRelationInsert): Promise<NodeRelation> {
      const result = await db.query(
        'INSERT INTO node_relations (_from, _to, _node_relation_type) VALUES ($1, $2, $3) RETURNING *',
        [data._from, data._to, data._node_relation_type]
      );
      return result.rows[0];
    },

    async update(id: string, data: NodeRelationUpdate): Promise<NodeRelation | null> {
      const fields: string[] = [];
      const values: unknown[] = [];
      let idx = 1;

      if (data._from !== undefined) {
        fields.push(`_from = $${idx++}`);
        values.push(data._from);
      }
      if (data._to !== undefined) {
        fields.push(`_to = $${idx++}`);
        values.push(data._to);
      }
      if (data._node_relation_type !== undefined) {
        fields.push(`_node_relation_type = $${idx++}`);
        values.push(data._node_relation_type);
      }

      if (fields.length === 0) return this.findById(id);

      values.push(id);
      const result = await db.query(
        `UPDATE node_relations SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      );
      return result.rows[0] ?? null;
    },

    async delete(id: string): Promise<boolean> {
      const result = await db.query('DELETE FROM node_relations WHERE id = $1', [id]);
      return (result.rowCount ?? 0) > 0;
    },
  };
}
