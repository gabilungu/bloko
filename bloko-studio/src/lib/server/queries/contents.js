import { getBloko } from '$lib/server/bloko.js';

// ============================================================================
// NODE CONTENTS
// ============================================================================

/**
 * Get all contents for a node, optionally filtered by template
 * @param {string} nodeId - Node ID (UUID)
 * @param {string|null} [templateId] - Optional template ID (UUID) to filter by
 * @returns {Promise<Array>} - Array of contents keyed by block
 */
export async function getNodeContents(nodeId, templateId = null) {
	if (!nodeId) return [];

	const bloko = getBloko();
	const useExplicitTemplate = templateId != null;
	const sql = useExplicitTemplate
		? `SELECT c.id, c._block, c.value
	     FROM public.contents c
	     JOIN public.blocks b ON b.id = c._block
	     WHERE c._node = $1
	       AND b._template = $2`
		: `SELECT c.id, c._block, c.value
	     FROM public.contents c
	     JOIN public.blocks b ON b.id = c._block
	     JOIN public.nodes n ON n.id = c._node
	     WHERE c._node = $1
	       AND b._template = n._template`;

	const params = useExplicitTemplate ? [nodeId, templateId] : [nodeId];
	const res = await bloko.db.query(sql, params);

	return res.rows.map((row) => ({
		id: row.id,
		_block: row._block,
		value: row.value || {},
	}));
}

/**
 * Upsert a content value for a node-block (jsonb_translation)
 * Validates that block belongs to node's current template
 * @param {Object} params - Content parameters
 * @param {string} params._node - Node ID (UUID)
 * @param {string} params._block - Block ID (UUID)
 * @param {Object} params.value - Content value {en, ro} with JSONB data
 * @param {boolean} params.forceCreate - If true, create content even if all values are empty
 * @returns {Promise<{id: string|null, _block: string, value: Object}>}
 */
export async function upsertContent({ _node, _block, value, forceCreate = false }) {
	if (!_node || !_block) throw new Error('_node and _block are required');

	const bloko = getBloko();
	// Guard: ensure block belongs to the node's current template
	const check = await bloko.db.query(
		`SELECT
			(b._template = n._template) AS is_current_template,
			b.content_type
			 FROM public.blocks b
			 JOIN public.nodes n ON n.id = $1
			 WHERE b.id = $2`,
		[_node, _block]
	);

	const row0 = check.rows[0];
	const isCurrent = !!row0?.is_current_template;
	const contentType = row0?.content_type;

	if (!isCurrent) {
		// Block isn't in current template - delete any existing content
		await bloko.db.query(
			`DELETE FROM public.contents WHERE _node = $1 AND _block = $2`,
			[_node, _block]
		);
		return { id: null, _block, value: contentType === 'number' ? null : { en: null, ro: null } };
	}

	// Handle number type (plain number, not language-keyed)
	if (contentType === 'number') {
		const numValue = value === null || value === undefined || value === '' ? null : value;

		if (numValue === null && !forceCreate) {
			// Delete the content record
			await bloko.db.query(
				`DELETE FROM public.contents WHERE _node = $1 AND _block = $2`,
				[_node, _block]
			);
			return { id: null, _block, value: null };
		}

		// Insert or update content with plain number value
		const valueJson = JSON.stringify(numValue);
		const res = await bloko.db.query(
			`INSERT INTO public.contents (_node, _block, value)
			 VALUES ($1, $2, $3::jsonb)
			 ON CONFLICT (_node, _block) DO UPDATE
			 SET value = EXCLUDED.value
			 RETURNING id, _block, value`,
			[_node, _block, valueJson]
		);

		const row = res.rows[0];
		return {
			id: row.id,
			_block: row._block,
			value: row.value,
		};
	}

	// Handle language-keyed types (text, text_list, titled_list)
	// Normalize empty values: treat empty strings/arrays as null
	function normalize(val) {
		if (val === null || val === undefined) return null;
		if (typeof val === 'string') {
			const trimmed = val.trim();
			return trimmed.length ? trimmed : null;
		}
		if (Array.isArray(val)) {
			const cleaned = val
				.map((v) => (typeof v === 'string' ? v.trim() : v))
				.filter(
					(v) =>
						v !== null &&
						v !== undefined &&
						!(typeof v === 'string' && v.length === 0)
				);
			return cleaned.length ? cleaned : null;
		}
		return val;
	}

	const enVal = normalize(value?.en ?? null);
	const roVal = normalize(value?.ro ?? null);

	if (enVal == null && roVal == null && !forceCreate) {
		// Both values are empty - delete the content record (unless forceCreate is true)
		await bloko.db.query(
			`DELETE FROM public.contents WHERE _node = $1 AND _block = $2`,
			[_node, _block]
		);
		return { id: null, _block, value: { en: null, ro: null } };
	}

	// Insert or update content with JSONB value
	const valueJson = JSON.stringify({ en: enVal, ro: roVal });
	const res = await bloko.db.query(
		`INSERT INTO public.contents (_node, _block, value)
		 VALUES ($1, $2, $3::jsonb)
		 ON CONFLICT (_node, _block) DO UPDATE
		 SET value = EXCLUDED.value
		 RETURNING id, _block,
		           value->>'en' AS value_en, value->>'ro' AS value_ro`,
		[_node, _block, valueJson]
	);

	const row = res.rows[0];
	return {
		id: row.id,
		_block: row._block,
		value: { en: row.value_en, ro: row.value_ro },
	};
}
