<script>
	import { TreeView, Input } from '$lib/ui';
	import { page } from '$app/stores';
	import { goto, invalidate } from '$app/navigation';
	import { notifications } from '$lib/ui/Notification/Notification.svelte';
	import { createCollection, updateCollectionSort } from './data.remote.js';

	let { data, children } = $props();

	let selectedCollectionId = $derived($page.params.collectionId || null);
	let newCollectionCode = $state('');
	let creating = $state(false);

	// Build tree items for TreeView
	let treeItems = $derived(
		data.collections.map((collection) => ({
			id: collection.id,
			name: collection.code,
			collectionId: collection.id,
			order: collection.sort
		}))
	);

	function selectCollection(itemId) {
		const item = treeItems.find((t) => t.id === itemId);
		if (!item) return;

		// If clicking the same collection, deselect it
		if (selectedCollectionId === item.collectionId) {
			goto(`/${data.languageId}/finder`);
		} else {
			goto(`/${data.languageId}/finder/${item.collectionId}/nodes`);
		}
	}

	async function onReorder(updates) {
		try {
			const sortUpdates = updates.map(({ itemId, order }) => {
				const item = treeItems.find((t) => t.id === itemId);
				if (!item) return null;

				return {
					id: item.collectionId,
					sort: order
				};
			}).filter(Boolean);

			await updateCollectionSort({ updates: sortUpdates });
			await invalidate('app:collections');
		} catch (error) {
			notifications.error('Failed to save order');
		}
	}

	async function onCreateCollection(e) {
		e?.preventDefault?.();
		const code = newCollectionCode.trim();
		if (!code) return;

		creating = true;
		try {
			const created = await createCollection({ code, notes: null });
			await invalidate('app:collections');
			newCollectionCode = '';
			notifications.success('Collection created');
			goto(`/${data.languageId}/finder/${created.id}/nodes`);
		} catch (error) {
			notifications.error('Failed to create collection');
		} finally {
			creating = false;
		}
	}
</script>

<div class="container">
	<div class="leftArea">
		<div class="leftHeader">Collections</div>
		<div class="leftContent">
			{#if data.collections.length === 0}
				<div class="empty">No collections</div>
			{:else}
				<TreeView
					items={treeItems}
					allowNesting={false}
					selectedId={selectedCollectionId}
					onSelect={selectCollection}
					{onReorder}
					gap="2px"
				/>
			{/if}
		</div>
		<div class="leftFooter">
			<form onsubmit={onCreateCollection} class="createForm">
				<Input
					placeholder="New collection code"
					size="28"
					variant="accent"
					bind:value={newCollectionCode}
					disabled={creating}
				/>
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
		width: 220px;
		background-color: var(--base200);
		height: 100%;
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1px;
	}
	.leftHeader {
		background-color: var(--base100);
		height: 32px;
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
	.createForm {
		display: flex;
		width: 100%;
	}
	.empty {
		padding: 8px 10px;
		color: var(--base600);
		font-size: 13px;
	}
</style>
