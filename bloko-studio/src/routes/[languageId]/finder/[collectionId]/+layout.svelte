<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let { data, children } = $props();

	// Determine active tab from URL
	let activeTab = $derived($page.url.pathname.includes('/templates') ? 'templates' : 'nodes');

	function selectTab(tabId) {
		goto(`/${data.languageId}/finder/${data.collection.id}/${tabId}`);
	}
</script>

{@render children()}
