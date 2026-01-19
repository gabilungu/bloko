<script>
	import { Input, Checkbox } from '$lib/ui';
	import { tick } from 'svelte';

	/**
	 * DynamicField
	 * Renders an input control based on a provided primitive type and coerces the bound value accordingly.
	 *
	 * Binding
	 * - bind:type: control the field type externally ('string' | 'number' | 'boolean' | 'strings_array' | 'object').
	 * - bind:value: read/write the current value; coerced to the selected type.
	 */

	/**
	 * @typedef {'string'|'number'|'boolean'|'strings_array'|'object'} DynamicFieldType
	 */

	/**
	 * @typedef {Object} DynamicFieldProps
	 * @property {DynamicFieldType} [type='string'] Field type that decides the rendered control
	 * @property {string|number|boolean|string[]|Record<string, unknown>|null} [value=null] Current value; will be coerced to the selected type
	 */

	/** @type {DynamicFieldProps} */
	let {
		// one of: 'string' | 'number' | 'boolean' | 'strings_array' | 'object'
		type = $bindable('string'),
		value = $bindable(null),
	} = $props();

	// strings_array helpers
	let newItem = $state('');

	function arraysEqual(a, b) {
		if (a === b) return true;
		if (!Array.isArray(a) || !Array.isArray(b)) return false;
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) {
			if (a[i] !== b[i]) return false;
		}
		return true;
	}

	// object helpers
	let newKey = $state('');
	let newVal = $state('');

	function isPlainObject(o) {
		return o != null && typeof o === 'object' && !Array.isArray(o);
	}

	$effect(() => {
		// Coerce value to the selected type, but only assign when it actually changes
		if (type === 'string') {
			const s = value == null ? '' : String(value);
			if (value !== s) value = s;
		} else if (type === 'number') {
			const n = Number.isFinite(/** @type {any} */ (value))
				? Number(value)
				: Number.parseFloat(value ?? 0);
			const nf = Number.isNaN(n) ? 0 : n;
			if (value !== nf) value = nf;
		} else if (type === 'boolean') {
			const b = Boolean(value);
			if (value !== b) value = b;
		} else if (type === 'strings_array') {
			const src = Array.isArray(value) ? value : [];
			const coerced = src
				.map((v) => String(v))
				.filter((v) => v.length > 0);
			if (!arraysEqual(value, coerced)) value = coerced;
		} else if (type === 'object') {
			if (!isPlainObject(value)) value = {};
		}
	});

	// strings_array actions
	async function addItemFromInput() {
		const t = newItem.trim();
		if (!t) return;
		const arr = Array.isArray(value) ? value : [];
		value = [...arr, t];
		newItem = '';
		await tick();
	}

	function removeAt(index) {
		if (!Array.isArray(value)) return;
		value = value.filter((_, i) => i !== index);
	}

	function handleArrayKeydown(e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addItemFromInput();
		}
	}

	// object actions
	async function addPair() {
		const k = newKey.trim();
		if (!k) return;
		const v = newVal; // keep as string for compact editor
		const o = isPlainObject(value) ? { ...value } : {};
		o[k] = v;
		value = o;
		newKey = '';
		newVal = '';
		await tick();
	}

	function removeKey(key) {
		if (!isPlainObject(value)) return;
		const o = { ...value };
		delete o[key];
		value = o;
	}

	function setKey(oldKey, nextKey) {
		const k = String(nextKey).trim();
		if (!isPlainObject(value) || !oldKey || k === oldKey) return;
		const o = { ...value };
		const val = o[oldKey];
		delete o[oldKey];
		o[k] = val;
		value = o;
	}

	function setVal(key, nextVal) {
		if (!isPlainObject(value)) return;
		const o = { ...value, [key]: nextVal };
		value = o;
	}

	function handleObjectKeydown(e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addPair();
		}
	}
</script>

<div class="dynamic-field">
	{#if type === 'string'}
		<Input size="28" bind:value />
	{:else if type === 'number'}
		<Input size="28" type="number" step="any" bind:value />
	{:else if type === 'boolean'}
		<Checkbox
			checked={Boolean(value)}
			onchange={(e) =>
				(value = /** @type {HTMLInputElement} */ (e.currentTarget)
					.checked)}
		/>
	{:else if type === 'strings_array'}
		<div class="array-editor" role="group" onkeydown={handleArrayKeydown}>
			<div class="row">
				<Input
					size="24"
					placeholder="Add item..."
					bind:value={newItem}
				/>
				<button
					class="add"
					aria-label="Add"
					title="Add"
					onclick={addItemFromInput}>+</button
				>
			</div>
			{#if Array.isArray(value) && value.length}
				<div class="items">
					{#each value as item, i}
						<span class="pill">
							{item}
							<button
								class="del"
								aria-label="Remove"
								title="Remove"
								onclick={() => removeAt(i)}>×</button
							>
						</span>
					{/each}
				</div>
			{/if}
		</div>
	{:else if type === 'object'}
		<div class="object-editor" role="group" onkeydown={handleObjectKeydown}>
			<div class="row">
				<Input size="24" placeholder="key" bind:value={newKey} />
				<Input size="24" placeholder="value" bind:value={newVal} />
				<button
					class="add"
					aria-label="Add"
					title="Add"
					onclick={addPair}>+</button
				>
			</div>
			{#if isPlainObject(value) && Object.keys(value).length}
				<div class="entries">
					{#each Object.entries(/** @type {Record<string,unknown>} */ (value)) as [k, val] (k)}
						<div class="entry">
							<Input
								size="24"
								value={k}
								oninput={(e) => setKey(k, e.target.value)}
							/>
							<Input
								size="24"
								value={String(val ?? '')}
								oninput={(e) => setVal(k, e.target.value)}
							/>
							<button
								class="del"
								aria-label="Remove"
								title="Remove"
								onclick={() => removeKey(k)}>×</button
							>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.dynamic-field {
		display: grid;
	}
	/* strings_array */
	.array-editor {
		display: grid;
		gap: 6px;
	}
	.row {
		display: flex;
		gap: 6px;
		align-items: center;
	}
	.add {
		appearance: none;
		border: 1px solid var(--base300);
		background: var(--base0);
		color: var(--base800);
		border-radius: 6px;
		height: 24px;
		padding: 0 8px;
		cursor: pointer;
		line-height: 1;
	}
	.add:hover {
		border-color: var(--base400);
	}
	.items {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 2px 6px;
		border: 1px solid var(--base300);
		border-radius: 10px;
		font-size: 12px;
		color: var(--base800);
		background: var(--base0);
	}
	.del {
		appearance: none;
		border: none;
		background: transparent;
		color: var(--base600);
		cursor: pointer;
		padding: 0 2px;
		line-height: 1;
		font-size: 14px;
	}
	.del:hover {
		color: var(--danger500);
	}
	/* object */
	.object-editor {
		display: grid;
		gap: 6px;
	}
	.entries {
		display: grid;
		gap: 6px;
	}
	.entry {
		display: grid;
		grid-template-columns: 1fr 1fr auto;
		gap: 6px;
		align-items: center;
	}
</style>
