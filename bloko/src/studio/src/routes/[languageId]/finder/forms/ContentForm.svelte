<script>
	import { Input, Textarea, Button } from '$lib/ui';
	import { notifications } from '$lib/ui/Notification/Notification.svelte';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { updateContent } from '../data.remote.js';

	let { data, block, node, contentValue } = $props();

	let editValue = $state(contentValue || '');
	let saving = $state(false);
	let contentExists = $derived(block.content?.id != null);

	// For text_list, manage array items
	let listItems = $state(
		block.content_type === 'text_list' && Array.isArray(contentValue)
			? [...contentValue]
			: []
	);

	// For titled_list, manage array of {title, text} objects
	let titledListItems = $state(
		block.content_type === 'titled_list' && Array.isArray(contentValue)
			? [...contentValue]
			: []
	);

	// Track block/node/language identity to detect when we need to reset the form
	let lastKey = $state(`${block.id}-${node.id}-${data.languageId}`);
	$effect(() => {
		const currentKey = `${block.id}-${node.id}-${data.languageId}`;
		// Reset when switching block, node, or language
		if (currentKey !== lastKey) {
			lastKey = currentKey;
			if (block.content_type === 'text_list') {
				listItems = Array.isArray(contentValue) ? [...contentValue] : [];
			} else if (block.content_type === 'titled_list') {
				titledListItems = Array.isArray(contentValue) ? [...contentValue] : [];
			} else {
				editValue = contentValue || '';
			}
		}
	});

	async function saveContent() {
		saving = true;
		try {
			let value;
			let successMessage;

			if (block.content_type === 'number') {
				// For number type, store as plain number (not language-keyed)
				const stringValue = String(editValue || '').trim();
				value = stringValue === '' ? null : parseFloat(stringValue);
				successMessage = value !== null ? 'Saved' : 'Deleted';
			} else if (block.content_type === 'text_list') {
				// For text_list, store as language-keyed array
				const cleanedItems = listItems.filter(item => item && item.trim()).map(item => item.trim());
				value = {
					...block.content?.value || {},
					[data.languageId]: cleanedItems.length > 0 ? cleanedItems : []
				};
				successMessage = cleanedItems.length > 0 ? 'Saved' : 'Deleted';
			} else if (block.content_type === 'titled_list') {
				// For titled_list, store as language-keyed array of {title, text} objects
				const cleanedItems = titledListItems
					.filter(item => (item?.title?.trim() || item?.text?.trim()))
					.map(item => ({
						title: item?.title?.trim() || '',
						text: item?.text?.trim() || ''
					}));
				value = {
					...block.content?.value || {},
					[data.languageId]: cleanedItems.length > 0 ? cleanedItems : []
				};
				successMessage = cleanedItems.length > 0 ? 'Saved' : 'Deleted';
			} else {
				// For other types (text), store as language-keyed object
				const trimmedValue = (editValue || '').trim();
				value = {
					...block.content?.value || {},
					[data.languageId]: trimmedValue
				};
				successMessage = trimmedValue ? 'Saved' : 'Deleted';
			}

			const payload = {
				
				_node: node.id,
				_block: block.id,
				value
			};

			await updateContent(payload);
			await invalidate('app:nodes');
			notifications.success(successMessage);
		} catch (error) {
			console.error('Save error:', error);
			notifications.error('Failed to save');
			// Restore original value on error
			if (block.content_type === 'text_list') {
				listItems = Array.isArray(contentValue) ? [...contentValue] : [];
			} else if (block.content_type === 'titled_list') {
				titledListItems = Array.isArray(contentValue) ? [...contentValue] : [];
			} else {
				editValue = contentValue || '';
			}
		} finally {
			saving = false;
		}
	}

	async function onBlur() {
		// Check if value changed
		if (block.content_type === 'number') {
			// For numbers, compare numeric values
			const numValue = editValue === '' ? null : parseFloat(editValue);
			const originalNumValue = contentValue === '' || contentValue == null ? null : parseFloat(contentValue);
			if (numValue === originalNumValue) return;
		} else {
			// For text types, compare trimmed strings
			const trimmedValue = (editValue || '').trim();
			const originalValue = (contentValue || '').trim();
			if (trimmedValue === originalValue) return;
		}

		await saveContent();
	}

	async function onCreate() {
		if (contentExists) return;

		saving = true;
		try {
			// Create content row with appropriate initial value
			const payload = {
				
				_node: node.id,
				_block: block.id,
				value: block.content_type === 'number' ? null : {},
				forceCreate: true
			};

			await updateContent(payload);
			await invalidate('app:nodes');
			notifications.success('Content created');

			// Focus on input after creating
			const inputId = `content-${block.id}-${data.languageId}`;
			setTimeout(() => {
				document.getElementById(inputId)?.focus();
			}, 50);
		} catch (error) {
			console.error('Create error:', error);
			notifications.error('Failed to create');
		} finally {
			saving = false;
		}
	}

	async function onDelete() {
		if (!contentExists) return;
		if (!confirm('Delete this entire content row (all languages)?')) return;

		saving = true;
		try {
			// Delete the entire content row
			// For number type, use null; for others, use empty object
			const payload = {
				
				_node: node.id,
				_block: block.id,
				value: block.content_type === 'number' ? null : {}
			};

			await updateContent(payload);
			await invalidate('app:nodes');
			editValue = '';
			listItems = [];
			titledListItems = [];
			notifications.success('Deleted');
		} catch (error) {
			console.error('Delete error:', error);
			notifications.error('Failed to delete');
		} finally {
			saving = false;
		}
	}

	// Text list management functions
	function addListItem() {
		listItems = [...listItems, ''];
	}

	function removeListItem(index) {
		listItems = listItems.filter((_, i) => i !== index);
		saveContent();
	}

	function updateListItem(index, value) {
		listItems[index] = value;
	}

	// Titled list management functions
	function addTitledListItem() {
		titledListItems = [...titledListItems, { title: '', text: '' }];
	}

	function removeTitledListItem(index) {
		titledListItems = titledListItems.filter((_, i) => i !== index);
		saveContent();
	}

	function updateTitledListItem(index, field, value) {
		titledListItems[index] = { ...titledListItems[index], [field]: value };
	}
