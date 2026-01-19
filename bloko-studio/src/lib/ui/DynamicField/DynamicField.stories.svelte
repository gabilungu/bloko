<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import DynamicField from './DynamicField.svelte';

	const { Story } = defineMeta({
		title: 'Form/DynamicField',
		component: DynamicField,
		tags: ['autodocs'],
	});
</script>

<Story name="Default" args={{ type: 'string', value: 'Hello' }} />

<Story name="Number" args={{ type: 'number', value: 42 }} />

<Story name="Boolean" args={{ type: 'boolean', value: true }} />

<Story name="String" args={{ type: 'string', value: 'Hello' }} />

<Story
	name="Strings Array"
	args={{ type: 'strings_array', value: ['alpha', 'beta'] }}
/>
