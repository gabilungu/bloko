<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import BlockPreview from './BlockPreview.svelte';
	import Input from '../Input/Input.svelte';
	import Textarea from '../Textarea/Textarea.svelte';

	const { Story } = defineMeta({
		title: 'Components/BlockPreview',
		component: BlockPreview,
		tags: ['autodocs']
	});
</script>

<Story name="Text Content" globals={{ backgrounds: { value: 'base50' } }}>
	{#snippet template(args)}
		<BlockPreview code="symbol" title="Chemical Symbol" hint="e.g., H, He, C" contentType="text">
			{#snippet contentForm()}
				<Input id="demo-text" size="32" placeholder="Enter text" value="H" />
			{/snippet}
		</BlockPreview>
	{/snippet}
</Story>

<Story name="Paragraph Content" globals={{ backgrounds: { value: 'base50' } }}>
	{#snippet template(args)}
		<BlockPreview code="definition" title="Definition" hint="Brief description" contentType="paragraph">
			{#snippet contentForm()}
				<Textarea id="demo-paragraph" placeholder="Enter paragraph" value="Hydrogen is the lightest element..." />
			{/snippet}
		</BlockPreview>
	{/snippet}
</Story>

<Story name="Number Content" globals={{ backgrounds: { value: 'base50' } }}>
	{#snippet template(args)}
		<BlockPreview code="atomic_mass" title="Atomic Mass" hint="In atomic mass units" contentType="number">
			{#snippet contentForm()}
				<Input id="demo-number" size="32" type="number" placeholder="Enter number" value="1.008" />
			{/snippet}
		</BlockPreview>
	{/snippet}
</Story>

<Story name="No Content Form" globals={{ backgrounds: { value: 'base50' } }}>
	{#snippet template(args)}
		<BlockPreview code="Summary" title="Summary Section" hint="Overview of the element" />
	{/snippet}
</Story>

<Story name="Nested Blocks" globals={{ backgrounds: { value: 'base50' } }}>
	{#snippet template(args)}
		<BlockPreview code="Properties" title="Properties" hint="Chemical properties">
			{#snippet children()}
				<div style="display: flex; flex-direction: column; gap: 4px; width: 100%;">
					<BlockPreview code="symbol" title="Symbol" hint="e.g., H, He, C" contentType="text">
						{#snippet contentForm()}
							<Input id="nested-symbol" size="32" placeholder="Enter text" value="H" />
						{/snippet}
					</BlockPreview>
					<BlockPreview code="atomic_number" title="Atomic Number" hint="Number of protons" contentType="number">
						{#snippet contentForm()}
							<Input id="nested-number" size="32" type="number" placeholder="Enter number" value="1" />
						{/snippet}
					</BlockPreview>
					<BlockPreview code="atomic_mass" title="Atomic Mass" hint="In atomic mass units" contentType="number">
						{#snippet contentForm()}
							<Input id="nested-mass" size="32" type="number" placeholder="Enter number" value="1.008" />
						{/snippet}
					</BlockPreview>
				</div>
			{/snippet}
		</BlockPreview>
	{/snippet}
</Story>
