<script>
	/**
	 * @typedef {Object} FormFieldProps
	 * @property {string} [label='']
	 * @property {'14' | '16' | '18'} [labelFontSize='16']
	 * @property {boolean} [required=false]
	 * @property {string} [helperText='']
	 * @property {'12' | '14'} [helperFontSize='12']
	 * @property {'default' | 'info' | 'success' | 'warning' | 'danger'} [intent='default']
	 */

	/** @type {FormFieldProps} */
	let { label = '', labelFontSize = '14', required = false, helperText = '', helperFontSize = '12', intent = 'default', children } = $props();
</script>

<label class="form-field label-size-{labelFontSize}">
	{#if label}
		<div class="label">
			{#if required}<span class="required">*</span>{/if}
			{label}
		</div>
	{/if}

	<div class="input-wrapper">
		{#if children}
			{@render children()}
		{/if}
	</div>

	{#if helperText}
		<div class="helper-text helper-size-{helperFontSize} {intent}">
			{helperText}
		</div>
	{/if}
</label>

<style>
	.form-field {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 100%;
	}

	/* Label font sizes */
	.label-size-14 .label {
		font-size: 14px;
	}

	.label-size-16 .label {
		font-size: 16px;
	}

	.label-size-18 .label {
		font-size: 18px;
	}

	.label {
		font-weight: 500;
		color: var(--accent600);
		display: flex;
		align-items: center;
		gap: 2px;
	}

	.required {
		color: var(--danger500);
		font-weight: 600;
	}

	.input-wrapper {
		display: contents;
	}

	/* Helper text font sizes */
	.helper-size-12 {
		font-size: 12px;
	}

	.helper-size-14 {
		font-size: 14px;
	}

	.helper-text {
		margin-top: 2px;
		line-height: 1.4;
	}

	/* Helper text intent colors */
	.helper-text.default {
		color: var(--base500);
	}

	.helper-text.info {
		color: var(--info600);
	}

	.helper-text.success {
		color: var(--success600);
	}

	.helper-text.warning {
		color: var(--warning600);
	}

	.helper-text.danger {
		color: var(--danger600);
	}
</style>
