<script>
	import { Button, Dropdown } from '$lib/ui';
	import { notifications } from '$lib/ui/Notification/Notification.svelte';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { createRelation, deleteRelation, getNodesForRelation } from '../data.remote.js';

	let { data, node, outgoingRelations, incomingRelations } = $props();

	// State for creating a new relation
	let creating = $state(false);
	let creatingIncoming = $state(false); // true for incoming, false for outgoing
	let saving = $state(false);
	let selectedRelationType = $state('');
	let selectedCollection = $state(data.collection.id);
	let selectedNodeType = $state('ALL');
	let selectedOtherNode = $state('');
	let availableNodes = $state([]);

	// Load available nodes when collection or node type changes
	$effect(() => {
		if (creating && selectedCollection) {
			loadAvailableNodes();
		}
	});

	async function loadAvailableNodes() {
		try {
			const nodes = await getNodesForRelation({

				collectionId: selectedCollection,
				nodeType: selectedNodeType === 'ALL' ? null : selectedNodeType,
				excludeNodeId: node.id
			});
			availableNodes = nodes;
			// Reset selected node when options change
			selectedOtherNode = '';
		} catch (error) {
			console.error('Failed to load nodes:', error);
			notifications.error('Failed to load nodes');
		}
	}

	function startCreatingOutgoing() {
		creating = true;
		creatingIncoming = false;
		selectedRelationType = '';
		selectedCollection = data.collection.id;
		selectedNodeType = 'ALL';
		selectedOtherNode = '';
		availableNodes = [];
		loadAvailableNodes();
	}

	function startCreatingIncoming() {
		creating = true;
		creatingIncoming = true;
		selectedRelationType = '';
		selectedCollection = data.collection.id;
		selectedNodeType = 'ALL';
		selectedOtherNode = '';
		availableNodes = [];
		loadAvailableNodes();
	}

	function cancelCreating() {
		creating = false;
		creatingIncoming = false;
		selectedRelationType = '';
		selectedCollection = data.collection.id;
		selectedNodeType = 'ALL';
		selectedOtherNode = '';
		availableNodes = [];
	}

	async function onCreate() {
		if (!selectedRelationType || !selectedOtherNode) {
			notifications.error('Please select a relation type and target node');
			return;
		}

		saving = true;
		try {
			const _from = creatingIncoming ? selectedOtherNode : node.id;
			const _to = creatingIncoming ? node.id : selectedOtherNode;

			await createRelation({
				_node_relation_type: selectedRelationType,
				_from,
				_to
			});

			await invalidate('app:nodes');
			notifications.success('Relation created');
			cancelCreating();
		} catch (error) {
			console.error('Create relation error:', error);
			notifications.error('Failed to create relation');
		} finally {
			saving = false;
		}
	}

	async function onDelete(relationId) {
		if (!confirm('Delete this relation?')) return;

		saving = true;
		try {
			await deleteRelation({

				id: relationId
			});

			await invalidate('app:nodes');
			notifications.success('Relation deleted');
		} catch (error) {
			console.error('Delete relation error:', error);
			notifications.error('Failed to delete relation');
		} finally {
			saving = false;
		}
	}

	// Get relation types for the current collection
	let relationTypes = $derived(data.relationTypes || []);

	// Compute preview text
	let previewText = $derived.by(() => {
		const relationType = relationTypes.find(rt => rt.id === selectedRelationType);
		const otherNode = availableNodes.find(n => n.id === selectedOtherNode);

		if (!relationType || !otherNode) return '';

		if (creatingIncoming) {
			// For incoming: other_node - relation -> this_node
			return `${otherNode.code} - ${relationType.code} -> ${node.code}`;
		} else {
			// For outgoing: this_node - relation -> other_node
			return `${node.code} - ${relationType.code} -> ${otherNode.code}`;
		}
	});
</script>

