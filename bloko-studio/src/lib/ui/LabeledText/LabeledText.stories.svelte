<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import LabeledText from './LabeledText.svelte';

	const { Story } = defineMeta({
		title: 'Display/LabeledText',
		component: LabeledText,
		tags: ['autodocs'],
	});
</script>

<Story name="Default" args={{ label: 'Name', text: 'John Doe' }} />

<Story
	name="With Custom Gap"
	args={{ label: 'Email', text: 'john.doe@example.com', gap: '8px' }}
/>

<Story name="Custom Font Sizes">
	{#snippet template(args)}
		<LabeledText
			label="Title"
			text="Senior Developer"
			labelSize="10px"
			textSize="16px"
		/>
	{/snippet}
</Story>

<Story name="Custom Colors">
	{#snippet template(args)}
		<LabeledText
			label="Status"
			text="Active"
			labelColor="var(--success500)"
			textColor="var(--success700)"
		/>
	{/snippet}
</Story>

<Story name="Multiple Fields">
	{#snippet template(args)}
		<div style="display: flex; flex-direction: column; gap: 16px;">
			<LabeledText label="Full Name" text="Jane Smith" />
			<LabeledText label="Email" text="jane.smith@company.com" />
			<LabeledText label="Phone" text="+1 (555) 123-4567" />
			<LabeledText label="Department" text="Engineering" />
		</div>
	{/snippet}
</Story>

<Story name="Grid Layout">
	{#snippet template(args)}
		<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
			<LabeledText label="First Name" text="Alice" />
			<LabeledText label="Last Name" text="Johnson" />
			<LabeledText label="Age" text="28" />
			<LabeledText label="City" text="San Francisco" />
		</div>
	{/snippet}
</Story>

<Story name="Status Colors">
	{#snippet template(args)}
		<div style="display: flex; flex-direction: column; gap: 16px;">
			<LabeledText
				label="Error"
				text="Something went wrong"
				labelColor="var(--danger500)"
				textColor="var(--danger700)"
			/>
			<LabeledText
				label="Warning"
				text="Please verify your input"
				labelColor="var(--warning500)"
				textColor="var(--warning700)"
			/>
			<LabeledText
				label="Success"
				text="Operation completed"
				labelColor="var(--success500)"
				textColor="var(--success700)"
			/>
			<LabeledText
				label="Info"
				text="Additional information"
				labelColor="var(--action500)"
				textColor="var(--action700)"
			/>
		</div>
	{/snippet}
</Story>

<Story name="Compact Style">
	{#snippet template(args)}
		<LabeledText
			label="ID"
			text="12345"
			gap="2px"
			labelSize="10px"
			textSize="12px"
		/>
	{/snippet}
</Story>

<Story name="Spacious Style">
	{#snippet template(args)}
		<LabeledText
			label="Description"
			text="This is a longer text that demonstrates how the component handles more content"
			gap="12px"
			labelSize="14px"
			textSize="16px"
		/>
	{/snippet}
</Story>
