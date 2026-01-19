<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Input from './Input.svelte';

	const { Story } = defineMeta({
		title: 'Form/Input',
		component: Input,
		tags: ['autodocs'],
	});
</script>

<Story name="Default" args={{ placeholder: 'Enter text...' }} />

<Story
	name="Password"
	args={{ type: 'password', placeholder: 'Enter password...' }}
/>

<Story
	name="Number"
	args={{ type: 'number', placeholder: 'Enter number...' }}
/>

<Story name="Sizes">
	{#snippet template(args)}
		<div style="display: flex; flex-direction: column; gap: 16px;">
			<Input placeholder="Size 24" size="24" />
			<Input placeholder="Size 28" size="28" />
			<Input placeholder="Size 32" size="32" />
			<Input placeholder="Size 40" size="40" />
		</div>
	{/snippet}
</Story>

<Story
	name="Disabled"
	args={{ disabled: true, placeholder: 'Disabled input' }}
/>

<Story name="With Value" args={{ value: 'This is some text' }} />

<Story
	name="Required"
	args={{ required: true, placeholder: 'Required field' }}
/>

<Story name="Accent Variant">
	{#snippet template(args)}
		<div style="display: flex; flex-direction: column; gap: 16px;">
			<Input placeholder="Accent 28" size="28" variant="accent" />
			<Input placeholder="Accent 32" size="32" variant="accent" />
			<Input placeholder="Accent 40" size="40" variant="accent" />
		</div>
	{/snippet}
</Story>