<div class="relationsWrapper">
	<!-- Outgoing Relations Section -->
	<div class="sectionHeader">
		<div class="sectionTitle">Outgoing Relations</div>
		<Button
			label="+ Add Relation"
			intent="secondary"
			size="24"
			type="button"
			onclick={startCreatingOutgoing}
			disabled={saving || creating}
		/>
	</div>

	{#if creating && !creatingIncoming}
		<div class="createRelationForm">
			{#if previewText}
				<div class="previewText">{previewText}</div>
			{/if}

			<div class="formRow">
				<div class="formField">
					<label class="label">Relation Type</label>
					<Dropdown
						size="24"
						bind:value={selectedRelationType}
						options={relationTypes.map((rt) => ({
							value: rt.id,
							label: rt.code
						}))}
						disabled={saving}
					/>
				</div>
			</div>

			<div class="formRow">
				<div class="formField">
					<label class="label">Collection</label>
					<Dropdown
						size="24"
						bind:value={selectedCollection}
						onchange={loadAvailableNodes}
						options={data.collections?.map((c) => ({
							value: c.id,
							label: c.code
						})) || []}
						disabled={saving}
					/>
				</div>

				<div class="formField">
					<label class="label">Node Type</label>
					<Dropdown
						size="24"
						bind:value={selectedNodeType}
						onchange={loadAvailableNodes}
						options={[
							{ value: 'ALL', label: 'ALL' },
							...data.nodeTypes?.map((nt) => ({
								value: nt.id,
								label: nt.code
							})) || []
						]}
						disabled={saving}
					/>
				</div>

				<div class="formField">
					<label class="label">Target Node</label>
					<Dropdown
						size="24"
						bind:value={selectedOtherNode}
						options={availableNodes.map((n) => ({
							value: n.id,
							label: n.code
						}))}
						disabled={saving || availableNodes.length === 0}
					/>
				</div>
			</div>

			<div class="formActions">
				<Button
					label="Create"
					intent="primary"
					size="24"
					type="button"
					onclick={onCreate}
					disabled={saving || !selectedRelationType || !selectedOtherNode}
				/>
				<Button
					label="Cancel"
					intent="secondary"
					size="24"
					type="button"
					onclick={cancelCreating}
					disabled={saving}
				/>
			</div>
		</div>
	{/if}

	{#if outgoingRelations && outgoingRelations.length > 0}
		<div class="relationsList">
			{#each outgoingRelations as relation}
				<div class="relationItem">
					<span class="relationText">
						<span class="nodeCode">{node.code}</span>
						<span class="relationCode">{relation.relation_type_code}</span>
						<span class="nodeCode">{relation.to_node_code}</span>
					</span>
					<Button
						label="×"
						intent="danger"
						size="24"
						type="button"
						onclick={() => onDelete(relation.id)}
						disabled={saving}
					/>
				</div>
			{/each}
		</div>
	{:else if !creating || creatingIncoming}
		<div class="emptyState">No outgoing relations</div>
	{/if}

	<!-- Incoming Relations Section -->
	<div class="sectionHeader">
		<div class="sectionTitle">Incoming Relations</div>
		<Button
			label="+ Add Relation"
			intent="secondary"
			size="24"
			type="button"
			onclick={startCreatingIncoming}
			disabled={saving || creating}
		/>
	</div>

	{#if creating && creatingIncoming}
		<div class="createRelationForm">
			{#if previewText}
				<div class="previewText">{previewText}</div>
			{/if}

			<div class="formRow">
				<div class="formField">
					<label class="label">Relation Type</label>
					<Dropdown
						size="24"
						bind:value={selectedRelationType}
						options={relationTypes.map((rt) => ({
							value: rt.id,
							label: rt.code
						}))}
						disabled={saving}
					/>
				</div>
			</div>

			<div class="formRow">
				<div class="formField">
					<label class="label">Collection</label>
					<Dropdown
						size="24"
						bind:value={selectedCollection}
						onchange={loadAvailableNodes}
						options={data.collections?.map((c) => ({
							value: c.id,
							label: c.code
						})) || []}
						disabled={saving}
					/>
				</div>

				<div class="formField">
					<label class="label">Node Type</label>
					<Dropdown
						size="24"
						bind:value={selectedNodeType}
						onchange={loadAvailableNodes}
						options={[
							{ value: 'ALL', label: 'ALL' },
							...data.nodeTypes?.map((nt) => ({
								value: nt.id,
								label: nt.code
							})) || []
						]}
						disabled={saving}
					/>
				</div>

				<div class="formField">
					<label class="label">Source Node</label>
					<Dropdown
						size="24"
						bind:value={selectedOtherNode}
						options={availableNodes.map((n) => ({
							value: n.id,
							label: n.code
						}))}
						disabled={saving || availableNodes.length === 0}
					/>
				</div>
			</div>

			<div class="formActions">
				<Button
					label="Create"
					intent="primary"
					size="24"
					type="button"
					onclick={onCreate}
					disabled={saving || !selectedRelationType || !selectedOtherNode}
				/>
				<Button
					label="Cancel"
					intent="secondary"
					size="24"
					type="button"
					onclick={cancelCreating}
					disabled={saving}
				/>
			</div>
		</div>
	{/if}

	{#if incomingRelations && incomingRelations.length > 0}
		<div class="relationsList">
			{#each incomingRelations as relation}
				<div class="relationItem">
					<span class="relationText">
						<span class="nodeCode">{relation.from_node_code}</span>
						<span class="relationCode">{relation.relation_type_code}</span>
						<span class="nodeCode">{node.code}</span>
					</span>
					<Button
						label="×"
						intent="danger"
						size="24"
						type="button"
						onclick={() => onDelete(relation.id)}
						disabled={saving}
					/>
				</div>
			{/each}
		</div>
	{:else if !creating || !creatingIncoming}
		<div class="emptyState">No incoming relations</div>
	{/if}
</div>

<style>
	.relationsWrapper {
		display: flex;
		flex-direction: column;
		gap: 16px;
		width: 100%;
	}

	.sectionHeader {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.sectionTitle {
		font-size: 14px;
		font-weight: 600;
		color: var(--base700);
	}

	.createRelationForm {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 16px;
		background-color: var(--base50);
		border: 1px solid var(--base200);
		border-radius: 4px;
	}

	.previewText {
		padding: 12px;
		background-color: var(--base100);
		border: 1px solid var(--base300);
		border-radius: 4px;
		font-size: 14px;
		font-weight: 600;
		color: var(--base700);
		text-align: center;
	}

	.formRow {
		display: flex;
		gap: 12px;
		align-items: flex-end;
	}

	.formField {
		display: flex;
		flex-direction: column;
		gap: 4px;
		flex: 1;
	}

	.label {
		font-size: 12px;
		font-weight: 500;
		color: var(--base600);
	}

	.formActions {
		display: flex;
		gap: 8px;
		justify-content: flex-end;
	}

	.relationsList {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.relationItem {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		padding: 8px 12px;
		background-color: var(--base50);
		border: 1px solid var(--base200);
		border-radius: 4px;
	}

	.relationText {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
	}

	.nodeCode {
		font-weight: 600;
		color: var(--base700);
	}

	.relationCode {
		color: var(--base500);
		font-style: italic;
	}

	.emptyState {
		padding: 16px;
		text-align: center;
		color: var(--base400);
		font-size: 14px;
	}
</style>
