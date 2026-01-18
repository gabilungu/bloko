<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/en/finder', { replaceState: true });
	});
</script>

<div class="container">
	<p>Redirecting to Finder...</p>
</div>

<style>
	.container {
		padding: 2rem;
		text-align: center;
		color: var(--base600);
	}
</style>
