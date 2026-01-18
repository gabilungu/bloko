<script>
	import { page } from '$app/stores';
	import { goto, invalidate } from '$app/navigation';
	import { notifications } from '$lib/ui/Notification/Notification.svelte';
	import Tabs from '$lib/ui/Tabs/index.js';

	let { data } = $props();

	let uploading = $state(false);
	let selectedId = $derived($page.params.sid || null);

	// Tab management
	let activeTab = $state('images');

	function selectImage(id) {
		// If clicking the same image, deselect it
		if (selectedId === id) {
			goto(`/images`);
		} else {
			goto(`/images/${id}`);
		}
	}

	async function handleFileUpload(event) {
		const file = event.target.files?.[0];
		if (!file) return;

		uploading = true;

		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch(`/images/upload`, {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Failed to upload image');
			}

			await invalidate('app:images');
			event.target.value = '';
			notifications.success('Image uploaded successfully');
		} catch (err) {
			notifications.error(err.message || 'Failed to upload image');
		} finally {
			uploading = false;
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
	</div>

	<Tabs {activeTab}>
		<Tabs.Tab id="images" label="Images" />
		<Tabs.Tab id="presets" label="Presets" />

		<Tabs.List />

		<Tabs.Content tabId="images">
			<div class="tabContent">
				<div class="uploadSection">
					<label for="fileInput" class="uploadButton" class:uploading>
						{uploading ? 'Uploading...' : 'Upload Image'}
					</label>
					<input
						id="fileInput"
						type="file"
						accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
						onchange={handleFileUpload}
						disabled={uploading}
						style="display: none;"
					/>
				</div>

				{#if data.images.length === 0}
					<div class="emptyState">
						<p>No images uploaded yet.</p>
						<p class="hint">Click "Upload Image" to add your first image.</p>
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
		</Tabs.Content>

		<Tabs.Content tabId="presets">
			<div class="tabContent">
				<div class="presetsHeader">
					<h2>Image Presets</h2>
					<p class="description">Configure image processing presets for automatic variant generation</p>
				</div>

				<div class="presetsList">
					<table>
						<thead>
							<tr>
								<th>Preset ID</th>
								<th>Max Dimension</th>
								<th>Quality</th>
								<th>Convert Format</th>
							</tr>
						</thead>
						<tbody>
							{#each data.presets as preset}
								<tr>
									<td>
										<strong>{preset.id}</strong>
										{#if preset.id === 'original'}
											<span class="badge">Original</span>
										{/if}
									</td>
									<td>{preset.max_dimension ?? 'N/A'}</td>
									<td>{preset.quality}%</td>
									<td>{preset.convert_format ?? 'Keep original'}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</Tabs.Content>
	</Tabs>
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

	.tabContent {
		flex: 1;
		display: flex;
		flex-direction: column;
		height: 100%;
		margin: -24px;
	}

	.uploadSection {
		padding: 16px 32px;
		border-bottom: 1px solid var(--base200);
		display: flex;
		gap: 12px;
		align-items: center;
		flex-shrink: 0;
	}

	.uploadButton {
		padding: 10px 20px;
		background-color: var(--action500);
		color: var(--base0);
		border-radius: 6px;
		cursor: pointer;
		font-size: 14px;
		font-weight: 500;
		transition: background-color 0.2s;
	}

	.uploadButton:hover:not(.uploading) {
		background-color: var(--action600);
	}

	.uploadButton.uploading {
		opacity: 0.6;
		cursor: not-allowed;
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

	.emptyState .hint {
		font-size: 14px;
		color: var(--base500);
	}

	.thumbnailGrid {
		flex: 1;
		padding: 24px 32px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 16px;
		align-content: start;
		min-height: 0;
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

	/* Presets Tab Styles */
	.presetsHeader {
		padding: 0 8px 16px 8px;
		border-bottom: 1px solid var(--base200);
	}

	.presetsHeader h2 {
		margin: 0 0 8px 0;
		font-size: 18px;
		font-weight: 600;
		color: var(--base900);
	}

	.description {
		margin: 0;
		font-size: 14px;
		color: var(--base600);
	}

	.presetsList {
		padding: 16px 8px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	thead {
		background-color: var(--base50);
		position: sticky;
		top: 0;
	}

	th {
		text-align: left;
		padding: 12px 16px;
		font-size: 13px;
		font-weight: 600;
		color: var(--base700);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		border-bottom: 2px solid var(--base200);
	}

	td {
		padding: 16px;
		border-bottom: 1px solid var(--base100);
		font-size: 14px;
		color: var(--base800);
	}

	tbody tr:hover {
		background-color: var(--base50);
	}

	.badge {
		display: inline-block;
		padding: 2px 8px;
		margin-left: 8px;
		background-color: var(--action100);
		color: var(--action700);
		border-radius: 4px;
		font-size: 11px;
		font-weight: 600;
		text-transform: uppercase;
	}
</style>
