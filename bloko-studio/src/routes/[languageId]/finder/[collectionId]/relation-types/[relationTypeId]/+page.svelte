<script>
	import RelationTypeForm from '../../../forms/RelationTypeForm.svelte';

	let { data } = $props();
</script>

<RelationTypeForm {data} relationType={data.relationType} />