</script>

<div class="contentFormWrapper">
	{#if contentExists}
		<div class="inputWrapper">
			{#if block.content_type === 'text'}
				<Input
					id="content-{block.id}-{data.languageId}"
					size="32"
					placeholder="Enter text"
					bind:value={editValue}
					onblur={onBlur}
					disabled={saving}
				/>
			{:else if block.content_type === 'paragraph'}
				<Textarea
					id="content-{block.id}-{data.languageId}"
					placeholder="Enter paragraph"
					bind:value={editValue}
					onblur={onBlur}
					disabled={saving}
				/>
			{:else if block.content_type === 'number'}
				<Input
					id="content-{block.id}-{data.languageId}"
					size="32"
					type="number"
					placeholder="Enter number"
					bind:value={editValue}
					onblur={onBlur}
					disabled={saving}
				/>
			{:else if block.content_type === 'text_list'}
				<div class="textListWrapper">
					{#each listItems as item, index}
						<div class="listItemRow">
							<Input
								id="content-{block.id}-{data.languageId}-{index}"
								size="32"
								placeholder="List item {index + 1}"
								value={item}
								oninput={(e) => updateListItem(index, e.target.value)}
								onblur={saveContent}
								disabled={saving}
							/>
							<Button
								label="×"
								intent="danger"
								size="24"
								type="button"
								onclick={() => removeListItem(index)}
								disabled={saving}
							/>
						</div>
					{/each}
					<Button
						label="+ Add Item"
						intent="secondary"
						size="24"
						type="button"
						onclick={addListItem}
						disabled={saving}
					/>
				</div>
			{:else if block.content_type === 'titled_list'}
				<div class="titledListWrapper">
					{#each titledListItems as item, index}
						<div class="titledListItemCard">
							<div class="titledListItemHeader">
								<span class="itemNumber">{index + 1}</span>
								<Button
									label="×"
									intent="danger"
									size="24"
									type="button"
									onclick={() => removeTitledListItem(index)}
									disabled={saving}
								/>
							</div>
							<div class="titledListItemFields">
								<Input
									id="content-{block.id}-{data.languageId}-{index}-title"
									size="32"
									placeholder="Title"
									value={item?.title || ''}
									oninput={(e) => updateTitledListItem(index, 'title', e.target.value)}
									onblur={saveContent}
									disabled={saving}
								/>
								<Textarea
									id="content-{block.id}-{data.languageId}-{index}-text"
									placeholder="Text"
									value={item?.text || ''}
									oninput={(e) => updateTitledListItem(index, 'text', e.target.value)}
									onblur={saveContent}
									disabled={saving}
								/>
							</div>
						</div>
					{/each}
					<Button
						label="+ Add Item"
						intent="secondary"
						size="24"
						type="button"
						onclick={addTitledListItem}
						disabled={saving}
					/>
				</div>
			{/if}
		</div>
		<Button
			label="D"
			intent="danger"
			size="24"
			type="button"
			onclick={onDelete}
			disabled={saving}
		/>
	{:else}
		<Button
			label="Create Content"
			intent="secondary"
			size="24"
			type="button"
			onclick={onCreate}
			disabled={saving}
		/>
	{/if}
</div>

<style>
	.contentFormWrapper {
		display: flex;
		gap: 8px;
		align-items: flex-start;
		width: 100%;
	}
	.inputWrapper {
		flex: 1;
	}
	.textListWrapper {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
	}
	.listItemRow {
		display: flex;
		gap: 8px;
		align-items: center;
	}
	.titledListWrapper {
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 100%;
	}
	.titledListItemCard {
		border: 1px solid var(--base200);
		border-radius: 4px;
		padding: 12px;
		background-color: var(--base50);
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.titledListItemHeader {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}
	.itemNumber {
		font-size: 14px;
		font-weight: 600;
		color: var(--base500);
	}
	.titledListItemFields {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
</style>
