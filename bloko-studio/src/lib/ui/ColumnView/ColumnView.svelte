<script>
	/**
	 * @typedef {Object} ColumnViewProps
	 * @property {'24' | '28' | '32' | '40'} [itemSize='32'] - Size of items (height, font size, padding)
	 * @property {string} [itemsGap="4px"] - CSS gap value between items
	 * @property {string} [dropzoneHeight="8px"] - Height of drop zones for drag and drop
	 * @property {string} [columnsGap="1px"] - CSS gap value between columns
	 * @property {string} [columnPadding="8px"] - Padding inside each column
	 * @property {string} [columnWidth="220px"] - Width of each column
	 * @property {Array} [items=[]] - Array of hierarchical items to display
	 * @property {boolean} [alwaysShowDropzones=false] - Whether to always show drop zones between items
	 * @property {((item: any) => any)|null} [itemContent=null] - Snippet function for custom item content rendering
	 * @property {number[]|null} [selectedIds=null] - Array of selected item IDs forming the selection path (controlled mode)
	 * @property {((ids: number[]) => void)|null} [onSelectionChange=null] - Callback when selection changes
	 * @property {((itemId: number, newParentId: number|null, newOrder: number) => void)|null} [onReorder=null] - Callback when items are reordered
	 */

	/** @type {ColumnViewProps} */
	let {
		itemSize = '32',
		itemsGap = '4px',
		dropzoneHeight = '8px',
		columnPadding = '8px',
		columnWidth = '220px',
		columnsGap = '1px',
		alwaysShowDropzones = false,
		itemContent = null,
		items = [],
		selectedIds = null,
		onSelectionChange = null,
		onReorder = null,
	} = $props();

	// Create a deep clone of the items and update when they change
	let root = $state(JSON.parse(JSON.stringify(items)));

	// Track previous items to avoid unnecessary updates
	let prevItems = items;

	// Watch for changes to items prop and update root
	$effect(() => {
		// Only update if items actually changed
		if (items !== prevItems) {
			prevItems = items;
			root = JSON.parse(JSON.stringify(items));
		}
	});

	// Internal selection state for uncontrolled mode
	let internalSelectedPath = $state([]);

	// Use provided selectedIds or fall back to internal state
	let selectedPath = $derived(selectedIds ?? internalSelectedPath);
	let columns = $derived(computeColumnsFromSelection());

	// Drag state
	let dragOverItemId = $state(null);
	let dragOverDrop = $state(null);
	let draggingId = $state(null);
	let dragImageEl = $state(null);
	let hidingDropzones = $state(false);

	// Auto-expand state
	let expandHoverTimer = $state(null);
	let lastHoverNodeId = $state(null);
	const AUTO_EXPAND_DELAY = 500;

	function clearExpandTimer() {
		if (expandHoverTimer) {
			clearTimeout(expandHoverTimer);
			expandHoverTimer = null;
		}
	}

	function scheduleAutoExpand(item, colIndex) {
		if (!draggingId) return;
		if (!item.items || !item.items.length) return;
		if (selectedPath[colIndex] === item.id) return;
		if (lastHoverNodeId === item.id && expandHoverTimer) return;

		lastHoverNodeId = item.id;
		clearExpandTimer();
		expandHoverTimer = setTimeout(() => {
			if (draggingId && dragOverItemId === item.id) {
				selectItem(item, colIndex);
			}
		}, AUTO_EXPAND_DELAY);
	}

	function computeColumnsFromSelection() {
		const cols = [root];
		let current = root;
		for (const id of selectedPath) {
			const item = current.find((i) => i.id === id);
			if (!item || !item.items || item.items.length === 0) break;
			cols.push(item.items);
			current = item.items;
		}
		return cols;
	}

	function selectItem(item, columnIndex) {
		// Check if the item is already selected
		if (selectedPath[columnIndex] === item.id) {
			// Deselect by truncating the path at this column
			const newPath = selectedPath.slice(0, columnIndex);

			if (onSelectionChange) {
				// Controlled mode - call the callback
				onSelectionChange(newPath);
			} else {
				// Uncontrolled mode - update internal state
				internalSelectedPath = newPath;
			}
		} else {
			// Select the item normally
			const newPath = selectedPath.slice(0, columnIndex);
			newPath[columnIndex] = item.id;

			if (onSelectionChange) {
				// Controlled mode - call the callback
				onSelectionChange(newPath);
			} else {
				// Uncontrolled mode - update internal state
				internalSelectedPath = newPath;
			}
		}
	}

	function onDragStart(event, item) {
		event.dataTransfer.setData(
			'application/json',
			JSON.stringify({ id: item.id })
		);
		event.dataTransfer.effectAllowed = 'move';

		dragOverItemId = null;
		dragOverDrop = null;
		draggingId = item.id;
		clearExpandTimer();

		const { el, offsetX, offsetY } = createCustomDragImage(
			item,
			event.currentTarget
		);
		dragImageEl = el;
		try {
			event.dataTransfer.setDragImage(el, offsetX, offsetY);
		} catch (_) {}
	}

	function onDragEnd() {
		clearExpandTimer();
		lastHoverNodeId = null;
		if (dragImageEl) {
			dragImageEl.remove();
			dragImageEl = null;
		}

		// Only trigger hide animation if dropzones aren't always shown
		if (!alwaysShowDropzones) {
			hidingDropzones = true;

			// Delay clearing draggingId to allow hide animation
			setTimeout(() => {
				draggingId = null;
				dragOverItemId = null;
				dragOverDrop = null;
				hidingDropzones = false;
			}, 200); // Match animation duration
		} else {
			// If always showing dropzones, clear immediately without animation
			draggingId = null;
			dragOverItemId = null;
			dragOverDrop = null;
		}
	}

	function onDragOver(event) {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}

	function onItemDragLeave(event, item) {
		if (dragOverItemId === item.id) dragOverItemId = null;
		if (lastHoverNodeId === item.id) {
			lastHoverNodeId = null;
			clearExpandTimer();
		}
	}

	function onItemDragOver(event, item, colIndex) {
		event.preventDefault();
		dragOverItemId = item.id;
		dragOverDrop = null;
		event.dataTransfer.dropEffect = 'move';
		scheduleAutoExpand(item, colIndex);
	}

	function sanitizeSelectionAfterMove() {
		let currentLevel = root;
		const newPath = [];
		for (const id of selectedPath) {
			const found = currentLevel.find((i) => i.id === id);
			if (!found) break;
			newPath.push(id);
			if (found.items) currentLevel = found.items;
			else break;
		}
		if (newPath.length !== selectedPath.length) {
			if (onSelectionChange) {
				onSelectionChange(newPath);
			} else {
				internalSelectedPath = newPath;
			}
		}
	}

	function removeItemById(id, itemsArr) {
		for (let i = 0; i < itemsArr.length; i++) {
			if (itemsArr[i].id === id) return itemsArr.splice(i, 1)[0];
			if (itemsArr[i].items) {
				const res = removeItemById(id, itemsArr[i].items);
				if (res) return res;
			}
		}
		return null;
	}

	function findItemById(id, itemsArr) {
		for (const item of itemsArr) {
			if (item.id === id) return item;
			if (item.items) {
				const res = findItemById(id, item.items);
				if (res) return res;
			}
		}
		return null;
	}

	function isDescendant(potentialDescendantId, ancestorId, itemsArr) {
		const ancestor = findItemById(ancestorId, itemsArr);
		if (!ancestor || !ancestor.items) return false;

		function search(item) {
			if (!item.items) return false;
			for (const child of item.items) {
				if (child.id === potentialDescendantId) return true;
				if (search(child)) return true;
			}
			return false;
		}

		return search(ancestor);
	}

	function isValidDrop(targetItem) {
		if (!draggingId) return true;
		if (targetItem.id === draggingId) return false;
		return !isDescendant(targetItem.id, draggingId, root);
	}

	function onDropzoneDragEnter(event, parentItems, index) {
		event.preventDefault();
		dragOverDrop = { parentItems, index };
		dragOverItemId = null;
	}

	function onDropzoneDragLeave() {
		dragOverDrop = null;
	}

	function onDropOnItem(event, targetItem) {
		event.preventDefault();
		const data = JSON.parse(event.dataTransfer.getData('application/json'));
		const sourceId = data.id;

		dragOverItemId = null;
		dragOverDrop = null;
		draggingId = null;

		if (sourceId === targetItem.id) return;
		if (isDescendant(targetItem.id, sourceId, root)) return;

		const itemToMove = removeItemById(sourceId, root);
		if (!itemToMove) return;
		if (!targetItem.items) targetItem.items = [];
		itemToMove.order = targetItem.items.length;
		targetItem.items.push(itemToMove);
		root = [...root]; // Trigger reactivity
		sanitizeSelectionAfterMove();

		// Notify parent about the reorder
		if (onReorder) {
			onReorder(sourceId, targetItem.id, itemToMove.order);
		}
	}

	function findParentAndIndex(id, itemsArr, parentId = null) {
		for (let i = 0; i < itemsArr.length; i++) {
			const item = itemsArr[i];
			if (item.id === id) return { parent: itemsArr, index: i, parentId };
			if (item.items) {
				const res = findParentAndIndex(id, item.items, item.id);
				if (res) return res;
			}
		}
		return null;
	}

	function onDropBetween(event, parentItems, index, columnIndex) {
		event.preventDefault();
		const data = JSON.parse(event.dataTransfer.getData('application/json'));
		const sourceId = data.id;

		dragOverItemId = null;
		dragOverDrop = null;
		draggingId = null;

		console.log('onDropBetween called:', {
			sourceId,
			columnIndex,
			isFirstColumn: columnIndex === 0,
			parentItemsLength: parentItems.length,
			rootLength: root.length,
			index,
		});

		const loc = findParentAndIndex(sourceId, root);
		if (loc && loc.parent === parentItems) {
			const currentIndex = loc.index;
			if (index === currentIndex || index === currentIndex + 1) return;
		}

		const itemToMove = removeItemById(sourceId, root);
		if (!itemToMove) return;

		if (loc && loc.parent === parentItems && loc.index < index) {
			index = index - 1;
		}

		// Track old orders before updating
		const oldOrders = new Map();
		parentItems.forEach((item) => oldOrders.set(item.id, item.order));

		parentItems.splice(index, 0, itemToMove);
		parentItems.forEach((item, i) => (item.order = i));
		root = [...root]; // Trigger reactivity
		sanitizeSelectionAfterMove();

		// Find the parent ID for this level
		let parentId = null;
		// Check if this is the first column (root level)
		if (columnIndex === 0) {
			parentId = null; // First column is always root
		} else {
			// Find which item contains these parentItems
			const findParentId = (items, target, pid = null) => {
				for (const item of items) {
					if (item.items === target) return item.id;
					if (item.items) {
						const found = findParentId(item.items, target, item.id);
						if (found) return found;
					}
				}
				return pid;
			};
			parentId = findParentId(root, parentItems);
		}
		console.log(
			'Drop between - columnIndex:',
			columnIndex,
			'parentId:',
			parentId
		);

		// Notify parent about the reorder
		if (onReorder) {
			// Send updates for all items whose order changed
			const updates = [];
			parentItems.forEach((item, i) => {
				const oldOrder = oldOrders.get(item.id);
				// Always update the moved item, and update siblings if their order changed
				if (item.id === sourceId || oldOrder !== i) {
					console.log(
						'Updating order:',
						item.id,
						'from',
						oldOrder,
						'to',
						i,
						'parentId:',
						parentId
					);
					updates.push({ itemId: item.id, parentId, order: i });
					onReorder(item.id, parentId, i);
				}
			});
			console.log('Order updates sent:', updates.length);
		}
	}

	function createCustomDragImage(item, sourceButton) {
		if (dragImageEl) {
			dragImageEl.remove();
			dragImageEl = null;
		}

		const el = document.createElement('div');
		el.textContent = item.name;
		el.style.cssText = `
			position: absolute;
			top: 0; left: 0;
			pointer-events: none;
			z-index: 99999;
			font: 500 13px/1 sans-serif;
			padding: 6px 10px;
			background: rgba(0,122,255,0.9);
			color: #fff;
			border-radius: 4px;
			box-shadow: 0 4px 10px rgba(0,0,0,0.25);
			transform: translate(-9999px,-9999px);
			white-space: nowrap;
		`;
		document.body.appendChild(el);

		const rect = sourceButton.getBoundingClientRect();
		const offsetX = 10;
		const offsetY = rect.height / 2;
		return { el, offsetX, offsetY };
	}
