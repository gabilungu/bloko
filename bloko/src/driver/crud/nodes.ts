import type { DB } from '../db.js';
import type { Node, NodeInsert, NodeUpdate, NodePositionUpdate } from '../types.js';

export function nodes(db: DB) {
  return {
    async findAll(): Promise<Node[]> {
      const result = await db.query('SELECT * FROM nodes ORDER BY sort, code');
      return result.rows;
    },

    async findById(id: string): Promise<Node | null> {
      const result = await db.query('SELECT * FROM nodes WHERE id = $1', [id]);
      return result.rows[0] ?? null;
    },

    async findByCollection(collectionId: string): Promise<Node[]> {
      const result = await db.query(
        'SELECT * FROM nodes WHERE _collection = $1 ORDER BY sort, code',
        [collectionId]
      );
      return result.rows;
    },

    async findByCode(collectionId: string, code: string): Promise<Node | null> {
      const result = await db.query(
        'SELECT * FROM nodes WHERE _collection = $1 AND code = $2',
        [collectionId, code]
      );
      return result.rows[0] ?? null;
    },

    async findChildren(parentId: string): Promise<Node[]> {
      const result = await db.query(
        'SELECT * FROM nodes WHERE _parent = $1 ORDER BY sort, code',
        [parentId]
      );
      return result.rows;
    },

    async findRoots(collectionId: string): Promise<Node[]> {
      const result = await db.query(
        'SELECT * FROM nodes WHERE _collection = $1 AND _parent IS NULL ORDER BY sort, code',
        [collectionId]
      );
      return result.rows;
    },

    async findBySlug(lang: string, slug: string, parentId: string | null): Promise<Node | null> {
      const result = parentId
        ? await db.query(
            `SELECT * FROM nodes WHERE slug->>$1 = $2 AND _parent = $3`,
            [lang, slug, parentId]
          )
        : await db.query(
            `SELECT * FROM nodes WHERE slug->>$1 = $2 AND _parent IS NULL`,
            [lang, slug]
          );
      return result.rows[0] ?? null;
    },

    async findByTemplate(templateId: string): Promise<Node[]> {
      const result = await db.query(
        'SELECT * FROM nodes WHERE _template = $1 ORDER BY sort, code',
        [templateId]
      );
      return result.rows;
    },

    async findByNodeType(nodeTypeId: string): Promise<Node[]> {
      const result = await db.query(
        'SELECT * FROM nodes WHERE _node_type = $1 ORDER BY sort, code',
        [nodeTypeId]
      );
      return result.rows;
    },

    /**
     * Find the root ancestor of a node (the top-level node in the hierarchy).
     * Returns the node's own ID if it's already a root node.
     */
    async findRootAncestor(nodeId: string): Promise<string | null> {
      const result = await db.query(
        `WITH RECURSIVE ancestors AS (
          SELECT id, _parent FROM nodes WHERE id = $1
          UNION ALL
          SELECT n.id, n._parent FROM nodes n
          INNER JOIN ancestors a ON n.id = a._parent
        )
        SELECT id FROM ancestors WHERE _parent IS NULL LIMIT 1`,
        [nodeId]
      );
      return result.rows[0]?.id ?? null;
    },

    async create(data: NodeInsert): Promise<Node> {
      // Auto-calculate sort if not provided
      let sort = data.sort;
      if (sort === undefined || sort === null) {
        const sortResult = data._parent
          ? await db.query(
              'SELECT COALESCE(MAX(sort), -1) + 1 AS next_sort FROM nodes WHERE _parent = $1',
              [data._parent]
            )
          : await db.query(
              'SELECT COALESCE(MAX(sort), -1) + 1 AS next_sort FROM nodes WHERE _collection = $1 AND _parent IS NULL',
              [data._collection]
            );
        sort = sortResult.rows[0]?.next_sort ?? 0;
      }

      const result = await db.query(
        `INSERT INTO nodes (_collection, _template, _node_type, _parent, code, title, subtitle, slug, sort, sort_children_by, _cover_image, _images, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13) RETURNING *`,
        [
          data._collection, data._template, data._node_type, data._parent,
          data.code, data.title, data.subtitle, data.slug, sort, data.sort_children_by,
          data._cover_image, data._images ? JSON.stringify(data._images) : null, data.notes
        ]
      );
      return result.rows[0];
    },

    async update(id: string, data: NodeUpdate): Promise<Node | null> {
      const fields: string[] = [];
      const values: unknown[] = [];
      let idx = 1;

      if (data._collection !== undefined) {
        fields.push(`_collection = $${idx++}`);
        values.push(data._collection);
      }
      if (data._template !== undefined) {
        fields.push(`_template = $${idx++}`);
        values.push(data._template);
      }
      if (data._node_type !== undefined) {
        fields.push(`_node_type = $${idx++}`);
        values.push(data._node_type);
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
      if (data.subtitle !== undefined) {
        fields.push(`subtitle = $${idx++}`);
        values.push(data.subtitle);
      }
      if (data.slug !== undefined) {
        fields.push(`slug = $${idx++}`);
        values.push(data.slug);
      }
      if (data.sort !== undefined) {
        fields.push(`sort = $${idx++}`);
        values.push(data.sort);
      }
      if (data.sort_children_by !== undefined) {
        fields.push(`sort_children_by = $${idx++}`);
        values.push(data.sort_children_by);
      }
      if (data._cover_image !== undefined) {
        fields.push(`_cover_image = $${idx++}`);
        values.push(data._cover_image);
      }
      if (data._images !== undefined) {
        fields.push(`_images = $${idx++}::jsonb`);
        values.push(data._images ? JSON.stringify(data._images) : null);
      }
      if (data.notes !== undefined) {
        fields.push(`notes = $${idx++}`);
        values.push(data.notes);
      }

      if (fields.length === 0) return this.findById(id);

      values.push(id);
      const result = await db.query(
        `UPDATE nodes SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      );
      return result.rows[0] ?? null;
    },

    async delete(id: string): Promise<boolean> {
      const result = await db.query('DELETE FROM nodes WHERE id = $1', [id]);
      return (result.rowCount ?? 0) > 0;
    },

    /**
     * Batch update positions (parent and sort) for multiple nodes.
     * Used for drag-and-drop reordering.
     * Validates against circular references.
     */
    async updatePositions(updates: NodePositionUpdate[]): Promise<void> {
      if (!updates.length) return;

      // Use a transaction
      const client = await db.connect();
      try {
        await client.query('BEGIN');

        // Build batch update using unnest for efficiency
        const ids = updates.map(u => u.id);
        const parents = updates.map(u => u._parent);
        const sorts = updates.map(u => u.sort);

        await client.query(
          `UPDATE nodes
           SET _parent = data.parent_id,
               sort = data.sort
           FROM (
             SELECT unnest($1::uuid[]) as node_id,
                    unnest($2::uuid[]) as parent_id,
                    unnest($3::integer[]) as sort
           ) as data
           WHERE id = data.node_id`,
          [ids, parents, sorts]
        );

        // Validate no cycles were created
        for (const update of updates) {
          if (update._parent) {
            // Check if the new parent is a descendant of the node (would create cycle)
            const cycleCheck = await client.query(
              `WITH RECURSIVE ancestors AS (
                SELECT id, _parent FROM nodes WHERE id = $1
                UNION ALL
                SELECT n.id, n._parent FROM nodes n
                INNER JOIN ancestors a ON n.id = a._parent
              )
              SELECT 1 FROM ancestors WHERE id = $2 LIMIT 1`,
              [update._parent, update.id]
            );
            if (cycleCheck.rows.length > 0) {
              throw new Error(`Circular reference: node ${update.id} cannot have ${update._parent} as parent`);
            }
          }
        }

        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    },
  };
}
