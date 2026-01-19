/**
 * Get localized value from a multilingual field
 * @param {any} value - The value (string, object with lang keys, or array)
 * @param {string} lang - The language code (e.g., 'en', 'ro')
 * @returns {any} The localized value
 */
export function t(value, lang) {
	if (!value) return null;
	if (typeof value === 'string') return value;
	if (Array.isArray(value)) return value;
	if (typeof value === 'object') {
		return value[lang] || value.en || Object.values(value)[0];
	}
	return value;
}
