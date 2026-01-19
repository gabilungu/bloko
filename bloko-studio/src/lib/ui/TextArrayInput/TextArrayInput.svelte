<script>
	/**
	 * TextArrayInput
	 * A small helper to edit an array of strings with add/remove, keyboard support, and blur save.
	 *
	 * Props:
	 * - value: string[] (not bindable here; parent should pass value and handle on:input)
	 * - placeholder: string for new items
	 * - onblur: optional callback when the entire array loses focus (e.g., to save)
	 * - disabled: boolean
	 * - name/id: optional
	 * - size: '24' | '28' | '32' | '40' (affects input height)
	 */
	import { createEventDispatcher } from 'svelte';
	import { Button } from '$lib/ui';
	const dispatch = createEventDispatcher();
	let {
		value = [],
		placeholder = 'add item…',
		onblur,
		disabled = false,
		name = '',
		id = '',
		size = '32',
	} = $props();

	function addAtEnd() {
		if (disabled) return;
		value = [...value, ''];
		dispatch('input', { value });
		queueMicrotask(() => {
			const inputs = /** @type {HTMLInputElement[]} */ (
				Array.from(container.querySelectorAll('input.item'))
			);
			inputs[inputs.length - 1]?.focus();
		});
	}

	function removeAt(idx) {
		if (disabled) return;
		value = value.filter((_, i) => i !== idx);
		dispatch('input', { value });
	}

	function setAt(idx, v) {
		value = value.map((it, i) => (i === idx ? v : it));
		dispatch('input', { value });
	}

	function handleKey(e, idx) {
		if (disabled) return;
		if (e.key === 'Enter') {
			e.preventDefault();
			if (idx === value.length - 1) addAtEnd();
		}
		if (e.key === 'Backspace') {
			const input = /** @type {HTMLInputElement} */ (e.currentTarget);
			if (input.value === '' && value.length > 1) {
				e.preventDefault();
				removeAt(idx);
				queueMicrotask(() => {
					const inputs = /** @type {HTMLInputElement[]} */ (
						Array.from(container.querySelectorAll('input.item'))
					);
					inputs[Math.min(idx, inputs.length - 1)]?.focus();
				});
			}
		}
	}

	function onItemBlur() {
		if (typeof onblur === 'function') onblur(new Event('blur'));
	}

	let container;
</script>

<div class="text-array size-{size}" bind:this={container} {name} {id}>
	{#each value as item, i}
		<div class="row">
			<input
				class="item"
				type="text"
				value={item}
				{disabled}
				oninput={(e) => setAt(i, e.currentTarget.value)}
				onkeydown={(e) => handleKey(e, i)}
				{placeholder}
				onblur={onItemBlur}
			/>
			<Button
				label="×"
				intent="danger"
				size="24"
				type="button"
				{disabled}
				onclick={() => removeAt(i)}
				aria-label="Remove"
			/>
		</div>
	{/each}
	<div class="actions">
		<Button
			label="+ Add"
			intent="secondary"
			{size}
			type="button"
			onclick={addAtEnd}
			{disabled}
		/>
	</div>
</div>

<style>
	.text-array {
		display: grid;
		gap: 6px;
	}
	.row {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 6px;
		align-items: center;
	}
	.item {
		border: 1px solid var(--base200);
		border-radius: 6px;
		background: var(--base0);
		color: var(--base900);
		padding: 8px 10px;
		font-size: 14px;
		outline: none;
		width: 100%;
		box-sizing: border-box;
	}
	/* Size variants (match Input component sizing) */
	.size-24 .item {
		height: 24px;
		padding: 0 6px;
		font-size: 12px;
		border-radius: 4px;
	}
	.size-28 .item {
		height: 28px;
		padding: 0 8px;
		font-size: 13px;
		border-radius: 5px;
	}
	.size-32 .item {
		height: 32px;
		padding: 0 10px;
		font-size: 14px;
		border-radius: 6px;
	}
	.size-40 .item {
		height: 40px;
		padding: 0 12px;
		font-size: 16px;
		border-radius: 8px;
	}

	.item:focus {
		border-color: var(--focus500);
		box-shadow: 0 0 0 2px var(--focus400);
	}
	.remove,
	.add {
		border: 1px solid var(--base200);
		background: var(--base0);
		color: var(--base900);
		border-radius: 6px;
		padding: 6px 10px;
		cursor: pointer;
	}

	.remove:disabled,
	.add:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	.actions {
		display: flex;
		justify-content: flex-start;
	}
</style>
