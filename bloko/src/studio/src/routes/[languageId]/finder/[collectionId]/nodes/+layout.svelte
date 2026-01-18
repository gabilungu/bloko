<script>
	import { ColumnView, Input, Badge, Dropdown } from '$lib/ui';
	import { page } from '$app/stores';
	import { goto, invalidate } from '$app/navigation';
	import { notifications } from '$lib/ui/Notification/Notification.svelte';
	import { createNode, updateNodePositions } from '../../data.remote.js';
	import { stringToBadgeColors } from '$lib/utils/colors.js';

	let { data, children } = $props();

	let newNodeCode = $state('');
	let newNodeType = $state(data.nodeTypes?.[0]?.id || '');
	let creating = $state(false);

	// Create map for node type code lookup
	let nodeTypeCodeMap = $derived(
		data.nodeTypes?.reduce((map, nt) => {
			map[nt.id] = nt.code;
			return map;
		}, {}) || {}
	);

	// Flatten hierarchical nodes into a flat array for operations
	let flatNodes = $derived(flattenNodes(data.nodes));

	// Build hierarchical nodes structure with proper shape for ColumnView
	let treeNodes = $derived(buildTree(data.nodes));

	// Extract selected node path from URL
	let selectedNodePath = $derived(
		$page.params.nodeId ? $page.params.nodeId.split('/') : []
	);

	function flattenNodes(nodes) {
		const flat = [];
		function traverse(nodeList) {
			for (const node of nodeList) {
				flat.push(node);
				if (node.children && node.children.length > 0) {
					traverse(node.children);
				}
			}
		}
		traverse(nodes);
		return flat;
	}

	function buildTree(nodes) {
		return nodes.map(node => ({
			id: node.id,
			name: node.code || node.notes || `Node ${node.id}`,
			nodeType: node._node_type,
			items: node.children ? buildTree(node.children) : []
		}));
	}

	function onSelectionChange(ids) {
		if (ids.length === 0) {
			goto(`/${data.languageId}/finder/${data.collection.id}/nodes`);
		} else {
			const path = ids.join('/');
			goto(`/${data.languageId}/finder/${data.collection.id}/nodes/${path}`);
		}
	}

	// Track all reorder updates within a batch
	// ColumnView calls onReorder multiple times (once per affected item)
	// We batch them together to send as a single database update
	let reorderBatch = [];
	let reorderTimer = null;

	async function onReorder(itemId, newParentId, newOrder) {
		try {
			// Add this update to the batch
			reorderBatch.push({
				nodeId: itemId,
				parentId: newParentId,
				sort: newOrder
			});

			// Clear existing timer
			if (reorderTimer) {
				clearTimeout(reorderTimer);
			}

			// Wait for all updates to arrive, then send them together
			reorderTimer = setTimeout(async () => {
				const updates = [...reorderBatch];
				reorderBatch = [];
				reorderTimer = null;

				try {
					await updateNodePositions({ updates });
					await invalidate('app:nodes');
				} catch (error) {
					console.error('Reorder error:', error);
					if (error?.message?.includes('circular reference')) {
						notifications.error('Cannot move: would create a circular reference (a node cannot be its own ancestor)');
					} else {
						notifications.error('Failed to save order');
					}
					await invalidate('app:nodes');
				}
			}, 50); // 50ms debounce to collect all updates
		} catch (error) {
			console.error('Reorder error:', error);
		}
	}

	async function onCreateNode(e) {
		e?.preventDefault?.();
		const code = newNodeCode.trim();
		if (!code || !newNodeType) return;

		// Get the selected parent node (last in the path, or null if no selection)
		const parentNodeId = selectedNodePath.length > 0
			? selectedNodePath[selectedNodePath.length - 1]
			: null;

		creating = true;
		try {
			const created = await createNode({

				_collection: data.collection.id,
				code,
				_node_type: newNodeType,
				_parent: parentNodeId
			});
			await invalidate('app:nodes');
			newNodeCode = '';
			notifications.success('Node created');

			// Navigate to the newly created node
			const newPath = parentNodeId
				? [...selectedNodePath, created.id].join('/')
				: created.id;
			goto(`/${data.languageId}/finder/${data.collection.id}/nodes/${newPath}`);
		} catch (error) {
			notifications.error('Failed to create node');
		} finally {
			creating = false;
		}
	}
</script>

{#snippet itemContent(item)}
	{@const nodeTypeCode = nodeTypeCodeMap[item.nodeType]}
	{@const colors = nodeTypeCode ? stringToBadgeColors(nodeTypeCode) : { background: 'var(--base700)', foreground: 'var(--base0)' }}
	<div class="item-content">
		<span class="item-name">{item.name}</span>
		{#if nodeTypeCode}
			<Badge
				text={nodeTypeCode.toUpperCase()}
				background={colors.background}
				foreground={colors.foreground}
				size={16}
			/>
		{/if}
	</div>
{/snippet}

<div class="middleArea">
	<div class="tabBar">
		<button class="tab active">Nodes</button>
		<button class="tab" onclick={() => goto(`/${data.languageId}/finder/${data.collection.id}/templates`)}>Templates</button>
		<button class="tab" onclick={() => goto(`/${data.languageId}/finder/${data.collection.id}/relation-types`)}>Relation Types</button>
	</div>
	<div class="nodesArea">
		<div class="nodesContent">
			{#if treeNodes.length === 0}
				<div class="placeholder">No nodes</div>
			{:else}
				<ColumnView
					items={treeNodes}
					selectedIds={selectedNodePath}
					{onSelectionChange}
					{onReorder}
					columnWidth="220px"
					columnPadding="4px"
					itemsGap="2px"
					itemSize="28"
					{itemContent}
				/>
			{/if}
		</div>
		<div class="nodesFooter">
			<form onsubmit={onCreateNode} class="createForm">
				<Input
					placeholder="New node code"
					size="28"
					variant="accent"
					bind:value={newNodeCode}
					disabled={creating}
				/>
				<Dropdown
					size="28"
					bind:value={newNodeType}
					disabled={creating}
					options={data.nodeTypes?.map(nt => ({
						value: nt.id,
						label: nt.code
					})) || []}
				/>
			</form>
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

	.nodesArea {
		flex: 1;
		background-color: var(--base200);
		display: flex;
		flex-direction: column;
		gap: 1px;
		overflow: hidden;
	}
	.nodesContent {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1px;
		background-color: var(--base200);
	}
	.nodesFooter {
		background-color: var(--base0);
		padding: 4px;
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
	.item-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		gap: 4px;
	}
	.item-name {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: left;
	}
</style>
