import { getBloko } from '$lib/server/bloko.js';

// ============================================================================
// CONTENT TYPES ENUM
// ============================================================================

/**
 * Get all content type ENUM values from database with description
 */
export async function getContentTypes() {
	const bloko = getBloko();

	// Get ENUM values
	const enumRes = await bloko.db.query(`
		SELECT unnest(enum_range(NULL::public.content_type))::text as id
		ORDER BY id
	`);

	// Get TYPE description/comment
	const commentRes = await bloko.db.query(`
		SELECT obj_description('public.content_type'::regtype) as description
	`);

	const description = commentRes.rows[0]?.description || '';

	// Parse examples from description
	const examples = {};
	const lines = description.split('\n');
	for (const line of lines) {
		const match = line.match(/- (\w+): (.+)/);
		if (match) {
			examples[match[1]] = match[2];
		}
	}

	return enumRes.rows.map(row => ({
		id: row.id,
		example: examples[row.id] || null
	}));
}
