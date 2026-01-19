<script>
	import { page } from '$app/stores';
	import { goto, invalidate } from '$app/navigation';
	import { notifications } from '$lib/ui/Notification/Notification.svelte';
	import { deleteImage } from './data.remote.js';

	let { data } = $props();

	let selectedId = $derived($page.params.sid || null);
	let deletingOrphans = $state(false);

	function selectImage(id) {
		// If clicking the same image, deselect it
		if (selectedId === id) {
			goto(`/images`);
		} else {
			goto(`/images/${id}`);
		}
	}

	function getImageUrl(s3Key) {
		return `${data.s3BaseUrl}/${s3Key}`;
	}

	function getImageThumbnail(image) {
		// Use the original image s3_key directly
		return image.s3_key ? getImageUrl(image.s3_key) : '';
	}

	async function deleteOrphan(imageId) {
		if (!confirm('Delete this orphaned image?')) return;

		try {
			await deleteImage({ id: imageId });
			await invalidate('app:images');
			notifications.success('Image deleted');
		} catch (err) {
			notifications.error(err.message || 'Failed to delete image');
		}
	}

	async function deleteAllOrphans() {
		if (!confirm(`Delete all ${data.orphanImages.length} orphaned images? This cannot be undone.`)) return;

		deletingOrphans = true;
		try {
			for (const image of data.orphanImages) {
				await deleteImage({ id: image.id });
			}
			await invalidate('app:images');
			notifications.success('All orphaned images deleted');
		} catch (err) {
			notifications.error(err.message || 'Failed to delete images');
		} finally {
			deletingOrphans = false;
		}
	}
</script>

<div class="container">
	<div class="header">
		<h1>Images</h1>
		<p class="hint">Upload images from within a node's edit form</p>
	</div>

	<div class="content">
		{#if data.orphanImages.length > 0}
			<div class="orphanSection">
				<div class="orphanHeader">
					<h2>Orphaned Images ({data.orphanImages.length})</h2>
					<button
						class="deleteAllButton"
						onclick={deleteAllOrphans}
						disabled={deletingOrphans}
					>
						{deletingOrphans ? 'Deleting...' : 'Delete All'}
					</button>
				</div>
				<p class="orphanHint">These images are not attached to any node and can be safely deleted.</p>
				<div class="thumbnailGrid orphanGrid">
					{#each data.orphanImages as image}
						{@const thumbnailUrl = getImageThumbnail(image)}
						<div class="orphanThumbnail">
							<button
								class="thumbnail"
								class:selected={selectedId === image.id}
								onclick={() => selectImage(image.id)}
							>
								{#if thumbnailUrl}
									<img src={thumbnailUrl} alt={image.file_name} />
								{:else}
									<div class="noPreview">No preview</div>
								{/if}
							</button>
							<button class="deleteOrphanButton" onclick={() => deleteOrphan(image.id)}>Delete</button>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if data.images.length === 0}
			<div class="emptyState">
				<p>No images attached to nodes yet.</p>
				<p class="hint">Upload images from within a node's edit form.</p>
			</div>
		{:else}
			<div class="section">
				<h2>Node Images ({data.images.length})</h2>
				<div class="thumbnailGrid">
					{#each data.images as image}
						{@const thumbnailUrl = getImageThumbnail(image)}
						<button
							class="thumbnail"
							class:selected={selectedId === image.id}
							onclick={() => selectImage(image.id)}
						>
							{#if thumbnailUrl}
								<img src={thumbnailUrl} alt={image.file_name} />
							{:else}
								<div class="noPreview">No preview</div>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.container {
		height: calc(100vh - 40px);
		display: flex;
		flex-direction: column;
		background-color: var(--base0);
		overflow: hidden;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24px 32px;
		border-bottom: 1px solid var(--base200);
	}

	h1 {
		font-size: 24px;
		font-weight: 600;
		color: var(--base900);
		margin: 0;
	}

	.hint {
		font-size: 14px;
		color: var(--base500);
		margin: 0;
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
	}

	.emptyState {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: var(--base600);
		gap: 8px;
	}

	.emptyState p {
		margin: 0;
		font-size: 16px;
	}

	.thumbnailGrid {
		padding: 24px 32px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 16px;
		align-content: start;
	}

	.thumbnail {
		aspect-ratio: 1;
		border: 2px solid var(--base200);
		border-radius: 8px;
		overflow: hidden;
		cursor: pointer;
		background-color: var(--base50);
		transition: all 0.2s;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.thumbnail:hover {
		border-color: var(--action400);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.thumbnail.selected {
		border-color: var(--action500);
		border-width: 3px;
		box-shadow: 0 0 0 3px var(--action100);
	}

	.thumbnail img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.noPreview {
		color: var(--base400);
		font-size: 13px;
	}

	.orphanSection {
		padding: 24px 32px;
		background-color: var(--danger50);
		border-bottom: 1px solid var(--danger200);
	}

	.orphanHeader {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}

	.orphanHeader h2 {
		font-size: 16px;
		font-weight: 600;
		color: var(--danger700);
		margin: 0;
	}

	.orphanHint {
		font-size: 13px;
		color: var(--danger600);
		margin: 0 0 16px 0;
	}

	.orphanGrid {
		padding: 0;
	}

	.orphanThumbnail {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.deleteOrphanButton {
		padding: 6px 12px;
		background-color: var(--danger500);
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.deleteOrphanButton:hover {
		background-color: var(--danger600);
	}

	.deleteAllButton {
		padding: 8px 16px;
		background-color: var(--danger500);
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.deleteAllButton:hover:not(:disabled) {
		background-color: var(--danger600);
	}

	.deleteAllButton:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.section {
		padding: 24px 32px;
	}

	.section h2 {
		font-size: 16px;
		font-weight: 600;
		color: var(--base700);
		margin: 0 0 16px 0;
	}

	.section .thumbnailGrid,
	.orphanSection .thumbnailGrid {
		padding: 0;
	}
</style>
