<script>
	import { Input, Textarea, FormField, Button, LabeledText, LanguageTabs } from '$lib/ui';
	import { notifications } from '$lib/ui/Notification/Notification.svelte';
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { updateTemplate, deleteTemplate } from '../data.remote.js';
	import { detailedMode } from '$lib/globals.svelte.js';

	let { data, template } = $props();

	let editCode = $state(template?.code || '');
	let editTitle = $state({ ...(template?.title || {}) });
	let editNotes = $state(template?.notes || '');
	let saving = $state(false);
	let deleting = $state(false);

	// Track the last template id to only update when switching templates
	let lastTemplateId = $state(template?.id);

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
		if (template?.id !== lastTemplateId) {
			lastTemplateId = template?.id;
			editCode = template?.code || '';
			editTitle = { ...(template?.title || {}) };
			editNotes = template?.notes || '';
		}
	});

	async function onBlur() {
		if (!template) return;
		const code = editCode.trim();
		const notes = editNotes.trim() || null;

		// Check if anything changed
		const hasChanges =
			code !== (template.code || '') ||
			notes !== template.notes ||
			JSON.stringify(editTitle) !== JSON.stringify(template.title || {});

		if (!hasChanges) return;

		saving = true;
		try {
			const payload = {

				id: template.id,
				code: code || null,
				notes: notes
			};

			// Only include title if it changed
			if (JSON.stringify(editTitle) !== JSON.stringify(template.title || {})) {
				payload.title = editTitle;
			}

			await updateTemplate(payload);
			await invalidate('app:templates');
			notifications.success('Saved');
		} catch (error) {
			notifications.error('Failed to save');
			// Restore original values on error
			editCode = template.code || '';
			editTitle = { ...(template.title || {}) };
			editNotes = template.notes || '';
		} finally {
			saving = false;
		}
	}

	async function onDelete() {
		if (!template) return;
		if (!confirm('Delete this template?')) return;

		deleting = true;
		try {
			await deleteTemplate({ id: template.id });
			await invalidate('app:templates');
			await goto(`/${data.languageId}/finder/${data.collection.id}/templates`);
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
		<h2 class="title">Edit Template</h2>
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
			<div class="row">
				<LabeledText label="id" text={String(template?.id ?? '')} textSize="12px" textColor="var(--base600)" labelColor="var(--base300)" />
			</div>
		{/if}
		<FormField label="Code">
			{#snippet children()}
				<Input
					id="template-code"
					size="32"
					placeholder="Template code"
					variant="accent"
					bind:value={editCode}
					onblur={onBlur}
				/>
			{/snippet}
		</FormField>
		{#if detailedMode.value}
			<FormField label="Notes">
				{#snippet children()}
					<Textarea
						id="template-notes"
						placeholder="Description (optional)"
						variant="accent"
						bind:value={editNotes}
						onblur={onBlur}
					/>
				{/snippet}
			</FormField>
		{/if}

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
		<FormField label="Title">
			{#snippet children()}
				<Input
					id="template-title-{data.languageId}"
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
	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
	hr {
		border: none;
		border-top: 1px solid var(--base200);
		margin: 8px 0;
	}
</style>
