<script>
	let { children } = $props();
</script>

<svelte:head>
	<title>DermaPedia - Dermatology Encyclopedia</title>
</svelte:head>

{@render children()}

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(body) {
		font-family: system-ui, -apple-system, sans-serif;
		background: #f8f9fa;
		color: #1a1a2e;
		line-height: 1.6;
	}
</style>
