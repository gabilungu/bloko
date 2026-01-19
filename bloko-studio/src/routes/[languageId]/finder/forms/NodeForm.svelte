<script>
	import { Input, Textarea, FormField, Button, Dropdown, LabeledText, LanguageTabs, BlockPreview, ImageDropzone, MultiImageUpload } from '$lib/ui';
	import { notifications } from '$lib/ui/Notification/Notification.svelte';
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { updateNode, deleteNode, deleteImage as deleteImageRemote } from '../data.remote.js';
	import ContentForm from './ContentForm.svelte';
	import RelationForm from './RelationForm.svelte';
	import { detailedMode } from '$lib/globals.svelte.js';

	let { data, node } = $props();

	let editCode = $state(node?.code || '');
	let editNotes = $state(node?.notes || '');
	let editNodeType = $state(node?._node_type || '');
	let editTemplate = $state(node?._template || '');
	let editCoverImage = $state(node?._cover_image || null);
	let coverImageUrl = $state(data.coverImageUrl || null);
	let saving = $state(false);
	let deleting = $state(false);
	let uploadingImage = $state(false);

	// Translation fields - initialize from node
	let editTitle = $state({ ...(node?.title || {}) });
	let editSubtitle = $state({ ...(node?.subtitle || {}) });
	let editSlug = $state({ ...(node?.slug || {}) });

	// Compute language intents based on whether title and slug exist
	let languageIntents = $derived.by(() => {
		const intents = {};
		for (const lang of data.languages) {
			const hasTitle = editTitle[lang]?.trim();
			const hasSlug = editSlug[lang]?.trim();
			intents[lang] = (hasTitle && hasSlug) ? 'success' : 'danger';
		}
		return intents;
	});

	// Only reset edit fields when switching to a different node
	let lastNodeId = $state(node?.id);
	$effect(() => {
		if (node?.id !== lastNodeId) {
			lastNodeId = node?.id;
			editCode = node?.code || '';
			editNotes = node?.notes || '';
			editNodeType = node?._node_type || '';
			editTemplate = node?._template || '';
			editCoverImage = node?._cover_image || null;
			coverImageUrl = data.coverImageUrl || null;
			editTitle = { ...(node?.title || {}) };
			editSubtitle = { ...(node?.subtitle || {}) };
			editSlug = { ...(node?.slug || {}) };
		}
	});

	// Handle cover image upload (file provided) or delete (file is null)
	async function onCoverImageChange(file) {
		if (!node) return;

		if (file) {
			// Upload new image via fetch (base64 is too large for query URL params)
			uploadingImage = true;
			try {
				const arrayBuffer = await file.arrayBuffer();
				const base64Data = btoa(
					new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
				);

				const response = await fetch('/api/images/upload-json', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						base64Data,
						fileName: file.name,
						mimeType: file.type,
						nodeId: node.id
					})
				});

				if (!response.ok) {
					throw new Error(await response.text() || 'Upload failed');
				}

				const result = await response.json();

				// Delete old cover image if exists
				if (editCoverImage) {
					try {
						await deleteImageRemote({ imageId: editCoverImage });
					} catch (e) {
						// Ignore errors deleting old image
					}
				}

				// Update node with new cover image
				editCoverImage = result.image.id;
				await updateNode({ id: node.id, _cover_image: result.image.id });
				await invalidate('app:nodes');
				notifications.success('Cover image uploaded');
			} catch (error) {
				console.error('Upload error:', error);
				notifications.error('Failed to upload image');
			} finally {
				uploadingImage = false;
			}
		} else {
			// Delete existing image
			if (!editCoverImage) return;

			saving = true;
			try {
				const imageIdToDelete = editCoverImage;

				// Clear cover image reference first
				editCoverImage = null;
				coverImageUrl = null;
				await updateNode({ id: node.id, _cover_image: null });

				// Then delete the actual image
				await deleteImageRemote({ imageId: imageIdToDelete });
				await invalidate('app:nodes');
				notifications.success('Cover image deleted');
			} catch (error) {
				console.error('Delete error:', error);
				notifications.error('Failed to delete image');
				// Restore on error
				editCoverImage = node._cover_image || null;
				coverImageUrl = data.coverImageUrl || null;
			} finally {
				saving = false;
			}
		}
	}

	// Handle gallery image upload
	async function onGalleryUpload(file) {
		if (!node) return;

		try {
			const arrayBuffer = await file.arrayBuffer();
			const base64Data = btoa(
				new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
			);

			const response = await fetch('/api/images/upload-json', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					base64Data,
					fileName: file.name,
					mimeType: file.type,
					nodeId: node.id
				})
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				const errorMsg = errorData.message || errorData.body?.message || 'Upload failed';
				throw new Error(errorMsg);
			}

			const result = await response.json();
			const newImage = result.image;

			// Add to node's _images array
			const currentImages = node._images || [];
			const newImagesArray = [...currentImages, newImage.id];
			await updateNode({ id: node.id, _images: newImagesArray });

			await invalidate('app:nodes');
			notifications.success('Image added');
		} catch (error) {
			console.error('Gallery upload error:', error);
			notifications.error(error.message || 'Failed to upload image');
			throw error;
		}
	}

	// Handle gallery image delete
	async function onGalleryDelete(imageId) {
		if (!node) return;

		// Remove from node's _images array
		const currentImages = node._images || [];
		const newImagesArray = currentImages.filter(id => id !== imageId);
		await updateNode({ id: node.id, _images: newImagesArray });

		// Delete the actual image
		await deleteImageRemote({ imageId });

		await invalidate('app:nodes');
		notifications.success('Image removed');
	}

	async function onBlur() {
		if (!node) return;
		const code = editCode.trim();
		const notes = editNotes.trim() || null;
		const nodeType = editNodeType;
		const template = editTemplate || null;

		// Check if anything changed
		const hasChanges =
			code !== (node.code || '') ||
			notes !== node.notes ||
			nodeType !== node._node_type ||
			template !== node._template ||
			JSON.stringify(editTitle) !== JSON.stringify(node.title || {}) ||
			JSON.stringify(editSubtitle) !== JSON.stringify(node.subtitle || {}) ||
			JSON.stringify(editSlug) !== JSON.stringify(node.slug || {});

		if (!hasChanges) return;

		saving = true;
		try {
			const payload = {

				id: node.id,
				code: code || null,
				notes: notes,
				_node_type: nodeType,
				_template: template
			};

			// Only include translation fields if they changed
			if (JSON.stringify(editTitle) !== JSON.stringify(node.title || {})) {
				payload.title = editTitle;
			}
			if (JSON.stringify(editSubtitle) !== JSON.stringify(node.subtitle || {})) {
				payload.subtitle = editSubtitle;
			}
			if (JSON.stringify(editSlug) !== JSON.stringify(node.slug || {})) {
				payload.slug = editSlug;
			}

			await updateNode(payload);
			await invalidate('app:nodes');
			notifications.success('Saved');
		} catch (error) {
			console.error('Save error:', error);
			notifications.error('Failed to save');
			// Restore original values on error
			editCode = node.code || '';
			editNotes = node.notes || '';
			editNodeType = node._node_type || '';
			editTemplate = node._template || '';
			editTitle = { ...(node?.title || {}) };
			editSubtitle = { ...(node?.subtitle || {}) };
			editSlug = { ...(node?.slug || {}) };
		} finally {
			saving = false;
		}
	}

	async function onDelete() {
		if (!node) return;
		if (!confirm('Delete this node? This will delete all child nodes.')) return;

		deleting = true;
		try {
			await deleteNode({ id: node.id });
			await invalidate('app:nodes');
			await goto(`/${data.languageId}/finder/${data.collection.id}/nodes`);
			notifications.success('Deleted');
		} catch (error) {
			notifications.error('Failed to delete');
		} finally {
			deleting = false;
		}
	}

	// Build block hierarchy with content attached
	function buildBlockHierarchy(blocks, contents) {
		if (!blocks || blocks.length === 0) return [];

		// Create a map of block id to content
		const contentMap = new Map();
		if (contents) {
			contents.forEach(content => {
				contentMap.set(content._block, content);
			});
		}

		const blockMap = new Map();
		const rootBlocks = [];

		// First pass: create map with content attached
		blocks.forEach(block => {
			const content = contentMap.get(block.id);
			blockMap.set(block.id, { ...block, children: [], content });
		});

		// Second pass: build tree
		blocks.forEach(block => {
			const blockNode = blockMap.get(block.id);
			if (block._parent === null) {
				rootBlocks.push(blockNode);
			} else {
				const parent = blockMap.get(block._parent);
				if (parent) {
					parent.children.push(blockNode);
				}
			}
		});

		return rootBlocks;
	}

	let blockHierarchy = $derived(buildBlockHierarchy(data.blocks, data.contents));
