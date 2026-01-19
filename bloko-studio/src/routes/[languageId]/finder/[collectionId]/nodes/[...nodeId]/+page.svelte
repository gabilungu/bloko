<script>
	import NodeForm from '../../../forms/NodeForm.svelte';

	let { data } = $props();
</script>

<NodeForm {data} node={data.node} />
