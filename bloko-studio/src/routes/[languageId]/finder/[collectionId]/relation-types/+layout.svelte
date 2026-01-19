<script>
	import { SelectableItem, Input } from '$lib/ui';
	import { page } from '$app/stores';
	import { goto, invalidate } from '$app/navigation';
	import { notifications } from '$lib/ui/Notification/Notification.svelte';
	import { createRelationType } from '../../data.remote.js';

	let { data, children } = $props();

	let newRelationTypeCode = $state('');
	let creatingRelationType = $state(false);

	// Extract selected relation type from URL
	let selectedRelationTypeId = $derived(
		$page.params.relationTypeId || null
	);

	async function onCreateRelationType(e) {
		e?.preventDefault?.();
		const code = newRelationTypeCode.trim();
		if (!code) return;

		creatingRelationType = true;
		try {
			const created = await createRelationType({

				_collection: data.collection.id,
				code,
				title: {},
				reverse_title: {},
				notes: null
			});
			await invalidate('app:relation-types');
			newRelationTypeCode = '';
			goto(`/${data.languageId}/finder/${data.collection.id}/relation-types/${created.id}`);
			notifications.success('Relation type created');
		} catch (error) {
			notifications.error('Failed to create relation type');
		} finally {
			creatingRelationType = false;
		}
	}
</script>

<div class="middleArea">
	<div class="tabBar">
		<button class="tab" onclick={() => goto(`/${data.languageId}/finder/${data.collection.id}/nodes`)}>Nodes</button>
		<button class="tab" onclick={() => goto(`/${data.languageId}/finder/${data.collection.id}/templates`)}>Templates</button>
		<button class="tab active">Relation Types</button>
	</div>
	<div class="relationTypesArea">
		<div class="relationTypesColumn">
			<div class="columnContent">
				{#if data.relationTypes.length === 0}
					<div class="placeholder">No relation types</div>
				{:else}
					{#each data.relationTypes as relationType}
						<SelectableItem
							selected={selectedRelationTypeId === relationType.id}
							onclick={() => {
								if (selectedRelationTypeId === relationType.id) {
									goto(`/${data.languageId}/finder/${data.collection.id}/relation-types`);
								} else {
									goto(`/${data.languageId}/finder/${data.collection.id}/relation-types/${relationType.id}`);
								}
							}}
						>
							{relationType.code || `Relation Type ${relationType.id}`}
						</SelectableItem>
					{/each}
				{/if}
			</div>
			<div class="columnFooter">
				<form onsubmit={onCreateRelationType} class="createForm">
					<Input
						placeholder="New relation type code"
						size="28"
						variant="accent"
						bind:value={newRelationTypeCode}
						disabled={creatingRelationType}
					/>
				</form>
			</div>
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

	.relationTypesArea {
		flex: 1;
		background-color: var(--base200);
		display: flex;
		flex-direction: row;
		gap: 1px;
		overflow: hidden;
	}
	.relationTypesColumn {
		width: 220px;
		flex: 0 0 220px;
		display: flex;
		flex-direction: column;
		gap: 1px;
		background-color: var(--base200);
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
