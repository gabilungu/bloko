<script>
	import { Input, TreeView } from '$lib/ui';
	import { page } from '$app/stores';
	import { goto, invalidate } from '$app/navigation';
	import { notifications } from '$lib/ui/Notification/Notification.svelte';
	import { createNodeType, updateNodeType } from './data.remote.js';

	let { data, children } = $props();

	let newCode = $state('');
	let newNotes = $state('');
	let creating = $state(false);

	let selectedId = $derived($page.params.id || null);

	// Transform items for TreeView
	let treeItems = $derived(
		data.nodeTypes.map((item, index) => ({
			id: index,
			nodeTypeId: item.id,
			name: item.code,
			order: item.sort ?? 999999,
		}))
	);

	// Find selected tree item ID based on selectedId
	let selectedTreeId = $derived(treeItems.find((t) => t.nodeTypeId === selectedId)?.id ?? null);

	function selectNodeType(id) {
		const treeItem = treeItems[id];
		if (!treeItem) return;

		// If clicking the same node type, deselect it
		if (selectedId === treeItem.nodeTypeId) {
			goto(`/${data.languageId}/node-types`);
		} else {
			goto(`/${data.languageId}/node-types/${treeItem.nodeTypeId}`);
		}
	}

	async function onCreate(e) {
		e?.preventDefault?.();
		const code = newCode.trim();
		if (!code) return;
		creating = true;
		try {
			// Calculate next sort value
			const maxSort = data.nodeTypes.reduce((max, item) => Math.max(max, item.sort ?? 0), -1);

			const created = await createNodeType({
				code,
				sort: maxSort + 1,
				notes: newNotes.trim() || null,
			});
			await invalidate('app:node-types');
			newCode = '';
			newNotes = '';
			goto(`/${data.languageId}/node-types/${created.id}`);
			notifications.success('Node type created');
		} catch (e) {
			notifications.error('Failed to create node type');
		} finally {
			creating = false;
		}
	}

	async function onReorder(updates) {
		try {
			const updatePromises = updates
				.map(({ itemId, order }) => {
					const treeItem = treeItems[itemId];
					if (!treeItem) return null;

					return updateNodeType({
						id: treeItem.nodeTypeId,
						updates: { sort: order },
					});
				})
				.filter(Boolean);

			await Promise.all(updatePromises);
			await invalidate('app:node-types');
			notifications.success('Order updated');
		} catch (error) {
			notifications.error('Failed to save order');
		}
	}
</script>

<div class="container">
	<div class="leftArea">
		<div class="leftHeader">Node Types</div>
		<div class="leftContent">
			{#if data.nodeTypes.length === 0}
				<div class="empty">No node types</div>
			{:else}
				<TreeView items={treeItems} allowNesting={false} selectedId={selectedTreeId} onSelect={selectNodeType} {onReorder} gap="2px" />
			{/if}
		</div>
		<div class="leftFooter">
			<form onsubmit={onCreate} class="createForm">
				<Input placeholder="New node type code" size="28" bind:value={newCode} />
			</form>
		</div>
	</div>

	{@render children()}
</div>

<style>
	.container {
		background-color: var(--base500);
		height: calc(100vh - 40px);
		display: flex;
		overflow: hidden;
		gap: 1px;
	}
	.leftArea {
		width: 250px;
		background-color: var(--base200);
		height: 100%;
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1px;
	}
	.leftHeader {
		background-color: var(--base100);
		height: 20px;
		padding: 0 8px;
		display: flex;
		align-items: center;
		font-size: 11px;
		font-weight: 600;
		color: var(--base700);
		text-transform: uppercase;
	}
	.leftContent {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 2px;
		background-color: var(--base0);
		padding: 4px;
	}
	.leftFooter {
		background-color: var(--base0);
		padding: 4px;
	}
	.empty {
		padding: 8px 10px;
		color: var(--base600);
		font-size: 13px;
	}
	.createForm {
		display: flex;
	}
</style>
