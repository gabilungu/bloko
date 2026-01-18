<script>
	import { SelectableItem, Input, TreeView } from '$lib/ui';
	import { page } from '$app/stores';
	import { goto, invalidate } from '$app/navigation';
	import { notifications } from '$lib/ui/Notification/Notification.svelte';
	import { createTemplate, createBlock, reorderBlocks } from '../../data.remote.js';

	let { data, children } = $props();

	let newTemplateCode = $state('');
	let creatingTemplate = $state(false);
	let newBlockCode = $state('');
	let creatingBlock = $state(false);

	// Extract selected template from URL
	let selectedTemplateId = $derived(
		$page.params.templateId || null
	);

	// Build hierarchical blocks structure
	function buildBlockTree(blocks, languageId) {
		if (!blocks) return [];

		const blockMap = new Map();
		const rootBlocks = [];

		// First pass: create map and identify roots
		blocks.forEach(block => {
			blockMap.set(block.id, {
				id: block.id,
				name: block.title?.[languageId] || block.code || `Block ${block.id.slice(0, 8)}`,
				items: []
			});
		});

		// Second pass: build tree structure
		blocks.forEach(block => {
			const treeBlock = blockMap.get(block.id);
			if (block._parent) {
				const parent = blockMap.get(block._parent);
				if (parent) {
					parent.items.push(treeBlock);
				} else {
					rootBlocks.push(treeBlock);
				}
			} else {
				rootBlocks.push(treeBlock);
			}
		});

		return rootBlocks;
	}

	let treeBlocks = $derived(
		selectedTemplateId && data.blocks
			? buildBlockTree(data.blocks, data.languageId)
			: []
	);

	// Extract selected block from URL
	let selectedBlockId = $derived(
		$page.params.blockId || null
	);

	function onBlockSelect(id) {
		if (id === null) {
			goto(`/${data.languageId}/finder/${data.collection.id}/templates/${selectedTemplateId}`);
		} else {
			goto(`/${data.languageId}/finder/${data.collection.id}/templates/${selectedTemplateId}/blocks/${id}`);
		}
	}

	async function onBlockReorder(updates) {
		console.log('onBlockReorder called with:', updates);
		try {
			// Transform TreeView format (itemId, parentId, order) to backend format (id, _parent, sort)
			const transformedUpdates = updates.map(u => ({
				id: u.itemId,
				sort: u.order,
				_parent: u.parentId
			}));
			await reorderBlocks({ updates: transformedUpdates });
			await invalidate('app:blocks');
			notifications.success('Order updated');
		} catch (error) {
			console.error('Reorder failed:', error);
			notifications.error('Failed to save order');
			await invalidate('app:blocks'); // Reload to restore correct state
		}
	}

	async function onCreateTemplate(e) {
		e?.preventDefault?.();
		const code = newTemplateCode.trim();
		if (!code) return;

		creatingTemplate = true;
		try {
			const created = await createTemplate({

				_collection: data.collection.id,
				code,
				title: {},
				notes: null
			});
			await invalidate('app:templates');
			newTemplateCode = '';
			goto(`/${data.languageId}/finder/${data.collection.id}/templates/${created.id}`);
			notifications.success('Template created');
		} catch (error) {
			notifications.error('Failed to create template');
		} finally {
			creatingTemplate = false;
		}
	}

	async function onCreateBlock(e) {
		e?.preventDefault?.();
		const code = newBlockCode.trim();
		if (!code || !selectedTemplateId) return;

		creatingBlock = true;
		try {
			const created = await createBlock({
				_template: selectedTemplateId,
				_parent: selectedBlockId, // Create under selected block
				code
			});
			await invalidate('app:blocks');
			newBlockCode = '';
			goto(`/${data.languageId}/finder/${data.collection.id}/templates/${selectedTemplateId}/blocks/${created.id}`);
			notifications.success('Block created');
		} catch (error) {
			notifications.error('Failed to create block');
		} finally {
			creatingBlock = false;
		}
	}
</script>

