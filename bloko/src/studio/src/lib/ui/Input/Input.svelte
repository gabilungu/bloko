<script>
	/**
	 * @typedef {Object} InputProps
	 * @property {string} [placeholder='']
	 * @property {string} [value='']
	 * @property {'default' | 'accent'} [variant='default']
	 * @property {'24' | '28' | '32' | '40'} [size='32']
	 * @property {'text' | 'password' | 'number'} [type='text']
	 * @property {boolean} [disabled=false]
	 * @property {boolean} [required=false]
	 * @property {string} [name='']
	 * @property {string} [id='']
	 * @property {(event: Event) => void} [oninput]
	 * @property {(event: Event) => void} [onchange]
	 * @property {(event: FocusEvent) => void} [onfocus]
	 * @property {(event: FocusEvent) => void} [onblur]
	 */

	/** @type {InputProps} */
	let {
		placeholder = '',
		value = $bindable(''),
		size = '32',
		type = 'text',
		disabled = false,
		required = false,
		name = '',
		id = '',
		oninput,
		onchange,
		onfocus,
		onblur,
		variant = 'default',
	} = $props();
</script>

<input
	class="size-{size} variant-{variant}"
	{type}
	{placeholder}
	bind:value
	{disabled}
	{required}
	{name}
	{id}
	{oninput}
	{onchange}
	{onfocus}
	{onblur}
/>

<style>
	input {
		border: none;
		font-weight: 400;
		transition: all 0.2s ease;
		font-family: inherit;
		outline: none;
	}

	/* Size variants */
	.size-24 {
		height: 24px;
		padding: 0 6px;
		font-size: 12px;
		border-radius: 4px;
	}

	.size-28 {
		height: 28px;
		padding: 0 8px;
		font-size: 13px;
		border-radius: 5px;
	}

	.size-32 {
		height: 32px;
		padding: 0 10px;
		font-size: 14px;
		border-radius: 6px;
	}

	.size-40 {
		height: 40px;
		padding: 0 12px;
		font-size: 16px;
		border-radius: 8px;
	}

	/* Base styles (variant-default) */
	input {
		background: var(--base0);
		color: var(--base900);
		border: 1px solid var(--base200);
		width: 100%;
	}

	/* Variant: accent */
	input.variant-accent {
		background: var(--accent100);
		color: var(--accent700);
		border: 1px solid var(--accent300);
	}

	input.variant-accent::placeholder {
		color: var(--accent300);
		opacity: 1;
	}

	/* Focus state */
	input:focus {
		border-color: var(--focus500);
		box-shadow: 0 0 0 2px var(--focus400);
	}

	/* Placeholder styles */
	input::placeholder {
		color: var(--base500);
		opacity: 1;
	}

	/* Disabled state */
	input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: var(--base100);
	}
</style>
