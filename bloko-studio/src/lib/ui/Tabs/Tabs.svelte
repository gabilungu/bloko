<script>
	import { setContext } from 'svelte';

	/**
	 * @typedef {Object} TabsProps
	 * @property {string} [activeTab=''] - ID of the currently active tab
	 * @property {'24' | '28' | '32' | '40'} [size='32'] - Size of tab buttons
	 * @property {(tabId: string) => void} [onTabChange] - Callback when tab changes
	 * @property {import('svelte').Snippet} [children] - Tab components and layout
	 */

	/** @type {TabsProps} */
	let { activeTab = '', size = '32', onTabChange, children } = $props();

	let tabs = $state([]);
	let activeTabId = $state(activeTab);

	// Initialize activeTab to first tab if not provided
	$effect(() => {
		if (!activeTabId && tabs.length > 0) {
			activeTabId = tabs[0].id;
		}
	});

	// Update activeTab when prop changes
	$effect(() => {
		activeTabId = activeTab;
	});

	function handleTabClick(tabId) {
		activeTabId = tabId;
		onTabChange?.(tabId);
	}

	function registerTab(tab) {
		tabs = [...tabs, tab];
	}

	function unregisterTab(tabId) {
		tabs = tabs.filter((t) => t.id !== tabId);
	}

	function updateTab(tabId, patch) {
		let updated = false;
		const next = tabs.map((t) => {
			if (t.id !== tabId) return t;
			const merged = { ...t, ...patch };
			if (merged.label !== t.label || merged.intent !== t.intent) {
				updated = true;
				return merged;
			}
			return t;
		});
		if (updated) tabs = next; // only set when something actually changed
	}

	// Provide context to all child components
	setContext('tabs', {
		get activeTabId() {
			return activeTabId;
		},
		get size() {
			return size;
		},
		get tabs() {
			return tabs;
		},
		handleTabClick,
		registerTab,
		unregisterTab,
		updateTab,
	});
</script>

<div class="tabs">
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.tabs {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
</style>
