<script>
	/**
	 * @typedef {Object} SelectableItemProps
	 * @property {boolean} [selected=false]
	 * @property {boolean} [disabled=false]
	 * @property {string} [hoverBg='var(--action100)']
	 * @property {string} [hoverColor='inherit']
	 * @property {string} [selectedBg='var(--focus400)']
	 * @property {string} [selectedColor='var(--focus800)']
	 * @property {string} [selectedBorder='var(--focus500)']
	 * @property {(event: MouseEvent) => void} [onclick]
	 * @property {string} [id]
	 * @property {string} [className]
	 * @property {string} [ariaLabel]
	 * @property {any} [children]
	 */

	/** @type {SelectableItemProps} */
	let {
		selected = $bindable(false),
		disabled = false,
		hoverBg = 'var(--action100)',
		hoverColor = 'inherit',
		selectedBg = 'var(--focus400)',
		selectedColor = 'var(--focus900)',
		selectedBorder = 'var(--focus500)',
		onclick,
		id = '',
		className = '',
		ariaLabel = '',
		children = null,
	} = $props();

	function handleClick(event) {
		if (disabled) return;
		selected = !selected;
		onclick?.(event);
	}
</script>

<button
	class="selectable {selected ? 'selected' : ''} {className}"
	type="button"
	{disabled}
	onclick={handleClick}
	{id}
	aria-pressed={selected}
	aria-label={ariaLabel}
	style:--hover-bg={hoverBg}
	style:--hover-color={hoverColor}
	style:--selected-bg={selectedBg}
	style:--selected-color={selectedColor}
	style:--selected-border={selectedBorder}
>
	{@render children?.()}
</button>

<style>
	.selectable {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		height: 28px;
		padding: 0 8px;
		border-radius: 4px;
		border: 1px solid #e6e6ea;
		background: white;
		color: var(--base900);
		font-size: 13px;
		font-weight: normal;
		font-style: normal;
		line-height: 1;
		cursor: pointer;
		transition:
			background-color 100ms ease,
			box-shadow 100ms ease;
		flex-grow: 0;
		flex-shrink: 0;
	}

	.selectable:hover:not(:disabled):not(.selected) {
		background: var(--hover-bg, var(--action100));
		color: var(--hover-color, inherit);
	}

	.selectable.selected {
		background: var(--selected-bg, var(--focus400));
		color: var(--selected-color, var(--focus800));
		border: 1px solid var(--selected-border, var(--focus500));
	}

	.selectable:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.selectable:focus-visible {
		outline: 2px solid var(--focus400);
		outline-offset: 0;
	}
</style>
