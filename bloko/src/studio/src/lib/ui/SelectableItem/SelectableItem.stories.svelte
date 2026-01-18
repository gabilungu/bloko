<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import SelectableItem from './SelectableItem.svelte';

	const { Story } = defineMeta({
		title: 'Views/SelectableItem',
		component: SelectableItem,
		tags: ['autodocs'],
	});
</script>

<Story name="Default" args={{ selected: false, disabled: false }}>
	{#snippet template(args)}
		{#snippet content()}
			<span>Default item</span>
		{/snippet}
		<SelectableItem {...args} children={content} />
	{/snippet}
</Story>

<Story name="Selected" args={{ selected: true }}>
	{#snippet template(args)}
		{#snippet content()}
			<span>Selected item</span>
		{/snippet}
		<SelectableItem {...args} children={content} />
	{/snippet}
</Story>

<Story name="Disabled" args={{ disabled: true }}>
	{#snippet template(args)}
		{#snippet content()}
			<span>Disabled item</span>
		{/snippet}
		<SelectableItem {...args} children={content} />
	{/snippet}
</Story>

<Story
	name="Custom Colors"
	args={{
		selectedBg: 'var(--accent400)',
		selectedColor: 'var(--accent900)',
		selectedBorder: 'var(--accent500)',
		hoverBg: 'var(--base100)',
	}}
>
	{#snippet template(args)}
		{#snippet content()}
			<span>Accent themed</span>
		{/snippet}
		<SelectableItem {...args} children={content} />
	{/snippet}
</Story>

<Story name="Group Example">
	{#snippet template()}
		<div style="display:flex; gap:6px; flex-wrap:wrap;">
			{#snippet c1()}<span>One</span>{/snippet}
			{#snippet c2()}<span>Two</span>{/snippet}
			{#snippet c3()}<span>Three</span>{/snippet}
			<SelectableItem selected={true} children={c1} />
			<SelectableItem children={c2} />
			<SelectableItem children={c3} />
		</div>
	{/snippet}
</Story>
