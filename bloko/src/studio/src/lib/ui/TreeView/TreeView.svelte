<script>
	/**
	 * @typedef {Object} TreeItem
	 * @property {number|string} id - Unique identifier for the item (can be number or string/UUID)
	 * @property {string} name - Display name for the item
	 * @property {number} [order] - Order index for positioning (auto-generated if not provided)
	 * @property {TreeItem[]} [items] - Child items for nested structure
	 */

	/**
	 * @typedef {Object} TreeViewProps
	 * @property {TreeItem[]} [items=[]] - Array of tree items to display
	 * @property {boolean} [alwaysShowDropzones=false] - Whether to always show drop zones between items
	 * @property {boolean} [allowNesting=true] - Whether items can be nested as children of other items
	 * @property {string} [gap="4px"] - CSS gap value between tree items
	 * @property {string} [dropzoneHeight="8px"] - Height of drop zones for drag and drop
	 * @property {boolean} [allowSelection=true] - Whether items can be selected by clicking
	 * @property {number|string|null} [selectedId=null] - ID of currently selected item (controlled mode)
	 * @property {((id: number|string|null) => void)|null} [onSelect=null] - Callback when selection changes
	 * @property {((item: TreeItem) => any)|null} [itemContent=null] - Snippet function for custom item content rendering
	 */

	import TreeViewItem from './TreeViewItem.svelte';

	/** @type {TreeViewProps} */
	let { items = [], alwaysShowDropzones = false, allowNesting = true, gap = '4px', dropzoneHeight = '8px', allowSelection = true, selectedId = null, onSelect = null, onReorder = null, itemContent = null } = $props();

	// Create initial deep copy of items and ensure order properties
	function createTreeCopy(sourceItems) {
		if (!Array.isArray(sourceItems)) {
			return [];
		}
		const copy = JSON.parse(JSON.stringify(sourceItems));

		function addOrder(arr) {
			if (!Array.isArray(arr)) return;
			arr.forEach((item, index) => {
				item.order = index;
				if (item.items?.length) {
					addOrder(item.items);
				}
			});
		}

		addOrder(copy);
		return copy;
	}

	let tree = $state(createTreeCopy(items));
	let draggingId = $state(null);
	let dragOverTarget = $state(null);
	let dropAppendTargetId = $state(null);
	let dropAppendInvalid = $state(false);
	let itemMap = new Map();
	let hidingDropzones = $state(false);

	// Internal selection state
	let internalSelectedId = $state(null);

	// Track items reference to detect external changes
	let lastItems = items;
	$effect.pre(() => {
		// Only update if items reference changed (external update)
		if (items !== lastItems) {
			lastItems = items;
			tree = createTreeCopy(items);
			buildIndex();
		}
	});

	// Create selection handler
	function handleSelection(id) {
		if (onSelect) {
			onSelect(id);
		} else {
			internalSelectedId = id;
		}
	}

	// Use provided selectedId or fall back to internal state
	let currentSelectedId = $derived(selectedId ?? internalSelectedId);

	function buildIndex() {
		itemMap.clear();

		function visit(arr, parentId) {
			arr.forEach((item) => {
				// Clean up any existing parentId property
				if ('parentId' in item) delete item.parentId;
				itemMap.set(item.id, { item, parentId });
				if (item.items?.length) {
					visit(item.items, item.id);
				}
			});
		}

		visit(tree, null);
	}

	// Build index initially
	buildIndex();

	function findItemWithParent(id) {
		const rec = itemMap.get(id);
		if (!rec) return null;

		const { parentId } = rec;
		const parentRec = parentId != null ? itemMap.get(parentId) : null;
		const parentItem = parentRec?.item || null;
		const siblings = parentItem?.items || tree;
		const index = siblings.indexOf(rec.item);

		return { item: rec.item, parent: parentItem, arrRef: siblings, index };
	}

	function removeItemById(id) {
		const found = findItemWithParent(id);
		if (!found) return null;
		const removed = found.arrRef.splice(found.index, 1)[0];
		itemMap.delete(id);
		return removed;
	}

	function insertItemAt(item, parentId, index) {
		if (parentId == null) {
			if (index == null) {
				tree.push(item);
			} else {
				tree.splice(index, 0, item);
			}
			itemMap.set(item.id, { item, parentId: null });
			return;
		}

		const parentRec = itemMap.get(parentId);
		if (!parentRec) return;

		const parentItem = parentRec.item;
		if (!parentItem.items) {
			parentItem.items = [];
		}

		if (index == null) {
			parentItem.items.push(item);
		} else {
			parentItem.items.splice(index, 0, item);
		}

		itemMap.set(item.id, { item, parentId });
	}

	function isInSubtree(rootItemId, searchItemId) {
		if (rootItemId == null || searchItemId == null) return false;

		let current = searchItemId;
		while (current) {
			if (current === rootItemId) return true;
			const rec = itemMap.get(current);
			if (!rec) return false;
			current = rec.parentId;
		}
		return false;
	}

	function handleDragStart(event, id) {
		draggingId = id;
		event.dataTransfer.setData('text/plain', String(id));
		event.dataTransfer.effectAllowed = 'move';

		// Create custom drag image - small tag-like element
		const dragImage = document.createElement('div');
		const item = itemMap.get(id)?.item;
		dragImage.textContent = item ? item.name : `Item ${id}`;
		dragImage.style.cssText = `
            position: absolute;
            top: -1000px;
            background: var(--action500);
            color: var(--base0);
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap;
            pointer-events: none;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        `;
		document.body.appendChild(dragImage);
		event.dataTransfer.setDragImage(dragImage, 10, 10);

		// Clean up drag image after a short delay
		setTimeout(() => {
			if (document.body.contains(dragImage)) {
				document.body.removeChild(dragImage);
			}
		}, 0);
	}

	function handleDragOver(event) {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}

	function handleItemDragOver(event, targetId) {
		handleDragOver(event);
		if (draggingId == null) return;
		dropAppendTargetId = targetId;
		dropAppendInvalid = draggingId === targetId || isInSubtree(draggingId, targetId) || !allowNesting;
	}

	function clearItemHover() {
		dropAppendTargetId = null;
		dropAppendInvalid = false;
	}

	function getDraggedId(event) {
		if (!event.dataTransfer || !event.dataTransfer.types.includes('text/plain')) return null;
		const idStr = event.dataTransfer.getData('text/plain');
		if (!idStr) return null;
		// Support both numeric and string IDs (UUIDs)
		// Only parse as number if the entire string is a valid integer
		if (/^\d+$/.test(idStr)) {
			return parseInt(idStr, 10);
		}
		return idStr;
	}

	function validateMove({ dragId, targetParentId, targetIndex, mode }) {
		if (dragId == null) return { valid: false, reason: 'no-drag' };
		if (dragId === targetParentId) return { valid: false, reason: 'self' };
		if (isInSubtree(dragId, targetParentId)) return { valid: false, reason: 'cycle' };
		const dragRec = itemMap.get(dragId);
		if (!dragRec) return { valid: false, reason: 'missing' };
		const originalParentId = dragRec.parentId;
		const siblings = originalParentId == null ? tree : itemMap.get(originalParentId).item.items || [];
		const originalIndex = siblings.indexOf(dragRec.item);

		if (mode === 'append') {
			if (originalParentId === targetParentId) {
				if (originalIndex === siblings.length - 1) return { valid: false, reason: 'noop-last-child' };
			}
			return { valid: true, adjustedIndex: null };
		}

		let adjustedIndex = targetIndex;
		if (originalParentId === targetParentId) {
			if (originalIndex === targetIndex) return { valid: false, reason: 'noop-same-spot' };
			if (originalIndex + 1 === targetIndex) return { valid: false, reason: 'noop-after-self' };
			if (originalIndex < targetIndex) adjustedIndex = targetIndex - 1;
		}
		return { valid: true, adjustedIndex };
	}

	function updateSiblingOrder(arr) {
		arr.forEach((item, index) => {
			item.order = index;
		});
	}

	function moveNode({ dragId, targetParentId, targetIndex, mode }) {
		const validation = validateMove({
			dragId,
			targetParentId,
			targetIndex,
			mode,
		});
		if (!validation.valid) return { moved: false, reason: validation.reason };
		const dragRec = itemMap.get(dragId);
		const originalParentId = dragRec ? dragRec.parentId : null;
		const originalSiblings = originalParentId == null ? tree : itemMap.get(originalParentId).item.items || [];
		// capture old orders to compute updates later
		const oldOrders = new Map();
		originalSiblings.forEach((i) => oldOrders.set(i.id, i.order));
		const removed = removeItemById(dragId);
		if (!removed) return { moved: false, reason: 'remove-failed' };
		insertItemAt(removed, targetParentId, validation.adjustedIndex ?? null);
		updateSiblingOrder(originalSiblings);
		const newParentId = itemMap.get(dragId)?.parentId ?? null;
		if (newParentId !== originalParentId) {
			const newSiblings = newParentId == null ? tree : itemMap.get(newParentId).item.items || [];
			if (newSiblings !== originalSiblings) updateSiblingOrder(newSiblings);
		}
		// Build updates list by comparing old orders to new orders
		const updates = [];
		// check original siblings
		originalSiblings.forEach((it, idx) => {
			if (oldOrders.get(it.id) !== it.order) {
				updates.push({
					itemId: it.id,
					parentId: originalParentId,
					order: it.order,
				});
			}
		});
		// check new siblings if different
		if (newParentId !== originalParentId) {
			const newSiblings = newParentId == null ? tree : itemMap.get(newParentId).item.items || [];
			newSiblings.forEach((it) => {
				// if item was not in oldOrders or order changed
				if (!oldOrders.has(it.id) || oldOrders.get(it.id) !== it.order) {
					updates.push({
						itemId: it.id,
						parentId: newParentId,
						order: it.order,
					});
				}
			});
		}
		// ensure the moved item is included
		const movedRec = itemMap.get(dragId);
		if (movedRec) {
			updates.push({
				itemId: dragId,
				parentId: movedRec.parentId ?? null,
				order: movedRec.item.order,
			});
		}
		// Rebuild index to ensure consistency
		buildIndex();
		// notify parent about reorder updates
		console.log('TreeView moveNode - updates:', updates);
		if (onReorder && updates.length) {
			try {
				console.log('TreeView calling onReorder with updates:', updates);
				onReorder(updates);
			} catch (e) {
				console.error('onReorder callback error', e);
			}
		} else {
			console.log('TreeView - no onReorder callback or no updates', { hasCallback: !!onReorder, updatesLength: updates.length });
		}
		return { moved: true };
	}

	function handleDropOn(event, targetParentId) {
		console.log('handleDropOn called', { targetParentId, allowNesting });
		event.preventDefault();
		event.stopPropagation();
		const dragId = getDraggedId(event);
		console.log('handleDropOn - dragId:', dragId);
		if (dragId == null) return;
		if (!allowNesting) {
			console.log('handleDropOn - nesting not allowed, returning');
			return; // Prevent nesting when allowNesting is false
		}
		console.log('handleDropOn - calling moveNode');
		moveNode({ dragId, targetParentId, targetIndex: null, mode: 'append' });
		clearItemHover();
		draggingId = null;
		dragOverTarget = null;
	}

	function handleDropBetween(event, targetParentId, targetIndex) {
		console.log('handleDropBetween called', { targetParentId, targetIndex });
		event.preventDefault();
		event.stopPropagation();
		const dragId = getDraggedId(event);
		console.log('handleDropBetween - dragId:', dragId);
		if (dragId == null) return;
		console.log('handleDropBetween - calling moveNode');
		moveNode({ dragId, targetParentId, targetIndex, mode: 'between' });
		clearItemHover();
		draggingId = null;
		dragOverTarget = null;
	}

	function setDragOver(target) {
		dragOverTarget = target;
	}

	function isInvalidDropzone(parentId) {
		if (draggingId == null) return false;
		if (parentId === draggingId) return true;
		return isInSubtree(draggingId, parentId);
	}

	function handleDragEnd() {
		// Only trigger hide animation if dropzones aren't always shown
		if (!alwaysShowDropzones) {
			hidingDropzones = true;

			// Delay clearing draggingId to allow hide animation
			setTimeout(() => {
				draggingId = null;
				dragOverTarget = null;
				clearItemHover();
				hidingDropzones = false;
			}, 200); // Match animation duration
		} else {
			// If always showing dropzones, clear immediately without animation
			draggingId = null;
			dragOverTarget = null;
			clearItemHover();
		}
	}
