<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TextArrayInput from './TextArrayInput.svelte';

	const { Story } = defineMeta({
		title: 'Upcoming/TextArrayInput',
		component: TextArrayInput,
		tags: ['autodocs'],
	});
</script>

<Story name="Empty" args={{ value: [] }}>
	{#snippet template(args)}
		<div style="max-width: 520px;">
			<TextArrayInput {...args} />
		</div>
	{/snippet}
</Story>

<Story name="With Items" args={{ value: ['alpha', 'beta', 'gamma'] }}>
	{#snippet template(args)}
		<div style="max-width: 520px;">
			<TextArrayInput {...args} />
		</div>
	{/snippet}
</Story>

<Story
	name="Custom Placeholder"
	args={{ value: ['one'], placeholder: 'add tag…' }}
>
	{#snippet template(args)}
		<div style="max-width: 520px;">
			<TextArrayInput {...args} />
		</div>
	{/snippet}
</Story>

<Story name="Disabled" args={{ value: ['cannot', 'edit'], disabled: true }}>
	{#snippet template(args)}
		<div style="max-width: 520px;">
			<TextArrayInput {...args} />
		</div>
	{/snippet}
</Story>
