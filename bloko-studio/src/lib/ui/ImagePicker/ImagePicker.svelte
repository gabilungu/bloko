<script>
	import Button from '../Button/Button.svelte';

	/**
	 * @typedef {Object} ImagePickerProps
	 * @property {string|null} [value] - Current image ID
	 * @property {string|null} [imageUrl] - Current image URL for preview
	 * @property {Array<{id: string, url: string, file_name: string}>} [images] - Available images
	 * @property {(imageId: string|null) => void} [onchange] - Called when selection changes
	 * @property {(file: File) => Promise<{id: string, url: string}>} [onupload] - Called to upload new image
	 * @property {boolean} [disabled=false]
	 */

	/** @type {ImagePickerProps} */
	let {
		value = null,
		imageUrl = null,
		images = [],
		onchange,
		onupload,
		disabled = false,
	} = $props();

	let showPicker = $state(false);
	let uploading = $state(false);
	let inputEl;

	function openPicker() {
		if (disabled) return;
		showPicker = true;
	}

	function closePicker() {
		showPicker = false;
	}

	function selectImage(imageId, url) {
		onchange?.(imageId);
		closePicker();
	}

	function clearImage() {
		if (disabled) return;
		onchange?.(null);
	}

	function openFilePicker() {
		inputEl?.click();
	}

	async function onFileInput(e) {
		const file = e.target.files?.[0];
		if (!file || !onupload) return;

		uploading = true;
		try {
			const result = await onupload(file);
			if (result?.id) {
				onchange?.(result.id);
				closePicker();
			}
		} catch (err) {
			console.error('Upload failed:', err);
		} finally {
			uploading = false;
			if (inputEl) inputEl.value = '';
		}
	}

	function handleKeydown(e) {
		if (e.key === 'Escape') {
			closePicker();
		}
	}
</script>

<svelte:window onkeydown={showPicker ? handleKeydown : undefined} />

<div class="image-picker">
	{#if imageUrl}
		<div class="preview-container">
			<img class="preview" src={imageUrl} alt="" />
			<div class="overlay">
				<Button
					label="Change"
					size="28"
					intent="primary"
					onclick={openPicker}
					{disabled}
				/>
				<Button
					label="Remove"
					size="28"
					intent="danger"
					onclick={clearImage}
					{disabled}
				/>
			</div>
		</div>
	{:else}
		<button
			class="empty-state"
			onclick={openPicker}
			{disabled}
			type="button"
		>
			<div class="icon">🖼️</div>
			<div class="text">Select cover image</div>
		</button>
	{/if}

	<input
		bind:this={inputEl}
		type="file"
		accept="image/*"
		onchange={onFileInput}
		hidden
	/>
</div>

{#if showPicker}
	<div class="modal-backdrop" onclick={closePicker} role="presentation">
		<div class="modal" onclick={(e) => e.stopPropagation()} role="dialog">
			<div class="modal-header">
				<h3>Select Image</h3>
				<button class="close-btn" onclick={closePicker} type="button">×</button>
			</div>

			<div class="modal-body">
				<div class="upload-section">
					<Button
						label={uploading ? "Uploading..." : "Upload New Image"}
						size="32"
						intent="primary"
						onclick={openFilePicker}
						disabled={uploading}
					/>
				</div>

				{#if images.length > 0}
					<div class="divider">
						<span>or select from library</span>
					</div>

					<div class="image-grid">
						{#each images as image}
							<button
								class="image-item"
								class:selected={value === image.id}
								onclick={() => selectImage(image.id, image.url)}
								type="button"
							>
								<img src={image.url} alt={image.file_name} />
								{#if value === image.id}
									<div class="selected-badge">✓</div>
								{/if}
							</button>
						{/each}
					</div>
				{:else}
					<div class="no-images">
						<p>No images in library yet.</p>
						<p>Upload your first image above.</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.image-picker {
		width: 100%;
	}

	.preview-container {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 8px;
		overflow: hidden;
		background: var(--base100);
	}

	.preview {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.overlay {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		gap: 8px;
		justify-content: center;
		padding: 12px;
		background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 100%);
		opacity: 0;
		transition: opacity 0.2s;
	}

	.preview-container:hover .overlay {
		opacity: 1;
	}

	.empty-state {
		width: 100%;
		aspect-ratio: 16 / 9;
		border: 2px dashed var(--base300);
		border-radius: 8px;
		background: var(--base50);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		cursor: pointer;
		transition: border-color 0.2s, background 0.2s;
	}

	.empty-state:hover:not(:disabled) {
		border-color: var(--accent500);
		background: var(--base100);
	}

	.empty-state:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.empty-state .icon {
		font-size: 32px;
	}

	.empty-state .text {
		font-size: 13px;
		color: var(--base500);
	}

	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal {
		background: var(--base0);
		border-radius: 12px;
		width: 90%;
		max-width: 600px;
		max-height: 80vh;
		display: flex;
		flex-direction: column;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 20px;
		border-bottom: 1px solid var(--base200);
	}

	.modal-header h3 {
		margin: 0;
		font-size: 16px;
		font-weight: 600;
		color: var(--base900);
	}

	.close-btn {
		width: 32px;
		height: 32px;
		border: none;
		background: none;
		font-size: 24px;
		color: var(--base500);
		cursor: pointer;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-btn:hover {
		background: var(--base100);
		color: var(--base700);
	}

	.modal-body {
		padding: 20px;
		overflow-y: auto;
	}

	.upload-section {
		display: flex;
		justify-content: center;
	}

	.divider {
		display: flex;
		align-items: center;
		gap: 12px;
		margin: 20px 0;
		color: var(--base400);
		font-size: 12px;
	}

	.divider::before,
	.divider::after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--base200);
	}

	.image-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 12px;
	}

	.image-item {
		position: relative;
		aspect-ratio: 1;
		border: 2px solid var(--base200);
		border-radius: 8px;
		overflow: hidden;
		cursor: pointer;
		padding: 0;
		background: var(--base100);
		transition: border-color 0.2s;
	}

	.image-item:hover {
		border-color: var(--accent500);
	}

	.image-item.selected {
		border-color: var(--accent500);
		border-width: 3px;
	}

	.image-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.selected-badge {
		position: absolute;
		top: 6px;
		right: 6px;
		width: 24px;
		height: 24px;
		background: var(--accent500);
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		font-weight: bold;
	}

	.no-images {
		text-align: center;
		padding: 40px 20px;
		color: var(--base500);
	}

	.no-images p {
		margin: 4px 0;
	}
</style>
