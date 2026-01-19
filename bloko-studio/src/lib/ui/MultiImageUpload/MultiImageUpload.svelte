<script>
	import Button from '../Button/Button.svelte';

	/**
	 * @typedef {Object} MultiImageUploadProps
	 * @property {Array<{id: string, url: string, file_name?: string}>} [images] - Current images with URLs
	 * @property {(file: File) => Promise<{id: string, url: string}>} [onupload] - Called to upload new image
	 * @property {(imageId: string) => Promise<void>} [ondelete] - Called to delete an image
	 * @property {boolean} [disabled=false]
	 */

	/** @type {MultiImageUploadProps} */
	let {
		images = [],
		onupload,
		ondelete,
		disabled = false,
	} = $props();

	let inputEl;
	let uploading = $state(false);
	let dragging = $state(false);

	function openPicker() {
		if (disabled || uploading) return;
		inputEl?.click();
	}

	async function handleFiles(files) {
		if (!files?.length || !onupload || disabled) return;

		uploading = true;
		try {
			for (const file of files) {
				if (!file.type?.startsWith('image/')) continue;
				await onupload(file);
			}
		} catch (err) {
			console.error('Upload failed:', err);
		} finally {
			uploading = false;
			if (inputEl) inputEl.value = '';
		}
	}

	function onFileInput(e) {
		handleFiles(e.target.files);
	}

	function onDragOver(e) {
		if (disabled || uploading) return;
		e.preventDefault();
		e.stopPropagation();
		dragging = true;
	}

	function onDragLeave(e) {
		e.preventDefault();
		e.stopPropagation();
		dragging = false;
	}

	function onDrop(e) {
		if (disabled || uploading) return;
		e.preventDefault();
		e.stopPropagation();
		dragging = false;
		handleFiles(e.dataTransfer?.files);
	}

	async function handleDelete(imageId) {
		if (disabled || !ondelete) return;
		if (!confirm('Remove this image?')) return;
		await ondelete(imageId);
	}
</script>

<div
	class="gallery"
	class:dragging
	class:disabled
	role="region"
	aria-label="Multi-image upload area"
	ondragover={onDragOver}
	ondragleave={onDragLeave}
	ondrop={onDrop}
>
	{#if images.length > 0}
		<div class="imageGrid">
			{#each images as image}
				<div class="imageItem">
					<img src={image.url} alt={image.file_name || ''} />
					{#if ondelete && !disabled}
						<button
							class="deleteBtn"
							onclick={() => handleDelete(image.id)}
							type="button"
							aria-label="Remove image"
						>
							&times;
						</button>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<div class="uploadArea" class:empty={images.length === 0}>
		{#if uploading}
			<div class="uploadingText">Uploading...</div>
		{:else}
			<div class="uploadPrompt">
				<span class="dropText">Drop images here or</span>
				<Button
					label="Browse"
					size="28"
					intent="secondary"
					onclick={openPicker}
					{disabled}
				/>
			</div>
		{/if}
	</div>

	<input
		bind:this={inputEl}
		type="file"
		accept="image/*"
		multiple
		onchange={onFileInput}
		hidden
	/>
</div>

<style>
	.gallery {
		border: 2px dashed var(--base300);
		border-radius: 8px;
		padding: 16px;
		background: var(--base0);
		transition: border-color 0.15s, background 0.15s;
	}

	.gallery:hover {
		border-color: var(--accent500);
	}

	.gallery.dragging {
		border-color: var(--focus500);
		background: var(--base50);
	}

	.gallery.disabled {
		opacity: 0.6;
		pointer-events: none;
	}

	.imageGrid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 12px;
		margin-bottom: 16px;
	}

	.imageItem {
		position: relative;
		aspect-ratio: 1;
		border-radius: 6px;
		overflow: hidden;
		background: var(--base100);
	}

	.imageItem img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.deleteBtn {
		position: absolute;
		top: 4px;
		right: 4px;
		width: 24px;
		height: 24px;
		border: none;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.6);
		color: white;
		font-size: 16px;
		line-height: 1;
		cursor: pointer;
		opacity: 0;
		transition: opacity 0.15s, background 0.15s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.imageItem:hover .deleteBtn {
		opacity: 1;
	}

	.deleteBtn:hover {
		background: var(--danger500);
	}

	.uploadArea {
		display: flex;
		justify-content: center;
		padding: 12px;
	}

	.uploadArea.empty {
		padding: 32px;
	}

	.uploadPrompt {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.dropText {
		font-size: 13px;
		color: var(--base500);
	}

	.uploadingText {
		font-size: 13px;
		color: var(--base600);
	}
</style>