<div class="middleArea">
	<div class="tabBar">
		<button class="tab" onclick={() => goto(`/${data.languageId}/finder/${data.collection.id}/nodes`)}>Nodes</button>
		<button class="tab active">Templates</button>
		<button class="tab" onclick={() => goto(`/${data.languageId}/finder/${data.collection.id}/relation-types`)}>Relation Types</button>
	</div>
	<div class="templatesArea">
		<div class="templatesColumn">
			<div class="columnContent">
				{#if data.templates.length === 0}
					<div class="placeholder">No templates</div>
				{:else}
					{#each data.templates as template}
						<SelectableItem
							selected={selectedTemplateId === template.id}
							onclick={() => {
								if (selectedTemplateId === template.id) {
									goto(`/${data.languageId}/finder/${data.collection.id}/templates`);
								} else {
									goto(`/${data.languageId}/finder/${data.collection.id}/templates/${template.id}`);
								}
							}}
						>
							{template.code || template.title?.[data.languageId] || template.notes || `Template ${template.id}`}
						</SelectableItem>
					{/each}
				{/if}
			</div>
			<div class="columnFooter">
				<form onsubmit={onCreateTemplate} class="createForm">
					<Input
						placeholder="New template code"
						size="28"
						variant="accent"
						bind:value={newTemplateCode}
						disabled={creatingTemplate}
					/>
				</form>
			</div>
		</div>
		<div class="blocksColumn">
			{#if selectedTemplateId}
				<div class="columnContent">
					{#if treeBlocks.length === 0}
						<div class="placeholder">No blocks</div>
					{:else}
						<TreeView
							items={treeBlocks}
							selectedId={selectedBlockId}
							onSelect={onBlockSelect}
							onReorder={onBlockReorder}
							allowSelection={true}
							allowNesting={true}
							gap="2px"
						/>
					{/if}
				</div>
				<div class="columnFooter">
					<form onsubmit={onCreateBlock} class="createForm">
						<Input
							placeholder="New block code"
							size="28"
							variant="accent"
							bind:value={newBlockCode}
							disabled={creatingBlock}
						/>
					</form>
				</div>
			{/if}
		</div>
	</div>
</div>

{@render children()}

<style>
	.middleArea {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 1px;
		overflow: hidden;
		background-color: var(--base200);
	}

	.tabBar {
		display: flex;
		gap: 4px;
		background-color: var(--base100);
		padding: 0 4px;
		height: 32px;
		align-items: center;
		flex: 0 0 auto;
	}

	.tab {
		padding: 3px 12px;
		background-color: var(--base0);
		border: none;
		cursor: pointer;
		font-size: 13px;
		font-weight: 500;
		color: var(--base700);
		border-radius: 16px;
		transition: all 0.15s ease;
	}

	.tab:hover {
		background-color: var(--action100);
		color: var(--base1000);
	}

	.tab.active {
		background-color: var(--base900);
		color: var(--base0);
	}

	.templatesArea {
		flex: 1;
		background-color: var(--base200);
		display: flex;
		flex-direction: row;
		gap: 1px;
		overflow: hidden;
	}
	.templatesColumn {
		width: 220px;
		flex: 0 0 220px;
		display: flex;
		flex-direction: column;
		gap: 1px;
		background-color: var(--base200);
	}
	.blocksColumn {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 1px;
		background-color: var(--base200);
		overflow-x: auto;
	}
	.columnHeader {
		background-color: var(--base100);
		height: 32px;
		padding: 0 8px;
		display: flex;
		align-items: center;
		font-size: 11px;
		font-weight: 600;
		color: var(--base700);
		text-transform: uppercase;
		flex: 0 0 auto;
	}
	.columnContent {
		flex: 1;
		background-color: var(--base0);
		padding: 4px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		overflow-y: auto;
	}
	.columnFooter {
		background-color: var(--base0);
		padding: 4px;
		flex: 0 0 auto;
	}
	.placeholder {
		padding: 8px 10px;
		color: var(--base600);
		font-size: 13px;
	}
	.createForm {
		display: flex;
		gap: 4px;
	}
</style>
