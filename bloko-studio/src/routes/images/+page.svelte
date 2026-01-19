<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let { data } = $props();

	let selectedId = $derived($page.params.sid || null);

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
</script>

<div class="container">
	<div class="header">
		<h1>Images</h1>
		<p class="hint">Upload images from within a node's edit form</p>
	</div>

	<div class="content">
		{#if data.images.length === 0}
			<div class="emptyState">
				<p>No images uploaded yet.</p>
				<p class="hint">Upload images from within a node's edit form.</p>
			</div>
		{:else}
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
		overflow: hidden;
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
		flex: 1;
		padding: 24px 32px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 16px;
		align-content: start;
		overflow-y: auto;
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
</style>
