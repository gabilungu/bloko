<script>
	import { Input, Textarea, FormField, Button, Dropdown, LabeledText, LanguageTabs } from '$lib/ui';
	import { notifications } from '$lib/ui/Notification/Notification.svelte';
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { updateBlock, deleteBlock } from '../data.remote.js';
	import { detailedMode } from '$lib/globals.svelte.js';

	let { data, block } = $props();

	let editCode = $state(block?.code || '');
	let editNotes = $state(block?.notes || '');
	let editContentType = $state(block?.content_type || '');
	let saving = $state(false);
	let deleting = $state(false);

	// Translation fields - initialize from block
	let editTitle = $state({ ...(block?.title || {}) });

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

	// Only reset edit fields when switching to a different block
	let lastBlockId = $state(block?.id);
	$effect(() => {
		if (block?.id !== lastBlockId) {
			lastBlockId = block?.id;
			editCode = block?.code || '';
			editNotes = block?.notes || '';
			editContentType = block?.content_type || '';
			editTitle = { ...(block?.title || {}) };
		}
	});

	async function onBlur() {
		if (!block) return;
		const code = editCode.trim() || null;
		const notes = editNotes.trim() || null;
		const contentType = editContentType || null;

		// Check if anything changed
		const hasChanges =
			code !== block.code ||
			notes !== block.notes ||
			contentType !== block.content_type ||
			JSON.stringify(editTitle) !== JSON.stringify(block.title || {});

		if (!hasChanges) return;

		saving = true;
		try {
			const payload = {

				id: block.id,
				code,
				notes,
				content_type: contentType
			};

			// Only include translation fields if they changed
			if (JSON.stringify(editTitle) !== JSON.stringify(block.title || {})) {
				payload.title = editTitle;
			}

			await updateBlock(payload);
			await invalidate('app:blocks');
			notifications.success('Saved');
		} catch (error) {
			console.error('Save error:', error);
			notifications.error('Failed to save');
			// Restore original values on error
			editCode = block.code || '';
			editNotes = block.notes || '';
			editContentType = block?.content_type || '';
			editTitle = { ...(block?.title || {}) };
		} finally {
			saving = false;
		}
	}

	async function onDelete() {
		if (!block) return;
		if (!confirm('Delete this block? This will delete all child blocks.')) return;

		deleting = true;
		try {
			await deleteBlock({ id: block.id });
			await invalidate('app:blocks');
			goto(`/${data.languageId}/finder/${data.collection.id}/templates/${data.template.id}`);
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
		<h2 class="title">Edit Block</h2>
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
				<LabeledText label="id" text={String(block?.id ?? '')} textSize="12px" textColor="var(--base600)" labelColor="var(--base300)" />
				<LabeledText label="sort" text={String(block?.sort ?? '')} textSize="12px" textColor="var(--base600)" labelColor="var(--base300)" />
			</div>
		{/if}
		<FormField label="Code">
			{#snippet children()}
				<Input
					id="block-code"
					size="32"
					placeholder="Block code"
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
						id="block-notes"
						placeholder="Description (optional)"
						variant="accent"
						bind:value={editNotes}
						onblur={onBlur}
					/>
				{/snippet}
			</FormField>
		{/if}
		<FormField label="Content Type">
			{#snippet children()}
				<Dropdown
					size="32"
					bind:value={editContentType}
					placeholder=""
					onchange={onBlur}
					options={[
						{ value: '', label: 'NULL' },
						...data.contentTypes?.map((ct) => ({
							value: ct.id,
							label: ct.id
						})) || []
					]}
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
		<div class="translationRow">
			<FormField label="Title">
				{#snippet children()}
					<Input
						id="block-title-{data.languageId}"
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
	hr {
		border: none;
		border-top: 1px solid var(--base200);
		margin: 16px 0;
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
		grid-template-columns: 1fr 1fr 1fr;
		gap: 16px;
	}
	.translationRow {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
</style>
