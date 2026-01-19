<script>
	import TemplateForm from '../../../forms/TemplateForm.svelte';

	let { data } = $props();
</script>

<TemplateForm {data} template={data.template} />
