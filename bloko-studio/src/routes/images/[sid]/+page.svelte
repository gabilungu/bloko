<script>
	import { page } from '$app/stores';
	import { goto, invalidate } from '$app/navigation';
	import { notifications } from '$lib/ui/Notification/Notification.svelte';
	import { deleteImage } from '../data.remote.js';

	let { data } = $props();
	let parentData = $derived($page.data);

	let deleting = $state(false);

	function getImageUrl(s3Key) {
		return `${parentData.s3BaseUrl}/${s3Key}`;
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
			await deleteImage({ id: data.image.id });
			await invalidate('app:images');
			goto(`/images`);
			notifications.success('Image deleted successfully');
		} catch (err) {
			notifications.error(err.message || 'Failed to delete image');
		} finally {
			deleting = false;
		}
	}
</script>

<div class="detailContent">
	<div class="detailHeader">
		<h2>Image Details</h2>
		<button class="deleteButton" onclick={handleDelete} disabled={deleting}>
			{deleting ? 'Deleting...' : 'Delete'}
		</button>
	</div>

	{#if data.image}
		<div class="mainContent">
			<div class="imagePreview">
				<img src={getImageUrl(data.image.s3_key)} alt={data.image.file_name} />
			</div>

			<div class="infoPanel">
				<div class="infoSection">
					<h3>Image Info</h3>
					<div class="infoGrid">
						<div class="infoRow">
							<span class="label">Filename:</span>
							<span class="value">{data.image.file_name}</span>
						</div>
						<div class="infoRow">
							<span class="label">Dimensions:</span>
							<span class="value">{data.image.width} × {data.image.height}</span>
						</div>
						<div class="infoRow">
							<span class="label">Format:</span>
							<span class="value">{data.image.format.toUpperCase()}</span>
						</div>
						<div class="infoRow">
							<span class="label">Size:</span>
							<span class="value">{formatBytes(data.image.file_size)}</span>
						</div>
						<div class="infoRow">
							<span class="label">MIME Type:</span>
							<span class="value">{data.image.mime_type}</span>
						</div>
					</div>
				</div>

				<div class="infoSection">
					<h3>Metadata</h3>
					<div class="infoGrid">
						<div class="infoRow">
							<span class="label">ID:</span>
							<span class="value idValue">{data.image.id}</span>
						</div>
						<div class="infoRow">
							<span class="label">S3 Key:</span>
							<span class="value">{data.image.s3_key}</span>
						</div>
						<div class="infoRow">
							<span class="label">Owner Node:</span>
							{#if data.ownerNode}
								<a href="/en/finder/{data.ownerNode._collection}/nodes/{data.ownerNodePath}" class="nodeLink">
									{data.ownerNode.code || data.ownerNode.title?.en || data.ownerNode.id}
								</a>
							{:else if data.image._node}
								<span class="value orphanBadge">Node deleted</span>
							{:else}
								<span class="value orphanBadge">Orphaned</span>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="notFound">Image not found</div>
	{/if}
</div>

<style>
	.detailContent {
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 24px;
		height: 100%;
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

	.mainContent {
		display: grid;
		grid-template-columns: 1fr 280px;
		gap: 24px;
		flex: 1;
		min-height: 0;
	}

	.imagePreview {
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

	.infoPanel {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.infoSection {
		border-top: 1px solid var(--base200);
		padding-top: 16px;
	}

	.infoSection:first-child {
		border-top: none;
		padding-top: 0;
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
		flex-shrink: 0;
	}

	.value {
		color: var(--base900);
		text-align: right;
		word-break: break-word;
	}

	.idValue {
		font-family: monospace;
		font-size: 11px;
	}

	.notFound {
		padding: 48px;
		text-align: center;
		color: var(--base500);
	}

	.orphanBadge {
		background-color: var(--danger100);
		color: var(--danger700);
		padding: 2px 8px;
		border-radius: 4px;
		font-size: 12px;
		font-weight: 500;
	}

	.nodeLink {
		color: var(--action500);
		text-decoration: none;
		font-weight: 500;
	}

	.nodeLink:hover {
		text-decoration: underline;
	}
</style>
