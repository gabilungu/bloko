<script>
	import { Input, TreeView } from '$lib/ui';
	import { page } from '$app/stores';
	import { goto, invalidate } from '$app/navigation';
	import { notifications } from '$lib/ui/Notification/Notification.svelte';
	import { createLanguage, updateLanguage } from './data.remote.js';

	let { data, children } = $props();

	let newId = $state('');
	let newTitle = $state('');
	let creating = $state(false);

	let selectedId = $derived($page.params.id || null);

	// Transform items for TreeView (show only the code in the sidebar)
	let treeItems = $derived(
		data.languages.map((item, index) => ({
			id: index,
			langId: item.id,
			name: item.id,
			order: item.sort ?? 999999,
		}))
	);

	// Find selected tree item ID based on selectedId
	let selectedTreeId = $derived(treeItems.find((t) => t.langId === selectedId)?.id ?? null);

	function selectLanguage(id) {
		const treeItem = treeItems[id];
		if (!treeItem) return;

		// If clicking the same language, deselect it
		if (selectedId === treeItem.langId) {
			goto(`/languages`);
		} else {
			goto(`/languages/${treeItem.langId}`);
		}
	}

	async function onCreate(e) {
		e?.preventDefault?.();
		const id = newId.trim();
		const title = newTitle.trim();
		if (!id || !title) return;

		creating = true;
		try {
			const maxSort = data.languages.reduce((max, item) => Math.max(max, item.sort ?? 0), -1);

			const created = await createLanguage({
				id,
				title,
				sort: maxSort + 1,
			});

			await invalidate('app:languages');
			newId = '';
			newTitle = '';
			goto(`/languages/${created.id}`);
			notifications.success('Language created');
		} catch (error) {
			notifications.error('Failed to create language');
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

					return updateLanguage({
						id: treeItem.langId,
						updates: { sort: order },
					});
				})
				.filter(Boolean);

			await Promise.all(updatePromises);
			await invalidate('app:languages');
			notifications.success('Order updated');
		} catch (error) {
			notifications.error('Failed to save order');
		}
	}
</script>

<div class="container">
	<div class="leftArea">
		<div class="leftHeader">Languages</div>
		<div class="leftContent">
			{#if data.languages.length === 0}
				<div class="empty">No languages</div>
			{:else}
				<TreeView items={treeItems} allowNesting={false} selectedId={selectedTreeId} onSelect={selectLanguage} {onReorder} gap="2px" />
			{/if}
		</div>
		<div class="leftFooter">
			<form onsubmit={onCreate} class="createForm">
				<Input placeholder="ID (e.g. en)" size="28" bind:value={newId} />
				<Input placeholder="Title (e.g. English)" size="28" bind:value={newTitle} />
				<button type="submit" hidden></button>
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
		flex-direction: column;
		gap: 4px;
	}
</style>
