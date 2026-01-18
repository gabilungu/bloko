<script>
	import { onMount, onDestroy, getContext } from 'svelte';

	/**
	 * @typedef {Object} TabProps
	 * @property {string} id - Unique identifier for the tab
	 * @property {string} label - Display text for the tab button
	 * @property {'default' | 'success' | 'danger'} [intent='default'] - Visual intent for the tab
	 */

	/** @type {TabProps} */
	let { id, label, intent = 'default' } = $props();

	// Get context from parent Tabs component
	const tabsContext = getContext('tabs');
	const { registerTab, unregisterTab, updateTab } = tabsContext;

	onMount(() => {
		registerTab({ id, label, intent });
	});

	onDestroy(() => {
		unregisterTab(id);
	});

	$effect(() => {
		// track dependencies so this effect runs only when they change
		label;
		intent;
		updateTab?.(id, { label, intent });
	});
</script>

<!-- Tab component only registers itself, doesn't render anything -->
<!-- The actual tab button is rendered by Tabs.List -->
<!-- The content is rendered by Tabs.Content -->
