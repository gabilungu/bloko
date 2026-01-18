<script>
	import { page } from '$app/stores';
	import { goto, invalidate } from '$app/navigation';
	import { notifications } from '$lib/ui/Notification/Notification.svelte';
	import { deleteImage } from '../data.remote.js';

	let { data } = $props();
	let parentData = $derived($page.data);

	let deleting = $state(false);

	function getImageUrl(variant) {
		return `${parentData.s3BaseUrl}/${variant.s3_key}`;
	}

	function formatBytes(bytes) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
	}

	async function handleDelete() {
		if (!confirm('Are you sure you want to delete this image? This cannot be undone.')) {
			return;
		}

		deleting = true;
		try {
			await deleteImage({  sid: data.image.sid });
			await invalidate('app:images');
			goto(`/images`);
			notifications.success('Image deleted successfully');
		} catch (err) {
			notifications.error(err.message || 'Failed to delete image');
		} finally {
			deleting = false;
		}
	}

	// Get original variant for main preview
	let originalVariant = $derived(data.image.variants.find((v) => v.preset === 'original'));
</script>

<div class="detailContent">
	<div class="detailHeader">
		<h2>Image Details</h2>
		<button class="deleteButton" onclick={handleDelete} disabled={deleting}>
			{deleting ? 'Deleting...' : 'Delete'}
		</button>
	</div>

	{#if originalVariant}
		<div class="imagePreview">
			<img src={getImageUrl(originalVariant)} alt={originalVariant.filename} />
		</div>

		<div class="infoSection">
			<h3>Original</h3>
			<div class="infoGrid">
				<div class="infoRow">
					<span class="label">Filename:</span>
					<span class="value">{originalVariant.filename}</span>
				</div>
				<div class="infoRow">
					<span class="label">Dimensions:</span>
					<span class="value">{originalVariant.width} × {originalVariant.height}</span>
				</div>
				<div class="infoRow">
					<span class="label">Format:</span>
					<span class="value">{originalVariant.format.toUpperCase()}</span>
				</div>
				<div class="infoRow">
					<span class="label">Size:</span>
					<span class="value">{formatBytes(originalVariant.file_size)}</span>
				</div>
			</div>
		</div>
	{/if}

	<div class="infoSection">
		<h3>Variants ({data.image.variants.length})</h3>
		<div class="variantsList">
			{#each data.image.variants as variant}
				<div class="variant">
					<div class="variantHeader">
						<strong>{variant.preset}</strong>
						<span class="variantFormat">{variant.format.toUpperCase()}</span>
					</div>
					<div class="variantInfo">
						{variant.width}×{variant.height} • {formatBytes(variant.file_size)}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="infoSection">
		<h3>Metadata</h3>
		<div class="infoGrid">
			<div class="infoRow">
				<span class="label">ID:</span>
				<span class="value">{data.image.sid}</span>
			</div>
			<div class="infoRow">
				<span class="label">Created:</span>
				<span class="value">{new Date(data.image.created_at).toLocaleString()}</span>
			</div>
			<div class="infoRow">
				<span class="label">Updated:</span>
				<span class="value">{new Date(data.image.updated_at).toLocaleString()}</span>
			</div>
		</div>
	</div>
</div>

<style>
	.detailContent {
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.detailHeader {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	h2 {
		margin: 0;
		font-size: 18px;
		font-weight: 600;
		color: var(--base900);
	}

	h3 {
		margin: 0 0 12px 0;
		font-size: 14px;
		font-weight: 600;
		color: var(--base700);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.deleteButton {
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

	.deleteButton:hover:not(:disabled) {
		background-color: var(--danger600);
	}

	.deleteButton:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.imagePreview {
		width: 100%;
		aspect-ratio: 16 / 9;
		background-color: var(--base100);
		border-radius: 8px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.imagePreview img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	.infoSection {
		border-top: 1px solid var(--base200);
		padding-top: 16px;
	}

	.infoGrid {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.infoRow {
		display: flex;
		justify-content: space-between;
		font-size: 13px;
		gap: 12px;
	}

	.label {
		color: var(--base600);
		font-weight: 500;
	}

	.value {
		color: var(--base900);
		text-align: right;
		word-break: break-word;
	}

	.variantsList {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.variant {
		background-color: var(--base50);
		padding: 12px;
		border-radius: 6px;
	}

	.variantHeader {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 4px;
	}

	.variantHeader strong {
		font-size: 13px;
		color: var(--base900);
	}

	.variantFormat {
		font-size: 11px;
		font-weight: 600;
		color: var(--base600);
		background-color: var(--base200);
		padding: 2px 6px;
		border-radius: 3px;
	}

	.variantInfo {
		font-size: 12px;
		color: var(--base600);
	}
</style>
