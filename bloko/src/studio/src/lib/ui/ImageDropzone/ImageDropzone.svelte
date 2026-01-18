<script>
	import Button from '../Button/Button.svelte';

	/**
	 * @typedef {Object} ImageDropzoneProps
	 * @property {string} [src] - Current image URL to preview
	 * @property {(file: File|null) => void} [onchange] - Called when user selects, replaces, or deletes
	 * @property {boolean} [disabled=false]
	 * @property {string} [accept='image/*']
	 * @property {'24'|'28'|'32'|'40'} [actionSize='28'] - Size for the action buttons
	 */

	/** @type {ImageDropzoneProps} */
	let {
		src = $bindable(''),
		onchange,
		disabled = false,
		accept = 'image/*',
		actionSize = '28',
	} = $props();

	let inputEl;
	let dragging = $state(false);
	let objectUrl = $state(''); // for revoking created previews

	function openPicker() {
		if (disabled) return;
		inputEl?.click();
	}

	function clearImage() {
		if (disabled) return;
		if (objectUrl) URL.revokeObjectURL(objectUrl);
		objectUrl = '';
		src = '';
		onchange?.(null);
	}

	function setFile(file) {
		if (!file) return;
		if (!file.type?.startsWith('image/')) return;
		if (objectUrl) URL.revokeObjectURL(objectUrl);
		const nextUrl = URL.createObjectURL(file);
		objectUrl = nextUrl;
		src = nextUrl;
		onchange?.(file);
	}

	function onFileInput(e) {
		const file = e.target.files?.[0];
		if (file) setFile(file);
		// reset input so selecting same file again still triggers change
		if (inputEl) inputEl.value = '';
	}

	function onDragOver(e) {
		if (disabled) return;
		e.preventDefault();
		e.stopPropagation();
		dragging = true;
	}

	function onDragLeave(e) {
		if (disabled) return;
		e.preventDefault();
		e.stopPropagation();
		dragging = false;
	}

	function onDrop(e) {
		if (disabled) return;
		e.preventDefault();
		e.stopPropagation();
		dragging = false;
		const file = e.dataTransfer?.files?.[0];
		if (file) setFile(file);
	}

	$effect(() => () => {
		if (objectUrl) URL.revokeObjectURL(objectUrl);
	});
</script>

<div
	class="dropzone"
	class:dragging
	class:disabled
	role="button"
	tabindex={disabled ? -1 : 0}
	ondragover={onDragOver}
	ondragleave={onDragLeave}
	ondrop={onDrop}
	onclick={(e) => {
		if (!src && e.currentTarget === e.target) openPicker();
	}}
	onkeydown={(e) => {
		if (!src && (e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault();
			openPicker();
		}
	}}
	aria-disabled={disabled}
>
	{#if src}
		<img
			class="preview"
			{src}
			alt=""
			aria-hidden="true"
			draggable="false"
		/>
		<div class="overlay">
			<Button
				label="Replace"
				size={actionSize}
				intent="primary"
				onclick={openPicker}
				{disabled}
			/>
			<Button
				label="Delete"
				size={actionSize}
				intent="danger"
				onclick={clearImage}
				{disabled}
			/>
		</div>
	{:else}
		<div class="empty">
			<div class="icon">🖼️</div>
			<div class="text">Drop image here or</div>
			<Button
				label="Browse"
				size={actionSize}
				intent="primary"
				onclick={openPicker}
				{disabled}
			/>
		</div>
	{/if}

	<input
		bind:this={inputEl}
		type="file"
		{accept}
		onchange={onFileInput}
		hidden
	/>
</div>

<style>
	.dropzone {
		position: relative;
		width: 100%;
		aspect-ratio: 1 / 1;
		border: 2px dashed var(--base300);
		border-radius: 8px;
		background: var(--base0);
		color: var(--base600);
		display: grid;
		place-items: center;
		overflow: hidden;
		cursor: pointer;
		transition:
			border-color 0.15s ease,
			background 0.15s ease;
		user-select: none;
	}

	.dropzone:hover {
		border-color: var(--accent500);
	}
	.dropzone.dragging {
		border-color: var(--focus500);
		background: var(--base50);
	}
	.dropzone.disabled {
		opacity: 0.6;
		pointer-events: none;
	}

	.empty {
		display: grid;
		place-items: center;
		gap: 6px;
		text-align: center;
		padding: 12px;
	}
	.empty .icon {
		font-size: 28px;
		line-height: 1;
	}
	.empty .text {
		font-size: 12px;
		color: var(--base500);
	}

	.preview {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		pointer-events: none;
	}

	.overlay {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		gap: 8px;
		justify-content: center;
		padding: 8px;
		background: linear-gradient(
			180deg,
			rgba(0, 0, 0, 0) 0%,
			rgba(0, 0, 0, 0.35) 100%
		);
	}
</style>
