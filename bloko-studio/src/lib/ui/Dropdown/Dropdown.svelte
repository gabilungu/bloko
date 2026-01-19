<script>
	/**
	 * @typedef {Object} DropdownOption
	 * @property {string} value
	 * @property {string} label
	 */

	/**
	 * @typedef {Object} DropdownProps
	 * @property {DropdownOption[]} [options=[]]
	 * @property {string} [value='']
	 * @property {string} [placeholder='Select...']
	 * @property {'24' | '28' | '32' | '40'} [size='32']
	 * @property {'default' | 'success' | 'danger'} [intent='default']
	 * @property {boolean} [disabled=false]
	 * @property {boolean} [required=false]
	 * @property {string} [name='']
	 * @property {string} [id='']
	 * @property {(value: string, event: Event) => void} [onchange]
	 */

	/** @type {DropdownProps} */
	let {
		options = [],
		value = $bindable(''),
		placeholder = 'Select...',
		size = '32',
		intent = 'default',
		disabled = false,
		required = false,
		name = '',
		id = '',
		onchange,
	} = $props();

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function handleChange(event) {
		// value is bound to the select, so it is up-to-date here
		const current = value;
		onchange?.(current, event);
		dispatch('change', { value: current, originalEvent: event });
	}
</script>

<select
	class="dropdown size-{size} {intent}"
	bind:value
	{disabled}
	{required}
	{name}
	{id}
	onchange={handleChange}
>
	{#if placeholder}
		<option value="" disabled selected={value === ''}>{placeholder}</option>
	{/if}
	{#each options as option}
		<option value={option.value}>{option.label}</option>
	{/each}
</select>

<style>
	.dropdown {
		border: none;
		font-weight: 400;
		transition: all 0.2s ease;
		font-family: inherit;
		outline: none;
		cursor: pointer;
		background-color: var(--base0);
		appearance: none;
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 8px center;
		background-size: 16px;
		padding-right: 32px;
		width: 100%;
	}

	/* Size variants */
	.size-24 {
		height: 24px;
		padding: 0 32px 0 6px;
		font-size: 12px;
		border-radius: 4px;
	}

	.size-28 {
		height: 28px;
		padding: 0 32px 0 8px;
		font-size: 13px;
		border-radius: 5px;
	}

	.size-32 {
		height: 32px;
		padding: 0 32px 0 10px;
		font-size: 14px;
		border-radius: 6px;
	}

	.size-40 {
		height: 40px;
		padding: 0 32px 0 12px;
		font-size: 16px;
		border-radius: 8px;
	}

	/* Intent colors */
	.default {
		color: var(--base900);
		border: 1px solid var(--base200);
	}

	.success {
		color: var(--base900);
		border: 1px solid var(--base200);
	}

	.danger {
		color: var(--base900);
		border: 1px solid var(--base200);
	}

	/* Focus states */
	.default:focus {
		border-color: var(--focus500);
		box-shadow: 0 0 0 2px var(--focus400);
	}

	.success:focus {
		border-color: var(--success500);
		box-shadow: 0 0 0 2px var(--success400);
	}

	.danger:focus {
		border-color: var(--danger500);
		box-shadow: 0 0 0 2px var(--danger400);
	}

	/* Disabled state */
	.dropdown:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background-color: var(--base100);
	}

	/* Placeholder option styling */
	option[disabled] {
		color: var(--base500);
	}
</style>
