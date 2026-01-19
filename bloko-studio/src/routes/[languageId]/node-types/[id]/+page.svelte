<script>
	import { page } from '$app/stores';
	import { goto, invalidate } from '$app/navigation';
	import { Input, FormField, Button, LabeledText, LanguageTabs } from '$lib/ui';
	import { notifications } from '$lib/ui/Notification/Notification.svelte';
	import { updateNodeType, deleteNodeType } from '../data.remote.js';

	let { data } = $props();

	let editCode = $state(data.nodeType?.code ?? '');
	let editTitle = $state({ ...(data.nodeType?.title || {}) });
	let editNotes = $state(data.nodeType?.notes ?? '');
	let saving = $state(false);
	let deleting = $state(false);
	let lastSyncKey = $state('');

	// Sync only when selected node type (route id) changes
	$effect(() => {
		if (saving) return;
		const selectedId = $page.params.id;
		if (selectedId !== lastSyncKey) {
			editCode = data.nodeType?.code ?? '';
			editTitle = { ...(data.nodeType?.title || {}) };
			editNotes = data.nodeType?.notes ?? '';
			lastSyncKey = selectedId;
		}
	});

	async function onBlur() {
		const code = editCode.trim();
		if (!code || !data.nodeType) return;

		const current = data.nodeType;

		// Check if anything changed
		const hasChanges =
			code !== current.code ||
			JSON.stringify(editTitle) !== JSON.stringify(current.title || {}) ||
			(editNotes.trim() || null) !== current.notes;

		if (!hasChanges) return;

		saving = true;
		try {
			const updated = await updateNodeType({
				id: $page.params.id,
				updates: {
					code,
					title: editTitle,
					notes: editNotes.trim() || null,
				},
			});

			// Update local state immediately
			editCode = updated.code;
			editTitle = { ...(updated.title || {}) };
			editNotes = updated.notes ?? '';
			lastSyncKey = $page.params.id;

			await invalidate('app:node-types');

			notifications.success('Saved');
		} catch (e) {
			notifications.error('Failed to save');
		} finally {
			saving = false;
		}
	}

	async function onDelete() {
		if (!data.nodeType) return;
		if (!confirm('Delete this node type?')) return;

		deleting = true;
		try {
			await deleteNodeType({  id: $page.params.id });
			await invalidate('app:node-types');
			goto(`/${data.languageId}/node-types`);
			notifications.success('Deleted');
		} catch (e) {
			notifications.error('Failed to delete');
		} finally {
			deleting = false;
		}
	}
</script>

<div class="mainContent">
	{#if data.nodeType}
		<div class="editor">
			<LabeledText label="ID" text={data.nodeType.id} />
			<FormField label="Code">
				{#snippet children()}
					<Input id="nt-code" size="32" variant="accent" placeholder="Node type code" bind:value={editCode} onblur={onBlur} />
				{/snippet}
			</FormField>
			<FormField label="Notes">
				{#snippet children()}
					<Input id="nt-notes" size="32" variant="accent" placeholder="Description (optional)" bind:value={editNotes} onblur={onBlur} />
				{/snippet}
			</FormField>

			<hr />

			<!-- Language Tabs -->
			<LanguageTabs
				languages={data.languages}
				activeLanguage={data.languageId}
				onclick={(lang) => {
					const currentPath = $page.url.pathname;
					const newPath = currentPath.replace(/^\/[^\/]+/, `/${lang}`);
					goto(newPath);
				}}
			/>

			<!-- Title Field (Multi-language) -->
			<FormField label="Title">
				{#snippet children()}
					<Input
						id="nt-title-{data.languageId}"
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

			<div class="actions">
				<Button label="Delete" intent="danger" size="28" type="button" onclick={onDelete} disabled={deleting || saving} />
			</div>
		</div>
	{:else}
		<p class="error">Node type not found</p>
	{/if}
</div>

<style>
	.mainContent {
		background-color: var(--base0);
		width: 100%;
		padding: 32px;
	}
	.editor {
		max-width: 520px;
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;
	}
	.actions {
		display: flex;
		gap: 8px;
	}
	.error {
		color: var(--danger500);
		font-size: 14px;
	}
	hr {
		border: none;
		border-top: 1px solid var(--base200);
		margin: 8px 0;
	}
</style>
