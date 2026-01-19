<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { invalidate } from '$app/navigation';
	import { Input, FormField, Button, LabeledText } from '$lib/ui';
	import { notifications } from '$lib/ui/Notification/Notification.svelte';
	import { updateLanguage, deleteLanguage } from '../data.remote.js';

	let { data } = $props();

	let editId = $state(data.language?.id ?? '');
	let editTitle = $state(data.language?.title ?? '');
	let saving = $state(false);
	let deleting = $state(false);

	// Track when we've last synced inputs from server data
	let lastSyncKey = $state('');

	// Sync with data when navigating - but only if not currently saving
	$effect(() => {
		if (saving) return; // Don't sync while saving
		const selectedId = $page.params.id; // React to route param instead of server data
		// Only sync when the selected language changes
		if (selectedId !== lastSyncKey) {
			editId = data.language?.id ?? selectedId ?? '';
			editTitle = data.language?.title ?? '';
			lastSyncKey = selectedId;
		}
	});

	async function onBlur() {
		const id = editId.trim();
		const title = editTitle.trim();
		if (!id || !data.language) return;

		// Check if anything changed
		if (data.language.id === id && data.language.title === title) return;

		saving = true;
		try {
			const updated = await updateLanguage({
				id: $page.params.id,
				updates: {
					newId: id !== $page.params.id ? id : undefined,
					title: title || null,
				},
			});

			// Update local state immediately with server response
			editId = updated.id;
			editTitle = updated.title ?? '';
			lastSyncKey = $page.params.id;

			await invalidate('app:languages');

			// If ID changed, navigate to new URL
			if (updated.id !== $page.params.id) {
				goto(`/languages/${updated.id}`);
			}

			notifications.success('Saved');
		} catch (error) {
			notifications.error('Failed to save');
		} finally {
			saving = false;
		}
	}

	async function onDelete() {
		if (!data.language) return;
		if (!confirm('Delete this language?')) return;

		deleting = true;
		try {
			await deleteLanguage({  id: $page.params.id });
			await invalidate('app:languages');
			goto(`/languages`);
			notifications.success('Deleted');
		} catch (error) {
			notifications.error('Failed to delete');
		} finally {
			deleting = false;
		}
	}
</script>

<div class="mainContent">
	{#if data.language}
		<div class="editor">
			<FormField label="ID (Code)">
				{#snippet children()}
					<Input id="lang-id" size="32" variant="accent" placeholder="Language ID (e.g., en, ro)" bind:value={editId} onblur={onBlur} />
				{/snippet}
			</FormField>
			<FormField label="Title">
				{#snippet children()}
					<Input id="lang-title" size="32" variant="accent" placeholder="Language title (e.g., English, Română)" bind:value={editTitle} onblur={onBlur} />
				{/snippet}
			</FormField>
			<div class="actions">
				<Button label="Delete" intent="danger" size="28" type="button" onclick={onDelete} disabled={deleting || saving} />
			</div>
		</div>
	{:else}
		<p class="error">Language not found</p>
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
</style>
