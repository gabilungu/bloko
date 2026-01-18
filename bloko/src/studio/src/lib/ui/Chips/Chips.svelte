<script>
	/**
	 * @typedef {Object} ChipOption
	 * @property {string} value
	 * @property {string} label
	 * @property {string} [background]  // selected background color
	 * @property {string} [foreground]  // selected text color
	 * @property {string} [color]       // deprecated; treated as background
	 * @property {boolean} [disabled]
	 */

	/**
	 * @typedef {Object} ChipsProps
	 * @property {string} [value=''] - selected value (controlled)
	 * @property {boolean} [nullable=true] - allow deselect to null
	 * @property {16|20|24|28} [size=20] - same sizing as Badge
	 * @property {Array<ChipOption>} [options=[]]
	 * @property {(val: string|null) => void} [onchange]
	 */

	/** @type {ChipsProps} */
	let {
		value = $bindable(''),
		nullable = true,
		size = 20,
		options = [],
		onchange,
	} = $props();

	function toggle(val) {
		if (value === val) {
			value = nullable ? '' : value;
		} else {
			value = val;
		}
		onchange?.(value || null);
	}

	function bg(opt) {
		return opt.background ?? opt.color ?? 'var(--base900)';
	}
	function fg(opt) {
		return opt.foreground ?? 'var(--base0)';
	}
</script>

<div class="chips" role="tablist" aria-label="Chips">
	{#each options as opt}
		<!-- Set variables per item for selected and unselected states -->
		<button
			class="chip size-{size} {value === opt.value ? 'active' : ''}"
			style={`--chip-bg:${bg(opt)}; --chip-fg:${fg(opt)}; --chip-unselected-bg:${fg(opt)}; --chip-unselected-fg:${bg(opt)}; --chip-border:${bg(opt)};`}
			type="button"
			disabled={opt.disabled}
			aria-pressed={value === opt.value}
			onclick={() => toggle(opt.value)}
		>
			{opt.label}
		</button>
	{/each}
</div>

<style>
	.chips {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		white-space: nowrap;
		font-weight: 600; /* match Badge */
		cursor: pointer;
		transition: all 0.15s ease;
		border: 2px solid var(--chip-border, transparent);
		background: var(--chip-unselected-bg, var(--base0));
		color: var(--chip-unselected-fg, var(--base900));
		padding: 0 12px; /* default overridden by size classes */
		border-radius: 14px; /* default overridden by size classes */
	}

	/* Match Badge sizes exactly */
	.chip.size-16 {
		height: 16px;
		font-size: 10px;
		padding: 0 6px;
		border-radius: 8px;
	}
	.chip.size-20 {
		height: 20px;
		font-size: 12px;
		padding: 0 8px;
		border-radius: 10px;
	}
	.chip.size-24 {
		height: 24px;
		font-size: 13px;
		padding: 0 10px;
		border-radius: 12px;
	}
	.chip.size-28 {
		height: 28px;
		font-size: 14px;
		padding: 0 12px;
		border-radius: 14px;
	}

	/* Hover - keep scheme but soften */
	.chip:hover:not(:disabled):not(.active) {
		filter: brightness(0.98);
	}

	/* Selected state: bg=background, text=foreground, border hidden */
	.chip.active {
		background: var(--chip-bg);
		color: var(--chip-fg);
		border-color: transparent;
	}

	.chip:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