</script>

<div
	class="columns"
	style:gap={columnsGap}
	style:--items-gap={itemsGap}
	style:--dropzone-height={dropzoneHeight}
>
	{#each columns as col, colIndex}
		<div
			class="column"
			role="list"
			style:gap={itemsGap}
			style:padding={columnPadding}
			style:width={columnWidth}
		>
			{#each col as item, i (item.id)}
				{#if draggingId || alwaysShowDropzones}
					<div
						class="dropzone {hidingDropzones ? 'hiding' : ''}"
						role="presentation"
						ondragenter={(e) => onDropzoneDragEnter(e, col, i)}
						ondragleave={onDropzoneDragLeave}
						ondragover={onDragOver}
						ondrop={(e) => onDropBetween(e, col, i, colIndex)}
						class:dragover={dragOverDrop &&
							dragOverDrop.parentItems === col &&
							dragOverDrop.index === i}
						style:height={dropzoneHeight}
					></div>
				{/if}

				<button
					class="item size-{itemSize}"
					type="button"
					class:selected={selectedPath[colIndex] === item.id}
					class:dragover-target={dragOverItemId === item.id &&
						isValidDrop(item)}
					class:invalid-drop={dragOverItemId === item.id &&
						!isValidDrop(item)}
					draggable="true"
					ondragstart={(e) => onDragStart(e, item)}
					ondragover={(e) => onItemDragOver(e, item, colIndex)}
					ondragleave={(e) => onItemDragLeave(e, item)}
					ondragend={onDragEnd}
					ondrop={(e) => onDropOnItem(e, item)}
					onclick={() => selectItem(item, colIndex)}
				>
					{#if itemContent}
						{@render itemContent(item)}
					{:else}
						<span class="item-label">{item.name}</span>
					{/if}
				</button>
			{/each}

			{#if draggingId || alwaysShowDropzones}
				<div
					class="dropzone {hidingDropzones ? 'hiding' : ''}"
					role="presentation"
					ondragenter={(e) => onDropzoneDragEnter(e, col, col.length)}
					ondragleave={onDropzoneDragLeave}
					ondragover={onDragOver}
					ondrop={(e) => onDropBetween(e, col, col.length, colIndex)}
					class:dragover={dragOverDrop &&
						dragOverDrop.parentItems === col &&
						dragOverDrop.index === col.length}
					style:height={dropzoneHeight}
				></div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.columns {
		display: flex;
		background: var(--base200);
		height: 100%;
		overflow-y: hidden;
		overflow-x: auto;
	}

	.column {
		background: var(--base0);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
		min-height: 200px;
		max-height: 100%;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		overflow-x: hidden;
		flex-grow: 0;
		flex-shrink: 0;
	}

	.dropzone {
		border-radius: 4px;
		background: var(--base100);
		border: none;
		cursor: move;
		flex-shrink: 0;
		flex-grow: 0;
		transition: all 0.2s ease;
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

	.dropzone.hiding {
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

	.dropzone.dragover {
		background: var(--success400);
	}

	.item {
		display: flex;
		width: 100%;
		box-sizing: border-box;
		justify-content: space-between;
		align-items: center;
		background: white;
		border-radius: 4px;
		cursor: grab;
		user-select: none;
		border: 1px solid #e6e6ea;
		flex-shrink: 0;
		flex-grow: 0;
		transition:
			box-shadow 100ms ease,
			background-color 100ms ease,
			transform 100ms ease;
	}

	/* Size variants - matching Button component */
	.item.size-24 {
		height: 24px;
		padding: 0 3px 0 6px;
		font-size: 12px;
	}

	.item.size-28 {
		height: 28px;
		padding: 0 4px 0 8px;
		font-size: 13px;
	}

	.item.size-32 {
		height: 32px;
		padding: 0 5px 0 10px;
		font-size: 14px;
	}

	.item.size-40 {
		height: 40px;
		padding: 0 6px 0 12px;
		font-size: 16px;
	}

	.item:focus-visible {
		outline: 2px solid #2563eb;
		outline-offset: 2px;
	}

	.item-label {
		flex: 1 1 auto;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: left;
	}

	.item:hover {
		background: var(--action100);
	}

	.item:active {
		cursor: grabbing;
	}

	.item.dragover-target {
		background: var(--success500) !important;
		color: var(--base0) !important;
		border: none;
	}

	.item.invalid-drop {
		background: var(--danger400) !important;
		color: var(--base0) !important;
		border: none;
		cursor: not-allowed;
	}

	.item.invalid-drop.dragover-target {
		background: #00f;
		transform: none;
	}

	.item.selected {
		background: var(--focus400);
		color: var(--focus800);
		border: 1px solid var(--focus500);
	}
</style>
