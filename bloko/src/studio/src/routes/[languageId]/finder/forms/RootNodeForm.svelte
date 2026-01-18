<script>
	import { Input, Textarea, FormField, Button, LabeledText } from '$lib/ui';
	import { notifications } from '$lib/ui/Notification/Notification.svelte';
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { updateRootNode, deleteRootNode } from '../data.remote.js';
	import { detailedMode } from '$lib/globals.svelte.js';

	let { data } = $props();

	let editCode = $state(data.collection?.code || '');
	let editNotes = $state(data.collection?.notes || '');
	let saving = $state(false);
	let deleting = $state(false);

	// Track the last root node id to only update when switching root nodes
	let lastRootNodeId = $state(data.collection?.id);

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

	$effect(() => {
		if (data.collection?.id !== lastRootNodeId) {
			lastRootNodeId = data.collection?.id;
			editCode = data.collection?.code || '';
			editNotes = data.collection?.notes || '';
		}
	});

	async function onBlur() {
		if (!data.collection) return;
		const code = editCode.trim();
		const notes = editNotes.trim() || null;

		if (code === (data.collection.code || '') && notes === data.collection.notes) return;

		saving = true;
		try {
			await updateRootNode({
				id: data.collection.id,
				code: code || null,
				notes: notes
			});
			await invalidate('app:root-nodes');
			notifications.success('Saved');
		} catch (error) {
			notifications.error('Failed to save');
			// Restore original values on error
			editCode = data.collection.code || '';
			editNotes = data.collection.notes || '';
		} finally {
			saving = false;
		}
	}

	async function onDelete() {
		if (!data.collection) return;
		if (!confirm('Delete this root node? This will delete all templates, nodes, and related data.')) return;

		deleting = true;
		try {
			await deleteRootNode({ id: data.collection.id });
			await goto(`/${data.languageId}/finder`);
			await invalidate('app:root-nodes');
			notifications.success('Root node deleted');
		} catch (error) {
			notifications.error('Failed to delete');
		} finally {
			deleting = false;
		}
	}
</script>

<div class="root-node-form">
	<div class="header">
		<span class="title">Root Node</span>
		<span class="id">id: {data.collection?.id}</span>
	</div>

	{#if detailedMode.value}
		<div class="metadata">
			<LabeledText label="created_at" text={formatTimestamp(data.collection?.created_at)} textSize="12px" textColor="var(--base600)" labelColor="var(--base300)" />
			<LabeledText label="updated_at" text={formatTimestamp(data.collection?.updated_at)} textSize="12px" textColor="var(--base600)" labelColor="var(--base300)" />
		</div>
	{/if}

	<FormField label="code" hint="Unique identifier">
		<Input
			id="root-node-code"
			bind:value={editCode}
			size="28"
			placeholder="root-node-code"
			onblur={onBlur}
			disabled={saving}
		/>
	</FormField>

	<FormField label="notes" hint="Description">
		<Textarea
			id="root-node-notes"
			bind:value={editNotes}
			size="28"
			placeholder="Notes..."
			onblur={onBlur}
			disabled={saving}
			rows={3}
		/>
	</FormField>

	<div class="actions">
		<Button
			intent="danger"
			onclick={onDelete}
			loading={deleting}
			disabled={saving}
			size="28"
		>
			Delete Root Node
		</Button>
	</div>
</div>

<style>
	.root-node-form {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 20px;
		background: var(--base0);
		border-radius: 4px;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 12px;
		border-bottom: 1px solid var(--base200);
	}

	.title {
		font-size: 14px;
		font-weight: 600;
		color: var(--base800);
	}

	.id {
		font-size: 11px;
		font-family: 'Courier New', monospace;
		color: var(--base500);
	}

	.metadata {
		display: flex;
		gap: 16px;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		padding-top: 12px;
		border-top: 1px solid var(--base200);
	}
</style>
