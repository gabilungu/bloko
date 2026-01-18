<script>
	import { Input, Textarea, FormField, Button, LabeledText } from '$lib/ui';
	import { notifications } from '$lib/ui/Notification/Notification.svelte';
	import { goto, invalidate } from '$app/navigation';
	import { updateRootNode, deleteRootNode } from '../data.remote.js';
	import { detailedMode } from '$lib/globals.svelte.js';

	let { data } = $props();

	let editCode = $state(data.collection?.code || '');
	let editNotes = $state(data.collection?.notes || '');
	let saving = $state(false);
	let deleting = $state(false);

	// Track the last collection id to only update when switching collections
	let lastCollectionId = $state(data.collection?.id);

	$effect(() => {
		if (data.collection?.id !== lastCollectionId) {
			lastCollectionId = data.collection?.id;
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
			await invalidate('app:collections');
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
		if (!confirm('Delete this collection? This will delete all templates, nodes, and related data.')) return;

		deleting = true;
		try {
			await deleteRootNode({ id: data.collection.id });
			await goto(`/${data.languageId}/finder`);
			await invalidate('app:collections');
			notifications.success('Collection deleted');
		} catch (error) {
			notifications.error('Failed to delete');
		} finally {
			deleting = false;
		}
	}
</script>

<div class="rightArea">
	<div class="header">
		<h2 class="title">Edit Collection</h2>
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
				<LabeledText label="id" text={String(data.collection?.id ?? '')} textSize="12px" textColor="var(--base600)" labelColor="var(--base300)" />
				<LabeledText label="sort" text={String(data.collection?.sort ?? '')} textSize="12px" textColor="var(--base600)" labelColor="var(--base300)" />
			</div>
		{/if}
		<FormField label="Code">
			{#snippet children()}
				<Input
					id="collection-code"
					size="32"
					placeholder="Collection code"
					variant="accent"
					bind:value={editCode}
					onblur={onBlur}
				/>
			{/snippet}
		</FormField>
		<FormField label="Notes">
			{#snippet children()}
				<Textarea
					id="collection-notes"
					placeholder="Description (optional)"
					variant="accent"
					bind:value={editNotes}
					onblur={onBlur}
					rows={3}
				/>
			{/snippet}
		</FormField>
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
	.metaRow {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
</style>
