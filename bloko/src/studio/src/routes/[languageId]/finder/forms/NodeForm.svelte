<script>
	import { Input, Textarea, FormField, Button, Dropdown, LabeledText, LanguageTabs, BlockPreview } from '$lib/ui';
	import { notifications } from '$lib/ui/Notification/Notification.svelte';
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { updateNode, deleteNode } from '../data.remote.js';
	import ContentForm from './ContentForm.svelte';
	import RelationForm from './RelationForm.svelte';
	import { detailedMode } from '$lib/globals.svelte.js';

	let { data, node } = $props();

	let editCode = $state(node?.code || '');
	let editNotes = $state(node?.notes || '');
	let editNodeType = $state(node?._node_type || '');
	let editTemplate = $state(node?._template || '');
	let saving = $state(false);
	let deleting = $state(false);

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

	function formatTimestamp(timestamp) {
		if (!timestamp) return '';
		const date = new Date(timestamp);
		const day = String(date.getDate()).padStart(2, '0');
		const month = date.toLocaleString('en', { month: 'short' });
		const year = date.getFullYear();
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');
		return `${day} ${month} ${year} - ${hours}:${minutes}:${seconds}`;
	}

	// Only reset edit fields when switching to a different node
	let lastNodeId = $state(node?.id);
	$effect(() => {
		if (node?.id !== lastNodeId) {
			lastNodeId = node?.id;
			editCode = node?.code || '';
			editNotes = node?.notes || '';
			editNodeType = node?._node_type || '';
			editTemplate = node?._template || '';
			editTitle = { ...(node?.title || {}) };
			editSubtitle = { ...(node?.subtitle || {}) };
			editSlug = { ...(node?.slug || {}) };
		}
	});

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
					contentValue={block.content_type === 'number'
						? (block.content?.value ?? '')
						: (block.content?.value?.[data.languageId] || '')}
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
	.sid {
		font-size: 14px;
		color: var(--base400);
		margin-left: auto;
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
</style>
