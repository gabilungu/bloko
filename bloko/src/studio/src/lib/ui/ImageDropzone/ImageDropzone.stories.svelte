<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ImageDropzone from './ImageDropzone.svelte';

	const { Story } = defineMeta({
		title: 'Media/ImageDropzone',
		component: ImageDropzone,
		tags: ['autodocs'],
	});
</script>

<script>
	let src1 = $state('');
	let src2 = $state('https://picsum.photos/seed/glosaurus/400/400');

	function handleChange1(file) {
		if (!file) {
			src1 = '';
			return;
		}
		// For demo we keep the object URL set by the component itself
		console.log('Changed 1:', file?.name, file?.type, file?.size);
	}

	function handleChange2(file) {
		if (!file) {
			src2 = '';
			return;
		}
		console.log('Changed 2:', file?.name, file?.type, file?.size);
	}
</script>

<Story name="Empty">
	{#snippet template(args)}
		<div style="width: 240px;">
			<ImageDropzone {...args} bind:src={src1} onChange={handleChange1} />
		</div>
	{/snippet}
</Story>

<Story name="With Image">
	{#snippet template(args)}
		<div style="width: 240px;">
			<ImageDropzone {...args} bind:src={src2} onChange={handleChange2} />
		</div>
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template(args)}
		<div style="width: 240px;">
			<ImageDropzone
				{...args}
				disabled
				bind:src={src2}
				onChange={handleChange2}
			/>
		</div>
	{/snippet}
</Story>

<style>
	:global(.sb-show-main) {
		background: var(--base50);
	}
	:global(.docs-story) {
		background: var(--base0);
	}
</style>
