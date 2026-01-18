<script>
	import { getContext } from 'svelte';

	/**
	 * @typedef {Object} TabsContentProps
	 * @property {string} tabId - ID of the tab this content belongs to
	 * @property {import('svelte').Snippet} [children] - Content to display when tab is active
	 */

	/** @type {TabsContentProps} */
	let { tabId, children } = $props();

	// Get context from parent Tabs component
	const tabsContext = getContext('tabs');

	// Use getter to access reactive value
	let isActive = $derived(tabsContext.activeTabId === tabId);
</script>

{#if isActive}
	<div
		class="tab-content"
		id={`panel-${tabId}`}
		role="tabpanel"
		aria-labelledby={`tab-${tabId}`}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}

<style>
	.tab-content {
		padding: 24px;
		height: 100%;
		overflow-y: auto;
		background: var(--base0);
	}

	/* Custom scrollbar for tab content */
	.tab-content::-webkit-scrollbar {
		width: 8px;
	}

	.tab-content::-webkit-scrollbar-track {
		background: var(--base100);
		border-radius: 4px;
	}

	.tab-content::-webkit-scrollbar-thumb {
		background: var(--base400);
		border-radius: 4px;
	}

	.tab-content::-webkit-scrollbar-thumb:hover {
		background: var(--base500);
	}
</style>
