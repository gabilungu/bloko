<script>
	import BlockForm from '../../../../../forms/BlockForm.svelte';
	let { data } = $props();
</script>

<BlockForm {data} block={data.block} />