</script>

{#snippet renderBlock(block)}
	<BlockPreview
		code={block.code || block.notes || `Block ${block.id}`}
		title={block.title?.[data.languageId] || ''}
		hint={block.hint?.[data.languageId] || ''}
		contentType={block.content_type || ''}
		contentId={block.content?.id}
	>
		{#snippet contentForm()}
			{#if block.content_type}
				<ContentForm
					data={data}
					block={block}
					node={node}
					contentValue={block.content_type === 'number' || block.content_type === 'image' || block.content_type === 'image_list'
						? (block.content?.value ?? (block.content_type === 'image_list' ? [] : ''))
						: (block.content?.value?.[data.languageId] || '')}
					contentImageUrl={block.content_type === 'image' ? data.contentImageUrls?.[block.id] : null}
					contentImages={block.content_type === 'image_list' ? (data.contentImageUrls?.[block.id] || []) : []}
				/>
			{/if}
		{/snippet}
		{#snippet children()}
			{#if block.children && block.children.length > 0}
				<div class="nestedBlocks">
					{#each block.children as childBlock}
						{@render renderBlock(childBlock)}
					{/each}
				</div>
			{/if}
		{/snippet}
	</BlockPreview>
{/snippet}

<div class="rightArea">
	<div class="header">
		<h2 class="title">Edit Node</h2>
		<Button
			label="Delete"
			intent="danger"
			size="28"
			type="button"
			onclick={onDelete}
			disabled={deleting || saving}
		/>
	</div>
	<div class="editor">
		{#if detailedMode.value}
			<div class="metaRow">
				<LabeledText label="id" text={String(node?.id ?? '')} textSize="12px" textColor="var(--base600)" labelColor="var(--base300)" />
				<LabeledText label="sort" text={String(node?.sort ?? '')} textSize="12px" textColor="var(--base600)" labelColor="var(--base300)" />
			</div>
		{/if}
		<FormField label="Code">
			{#snippet children()}
				<Input
					id="node-code"
					size="32"
					placeholder="Node code"
					variant="accent"
					bind:value={editCode}
					onblur={onBlur}
				/>
			{/snippet}
		</FormField>
		{#if detailedMode.value}
			<FormField label="Notes">
				{#snippet children()}
					<Textarea
						id="node-notes"
						placeholder="Description (optional)"
						variant="accent"
						bind:value={editNotes}
						onblur={onBlur}
					/>
				{/snippet}
			</FormField>
		{/if}
		<div class="row">
			<FormField label="Node Type">
				{#snippet children()}
					<Dropdown
						size="32"
						bind:value={editNodeType}
						onchange={onBlur}
						options={data.nodeTypes?.map((nt) => ({
							value: nt.id,
							label: nt.code
						})) || []}
					/>
				{/snippet}
			</FormField>
			<FormField label="Template">
				{#snippet children()}
					<Dropdown
						size="32"
						bind:value={editTemplate}
						onchange={onBlur}
						options={[
							{ value: '', label: 'None' },
							...data.templates?.map((t) => ({
								value: t.id,
								label: t.code || t.notes || `Template ${t.id}`
							})) || []
						]}
					/>
				{/snippet}
			</FormField>
		</div>

		<!-- Images Row: Cover + Gallery -->
		<div class="imagesRow">
			<FormField label="Cover">
				{#snippet children()}
					<div class="coverImageWrapper">
						<ImageDropzone
							src={coverImageUrl}
							onchange={onCoverImageChange}
							disabled={saving || uploadingImage}
						/>
					</div>
				{/snippet}
			</FormField>

			<FormField label="Gallery">
				{#snippet children()}
					<MultiImageUpload
						images={data.galleryImages || []}
						onupload={onGalleryUpload}
						ondelete={onGalleryDelete}
						disabled={saving}
					/>
				{/snippet}
			</FormField>
		</div>

		<hr />

		<!-- Language Tabs -->
		<LanguageTabs
			languages={data.languages}
			activeLanguage={data.languageId}
			intents={languageIntents}
			onclick={(lang) => {
				const currentPath = $page.url.pathname;
				const newPath = currentPath.replace(/^\/[^\/]+/, `/${lang}`);
				goto(newPath);
			}}
		/>

		<!-- Translation Fields -->
		<div class="row">
			<FormField label="Title">
				{#snippet children()}
					<Input
						id="node-title-{data.languageId}"
						size="32"
						placeholder="Title in {data.languageId}"
						value={editTitle[data.languageId] || ''}
						oninput={(e) => {
							editTitle = { ...editTitle, [data.languageId]: e.target.value };
						}}
						onblur={onBlur}
					/>
				{/snippet}
			</FormField>
			<FormField label="Slug">
				{#snippet children()}
					<Input
						id="node-slug-{data.languageId}"
						size="32"
						placeholder="Slug in {data.languageId}"
						value={editSlug[data.languageId] || ''}
						oninput={(e) => {
							editSlug = { ...editSlug, [data.languageId]: e.target.value };
						}}
						onblur={onBlur}
					/>
				{/snippet}
			</FormField>
		</div>
		<FormField label="Subtitle">
			{#snippet children()}
				<Input
					id="node-subtitle-{data.languageId}"
					size="32"
					placeholder="Subtitle in {data.languageId}"
					value={editSubtitle[data.languageId] || ''}
					oninput={(e) => {
						editSubtitle = { ...editSubtitle, [data.languageId]: e.target.value };
					}}
					onblur={onBlur}
				/>
			{/snippet}
		</FormField>

		{#if blockHierarchy && blockHierarchy.length > 0}
			<hr />

			<div class="sectionHeader">
				<div class="sectionTitle">Blocks and Content</div>
				{#if node._template}
					<Button
						label="View Template"
						intent="secondary"
						size="24"
						type="button"
						onclick={() => goto(`/${data.languageId}/finder/${data.collection.id}/templates/${node._template}`)}
					/>
				{/if}
			</div>

			<div class="blocksList">
				{#each blockHierarchy as block}
					{@render renderBlock(block)}
				{/each}
			</div>
		{/if}

		<!-- Relations Section -->
		<hr />
		<RelationForm
			{data}
			{node}
			outgoingRelations={data.outgoingRelations || []}
			incomingRelations={data.incomingRelations || []}
		/>
	</div>
</div>

<style>
	.rightArea {
		width: 700px;
		background-color: var(--base100);
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		gap: 1px;
	}
	.header {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 16px 32px;
		background-color: var(--base0);
	}
	hr {
		border: none;
		border-top: 1px solid var(--base200);
		margin: 16px 0;
	}
	.title {
		font-size: 18px;
		font-weight: 600;
		margin: 0;
		color: var(--base900);
	}
	.editor {
		display: grid;
		grid-template-columns: 1fr;
		grid-auto-rows: max-content;
		gap: 16px;
		padding: 32px;
		background-color: var(--base0);
		flex: 1;
	}
	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
	.metaRow {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		gap: 16px;
	}
	.sectionHeader {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}
	.sectionTitle {
		font-size: 18px;
		font-weight: 600;
		color: var(--base900);
	}
	.blocksList {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.nestedBlocks {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 100%;
	}
	.imagesRow {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 16px;
		align-items: start;
	}
	.coverImageWrapper {
		width: 160px;
	}
</style>