</script>

<div class="TreeView tree-container" role="tree" tabindex="0" ondragover={handleDragOver} style:gap style:--dropzone-height={dropzoneHeight}>
	{#if tree.length === 0}
		<p>No items</p>
	{:else}
		{#if draggingId != null || alwaysShowDropzones}
			<div
				class="dropzone {hidingDropzones ? 'hiding' : ''} {dragOverTarget && dragOverTarget.parentId === null && dragOverTarget.index === 0 ? `active ${isInvalidDropzone(null) ? 'invalid' : ''}` : ''}"
				role="presentation"
				ondragover={(e) => {
					e.preventDefault();
					setDragOver({ parentId: null, index: 0 });
				}}
				ondragleave={() => setDragOver(null)}
				ondrop={(e) => handleDropBetween(e, null, 0)}
				style:height={dropzoneHeight}
			></div>
		{/if}
		{#each tree as item, idx}
			<TreeViewItem
				{item}
				{draggingId}
				{dragOverTarget}
				{setDragOver}
				{handleDragStart}
				{handleDropOn}
				{handleDropBetween}
				{handleItemDragOver}
				{clearItemHover}
				{dropAppendTargetId}
				{dropAppendInvalid}
				{isInSubtree}
				{handleDragEnd}
				{hidingDropzones}
				{alwaysShowDropzones}
				{allowNesting}
				{gap}
				{dropzoneHeight}
				selectedId={allowSelection ? currentSelectedId : null}
				onSelect={allowSelection ? handleSelection : null}
				{itemContent}
			/>
			{#if draggingId != null || alwaysShowDropzones}
				<div
					class="dropzone {hidingDropzones ? 'hiding' : ''} {dragOverTarget && dragOverTarget.parentId === null && dragOverTarget.index === idx + 1 ? `active ${isInvalidDropzone(null) ? 'invalid' : ''}` : ''}"
					role="presentation"
					ondragover={(e) => {
						e.preventDefault();
						setDragOver({ parentId: null, index: idx + 1 });
					}}
					ondragleave={() => setDragOver(null)}
					ondrop={(e) => handleDropBetween(e, null, idx + 1)}
					style:height={dropzoneHeight}
				></div>
			{/if}
		{/each}
	{/if}
</div>

<style>
	.tree-container {
		font-family: inherit;
		display: flex;
		flex-direction: column;
	}

	:global(.dropzone) {
		border-radius: 4px;
		background: var(--base100);
		border: none;
		transition: all 0.2s ease;
		cursor: move;
		animation: dropzoneSlideIn 0.2s ease-out;
		transform-origin: center;
	}

	@keyframes dropzoneSlideIn {
		from {
			height: 0;
			margin: 0;
			opacity: 0;
			transform: scaleY(0);
		}
		to {
			height: var(--dropzone-height);
			opacity: 1;
			transform: scaleY(1);
		}
	}

	:global(.dropzone.hiding) {
		animation: dropzoneSlideOut 0.2s ease-in forwards;
	}

	@keyframes dropzoneSlideOut {
		from {
			height: var(--dropzone-height);
			opacity: 1;
			transform: scaleY(1);
		}
		to {
			height: 0;
			margin: 0;
			opacity: 0;
			transform: scaleY(0);
		}
	}

	:global(.dropzone.active:not(.invalid)) {
		background: var(--success400);
	}

	:global(.dropzone.active.invalid) {
		background: var(--danger400);
	}

	:global(.dropzone.invalid) {
		background: var(--danger400);
		cursor: not-allowed;
	}
</style>
