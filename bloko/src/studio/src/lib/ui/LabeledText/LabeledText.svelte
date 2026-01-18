<script>
	/**
	 * @typedef {Object} LabeledTextProps
	 * @property {string} label - The label text
	 * @property {string} text - The main text content
	 * @property {string} [gap='0px'] - CSS gap value between label and text
	 * @property {string} [labelSize='12px'] - Font size for the label
	 * @property {string} [textSize='14px'] - Font size for the text
	 * @property {string} [labelColor='var(--base400)'] - Color for the label
	 * @property {string} [textColor='var(--base1000)'] - Color for the text
	 */

	/** @type {LabeledTextProps} */
	let {
		label,
		text,
		gap = '0px',
		labelSize = '12px',
		textSize = '14px',
		labelColor = 'var(--base400)',
		textColor = 'var(--base1000)',
	} = $props();
</script>

<div class="labeled-text" style:gap>
	<span class="label" style:font-size={labelSize} style:color={labelColor}>
		{label}
	</span>
	<span class="text" style:font-size={textSize} style:color={textColor}>
		{text}
	</span>
</div>

<style>
	.labeled-text {
		display: flex;
		flex-direction: column;
	}

	.label {
		font-weight: 500;
		line-height: 1.4;
	}

	.text {
		font-weight: 400;
	}
</style>
