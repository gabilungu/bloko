<script>
	let { data } = $props();
</script>

<div class="placeholder">
	<div class="message">Select a node from the tree to edit it, or create a new one using the button above.</div>
</div>

<style>
	.placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 40px;
	}

	.message {
		color: var(--base600);
		font-size: 14px;
		text-align: center;
		max-width: 400px;
	}
</style>
