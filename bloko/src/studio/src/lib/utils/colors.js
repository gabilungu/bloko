/**
 * Generate a consistent hue (0-360) from a string
 * @param {string} str - Input string
 * @returns {number} - Hue value between 0 and 360
 */
export function stringToHue(str) {
	if (!str) return 0;

	// Simple hash function
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
		hash = hash & hash; // Convert to 32bit integer
	}

	// Map hash to 0-360 range
	return Math.abs(hash % 360);
}

/**
 * Generate HSL color from a string
 * @param {string} str - Input string
 * @param {number} saturation - Saturation percentage (0-100), default 70
 * @param {number} lightness - Lightness percentage (0-100), default 50
 * @returns {string} - HSL color string
 */
export function stringToHSL(str, saturation = 70, lightness = 50) {
	const hue = stringToHue(str);
	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Generate background and foreground colors for badges from a string
 * @param {string} str - Input string
 * @returns {{background: string, foreground: string}} - Background and foreground colors
 */
export function stringToBadgeColors(str) {
	const hue = stringToHue(str);
	return {
		background: `hsl(${hue}, 70%, 50%)`,
		foreground: `hsl(${hue}, 10%, 98%)`
	};
}
