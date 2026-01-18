<script>
	import { Input, Textarea, FormField, Button, LanguageTabs } from '$lib/ui';
	import { notifications } from '$lib/ui/Notification/Notification.svelte';
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { updateRelationType, deleteRelationType } from '../data.remote.js';

	let { data, relationType } = $props();

	let editCode = $state(relationType?.code || '');
	let editTitle = $state({ ...(relationType?.title || {}) });
	let editReverseTitle = $state({ ...(relationType?.reverse_title || {}) });
	let editNotes = $state(relationType?.notes || '');
	let saving = $state(false);
	let deleting = $state(false);

	// Track the last relation type id to only update when switching relation types
	let lastRelationTypeId = $state(relationType?.id);

	$effect(() => {
		if (relationType?.id !== lastRelationTypeId) {
			lastRelationTypeId = relationType?.id;
			editCode = relationType?.code || '';
			editTitle = { ...(relationType?.title || {}) };
			editReverseTitle = { ...(relationType?.reverse_title || {}) };
			editNotes = relationType?.notes || '';
		}
	});

	async function onBlur() {
		if (!relationType) return;
		const code = editCode.trim();
		const notes = editNotes.trim() || null;

		// Check if anything changed
		const hasChanges =
			code !== (relationType.code || '') ||
			notes !== relationType.notes ||
			JSON.stringify(editTitle) !== JSON.stringify(relationType.title || {}) ||
			JSON.stringify(editReverseTitle) !== JSON.stringify(relationType.reverse_title || {});

		if (!hasChanges) return;

		saving = true;
		try {
			const payload = {

				id: relationType.id,
				code: code || null,
				notes: notes
			};

			// Only include title if it changed
			if (JSON.stringify(editTitle) !== JSON.stringify(relationType.title || {})) {
				payload.title = editTitle;
			}

			// Only include reverse_title if it changed
			if (JSON.stringify(editReverseTitle) !== JSON.stringify(relationType.reverse_title || {})) {
				payload.reverse_title = editReverseTitle;
			}

			await updateRelationType(payload);
			await invalidate('app:relation-types');
			notifications.success('Saved');
		} catch (error) {
			notifications.error('Failed to save');
			// Restore original values on error
			editCode = relationType.code || '';
			editTitle = { ...(relationType.title || {}) };
			editReverseTitle = { ...(relationType.reverse_title || {}) };
			editNotes = relationType.notes || '';
		} finally {
			saving = false;
		}
	}

	async function onDelete() {
		if (!relationType) return;
		if (!confirm('Delete this relation type?')) return;

		deleting = true;
		try {
			await deleteRelationType({ id: relationType.id });
			await invalidate('app:relation-types');
			await goto(`/${data.languageId}/finder/${data.collection.id}/relation-types`);
			notifications.success('Deleted');
		} catch (error) {
			notifications.error('Failed to delete');
		} finally {
			deleting = false;
		}
	}
</script>

<div class="rightArea">
	<div class="header">
		<h2 class="title">Edit Relation Type</h2>
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
		<FormField label="Code">
			{#snippet children()}
				<Input
					id="relation-type-code"
					size="32"
					placeholder="Relation type code"
					variant="accent"
					bind:value={editCode}
					onblur={onBlur}
				/>
			{/snippet}
		</FormField>
		<FormField label="Notes">
			{#snippet children()}
				<Textarea
					id="relation-type-notes"
					placeholder="Description (optional)"
					variant="accent"
					bind:value={editNotes}
					onblur={onBlur}
				/>
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

		<!-- Translation Fields -->
		<FormField label="Title (Forward Direction)">
			{#snippet children()}
				<Input
					id="relation-type-title-{data.languageId}"
					size="32"
					placeholder="e.g. Symptom of"
					value={editTitle[data.languageId] || ''}
					oninput={(e) => {
						editTitle = { ...editTitle, [data.languageId]: e.target.value };
					}}
					onblur={onBlur}
				/>
			{/snippet}
		</FormField>

		<FormField label="Reverse Title (Reverse Direction)">
			{#snippet children()}
				<Input
					id="relation-type-reverse-title-{data.languageId}"
					size="32"
					placeholder="e.g. Has symptoms"
					value={editReverseTitle[data.languageId] || ''}
					oninput={(e) => {
						editReverseTitle = { ...editReverseTitle, [data.languageId]: e.target.value };
					}}
					onblur={onBlur}
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
	.sid {
		font-size: 14px;
		color: var(--base400);
		margin-left: auto;
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
	hr {
		border: none;
		border-top: 1px solid var(--base200);
		margin: 8px 0;
	}
</style>
