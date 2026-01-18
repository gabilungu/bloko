<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Chips from './Chips.svelte';

	const { Story } = defineMeta({
		title: 'Form/Chips',
		component: Chips,
		tags: ['autodocs'],
	});
</script>

<Story
	name="Default"
	args={{
		options: [
			{
				value: 'a',
				label: 'Alpha',
				background: 'var(--action500)',
				foreground: 'var(--base0)',
			},
			{
				value: 'b',
				label: 'Beta',
				background: 'var(--success500)',
				foreground: 'var(--base0)',
			},
			{
				value: 'g',
				label: 'Gamma',
				background: 'var(--warning500)',
				foreground: 'var(--base0)',
			},
		],
		size: 20,
	}}
>
	{#snippet template(args)}
		<Chips {...args} />
	{/snippet}
</Story>

<Story
	name="With Colors"
	args={{
		value: 'beta',
		options: [
			{
				value: 'cat',
				label: 'Cat',
				background: 'var(--accent500)',
				foreground: 'var(--base0)',
			},
			{
				value: 'dog',
				label: 'Dog',
				background: 'var(--success500)',
				foreground: 'var(--base0)',
			},
			{
				value: 'fox',
				label: 'Fox',
				background: 'var(--warning500)',
				foreground: 'var(--base0)',
			},
		],
		size: 24,
	}}
>
	{#snippet template(args)}
		<Chips {...args} />
	{/snippet}
</Story>

<Story
	name="Disabled Items"
	args={{
		nullable: true,
		options: [
			{
				value: 'one',
				label: 'One',
				background: 'var(--base900)',
				foreground: 'var(--base0)',
			},
			{
				value: 'two',
				label: 'Two',
				background: 'var(--base700)',
				foreground: 'var(--base0)',
				disabled: true,
			},
			{
				value: 'three',
				label: 'Three',
				background: 'var(--action500)',
				foreground: 'var(--base0)',
			},
		],
		size: 28,
	}}
>
	{#snippet template(args)}
		<Chips {...args} />
	{/snippet}
</Story>

<Story name="Sizes">
	{#snippet template()}
		<div
			style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;"
		>
			<Chips
				size={16}
				options={[
					{
						value: 's',
						label: '16',
						background: 'var(--action500)',
						foreground: 'var(--base0)',
					},
				]}
			/>
			<Chips
				size={20}
				options={[
					{
						value: 'm',
						label: '20',
						background: 'var(--success500)',
						foreground: 'var(--base0)',
					},
				]}
			/>
			<Chips
				size={24}
				options={[
					{
						value: 'l',
						label: '24',
						background: 'var(--warning500)',
						foreground: 'var(--base0)',
					},
				]}
			/>
			<Chips
				size={28}
				options={[
					{
						value: 'xl',
						label: '28',
						background: 'var(--accent500)',
						foreground: 'var(--base0)',
					},
				]}
			/>
		</div>
	{/snippet}
</Story>
