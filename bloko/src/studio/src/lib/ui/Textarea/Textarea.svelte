<script>
	/**
	 * @typedef {Object} TextareaProps
	 * @property {string} [placeholder='']
	 * @property {string} [value='']
	 * @property {number} [rows=3]
	 * @property {number} [cols]
	 * @property {boolean} [disabled=false]
	 * @property {boolean} [required=false]
	 * @property {boolean} [resize=true]
	 * @property {string} [name='']
	 * @property {string} [id='']
	 * @property {(event: Event) => void} [oninput]
	 * @property {(event: Event) => void} [onchange]
	 * @property {(event: FocusEvent) => void} [onfocus]
	 * @property {(event: FocusEvent) => void} [onblur]
	 * @property {'default' | 'accent'} [variant='default']
	 * @property {'24' | '28' | '32' | '40'} [size='32']
	 */

	/** @type {TextareaProps} */
	let {
		placeholder = '',
		// switch to bindable value so parent can bind:value
		value = $bindable(''),
		rows = 3,
		cols,
		disabled = false,
		required = false,
		resize = true,
		name = '',
		id = '',
		oninput,
		onchange,
		onfocus,
		onblur,
		variant = 'default',
		size = '32',
	} = $props();
</script>

<textarea
	class="textarea {resize
		? 'resizable'
		: 'no-resize'} variant-{variant} size-{size}"
	{placeholder}
	bind:value
	{rows}
	{cols}
	{disabled}
	{required}
	{name}
	{id}
	{oninput}
	{onchange}
	{onfocus}
	{onblur}
></textarea>

<style>
	.textarea {
		border: none;
		font-weight: 400;
		transition: all 0.2s ease;
		font-family: inherit;
		outline: none;
		font-size: 14px;
		border-radius: 6px;
		line-height: 1.5;
		min-height: 80px;
		width: 100%;
		box-sizing: border-box;
	}

	/* Size variants (match Input padding/font sizes) */
	.size-24 {
		padding: 6px;
		font-size: 12px;
		border-radius: 4px;
	}
	.size-28 {
		padding: 8px;
		font-size: 13px;
		border-radius: 5px;
	}
	.size-32 {
		padding: 10px;
		font-size: 14px;
		border-radius: 6px;
	}
	.size-40 {
		padding: 12px;
		font-size: 16px;
		border-radius: 8px;
	}

	/* Resize options */
	.resizable {
		resize: vertical;
	}

	.no-resize {
		resize: none;
	}

	/* Base styles */
	.textarea {
		background: var(--base0);
		color: var(--base900);
		border: 1px solid var(--base200);
	}

	/* Variant: accent */
	.textarea.variant-accent {
		background: var(--accent100);
		color: var(--accent700);
		border: 1px solid var(--accent300);
	}
	.textarea.variant-accent::placeholder {
		color: var(--accent300);
		opacity: 1;
	}

	/* Focus state */
	.textarea:focus {
		border-color: var(--focus500);
		box-shadow: 0 0 0 2px var(--focus400);
	}

	/* Placeholder styles */
	.textarea::placeholder {
		color: var(--base500);
		opacity: 1;
	}

	/* Disabled state */
	.textarea:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: var(--base100);
		resize: none;
	}
</style>
