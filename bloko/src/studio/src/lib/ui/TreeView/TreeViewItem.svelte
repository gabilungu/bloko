<script>
	import TreeViewItem from './TreeViewItem.svelte';

	let {
		item,
		draggingId,
		dragOverTarget,
		setDragOver,
		handleDragStart,
		handleDropOn,
		handleDropBetween,
		handleItemDragOver,
		clearItemHover,
		dropAppendTargetId,
		dropAppendInvalid,
		isInSubtree,
		handleDragEnd,
		hidingDropzones,
		alwaysShowDropzones,
		allowNesting,
		gap,
		dropzoneHeight,
		selectedId,
		onSelect,
		itemContent = null,
	} = $props();
</script>

<div
	class="item {draggingId === item.id ? 'dragging' : ''} {dropAppendTargetId === item.id ? (dropAppendInvalid ? 'drop-append invalid' : 'drop-append') : ''} {selectedId === item.id ? 'selected' : ''}"
	role="treeitem"
	tabindex="0"
	aria-selected="false"
	aria-grabbed={draggingId === item.id}
	draggable="true"
	ondragstart={(e) => handleDragStart(e, item.id)}
	ondragend={() => handleDragEnd?.()}
	ondragover={(e) => {
		e.preventDefault();
		if (allowNesting) {
			handleItemDragOver?.(e, item.id);
		}
	}}
	ondragleave={() => {
		if (allowNesting) {
			clearItemHover?.();
		}
	}}
	ondrop={(e) => {
		if (allowNesting) {
			handleDropOn(e, item.id);
		}
	}}
	onclick={(e) => {
		// Don't trigger selection if currently dragging
		if (onSelect && draggingId == null) {
			e.stopPropagation();
			onSelect(selectedId === item.id ? null : item.id);
		}
	}}
	onkeydown={(e) => {
		if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault();
			e.stopPropagation();
			onSelect(selectedId === item.id ? null : item.id);
		}
	}}
>
	<div class="title">
		{#if itemContent}
			{@render itemContent(item)}
		{:else}
			{item.name}
		{/if}
	</div>
</div>

{#if allowNesting && item.items?.length}
	<div class="children" role="group" style:gap>
		{#if draggingId != null || alwaysShowDropzones}
			<div
				class="dropzone {hidingDropzones ? 'hiding' : ''} {dragOverTarget?.parentId === item.id && dragOverTarget?.index === 0 ? `active ${draggingId && (draggingId === item.id || isInSubtree?.(draggingId, item.id)) ? 'invalid' : ''}` : ''}"
				role="presentation"
				ondragover={(e) => {
					e.preventDefault();
					setDragOver({ parentId: item.id, index: 0 });
				}}
				ondragleave={() => setDragOver(null)}
				ondrop={(e) => handleDropBetween(e, item.id, 0)}
				style:height={dropzoneHeight}
			></div>
		{/if}
		{#each item.items as child, cidx}
			<TreeViewItem
				item={child}
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
				{selectedId}
				{onSelect}
				{itemContent}
			/>
			{#if draggingId != null || alwaysShowDropzones}
				<div
					class="dropzone {hidingDropzones ? 'hiding' : ''} {dragOverTarget?.parentId === item.id && dragOverTarget?.index === cidx + 1
						? `active ${draggingId && (draggingId === item.id || isInSubtree?.(draggingId, item.id)) ? 'invalid' : ''}`
						: ''}"
					role="presentation"
					ondragover={(e) => {
						e.preventDefault();
						setDragOver({ parentId: item.id, index: cidx + 1 });
					}}
					ondragleave={() => setDragOver(null)}
					ondrop={(e) => handleDropBetween(e, item.id, cidx + 1)}
					style:height={dropzoneHeight}
				></div>
			{/if}
		{/each}
	</div>
{/if}

<style>
	.item {
		display: flex;
		width: 100%;
		box-sizing: border-box;
		align-items: center;
		background: white;
		border-radius: 4px;
		cursor: grab;
		user-select: none;
		border: 1px solid #e6e6ea;
		height: 28px;
		padding: 0 8px;
		font-size: 13px;
		line-height: 1;
		transition:
			box-shadow 100ms ease,
			background-color 100ms ease,
			transform 100ms ease;
	}

	.item:hover {
		background: var(--action100);
	}

	.item:active {
		cursor: grabbing;
	}

	.item:focus-visible {
		outline: 2px solid #2563eb;
		outline-offset: 2px;
	}

	.item .title {
		flex: 1 1 auto;
		text-align: left;
		color: var(--base900);
		font-weight: 400;
	}

	.children {
		margin-left: 16px;
		border-left: 1px solid var(--base200);
		padding-left: 12px;
		display: flex;
		flex-direction: column;
	}

	.item.dragging {
		opacity: 0.3;
		pointer-events: none;
	}

	.item.selected {
		background: var(--focus400);
		color: var(--focus800);
		border: 1px solid var(--focus500);
	}

	.item.selected .title {
		color: var(--focus800);
	}

	.item.drop-append:not(.invalid) {
		cursor: move;
		background: var(--success500) !important;
		color: var(--base0) !important;
		border: none;
	}

	.item.drop-append:not(.invalid) .title {
		color: var(--base0) !important;
	}

	.item.drop-append.invalid {
		background: var(--danger400) !important;
		color: var(--base0) !important;
		border: none;
		cursor: not-allowed;
	}

	.item.drop-append.invalid .title {
		color: var(--base0) !important;
	}
</style>
