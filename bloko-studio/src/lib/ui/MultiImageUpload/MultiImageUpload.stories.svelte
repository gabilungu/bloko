<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import MultiImageUpload from './MultiImageUpload.svelte';

	const { Story } = defineMeta({
		title: 'Media/MultiImageUpload',
		component: MultiImageUpload,
		tags: ['autodocs'],
	});
</script>

<script>
	let images1 = $state([]);
	let images2 = $state([
		{ id: '1', url: 'https://picsum.photos/seed/img1/200/200', file_name: 'image1.jpg' },
		{ id: '2', url: 'https://picsum.photos/seed/img2/200/200', file_name: 'image2.jpg' },
		{ id: '3', url: 'https://picsum.photos/seed/img3/200/200', file_name: 'image3.jpg' },
	]);

	async function handleUpload1(file) {
		// Simulate upload delay
		await new Promise(r => setTimeout(r, 500));
		const id = crypto.randomUUID();
		const url = URL.createObjectURL(file);
		const newImage = { id, url, file_name: file.name };
		images1 = [...images1, newImage];
		console.log('Uploaded:', file.name);
		return newImage;
	}

	async function handleDelete1(imageId) {
		images1 = images1.filter(img => img.id !== imageId);
		console.log('Deleted:', imageId);
	}

	async function handleUpload2(file) {
		await new Promise(r => setTimeout(r, 500));
		const id = crypto.randomUUID();
		const url = URL.createObjectURL(file);
		const newImage = { id, url, file_name: file.name };
		images2 = [...images2, newImage];
		console.log('Uploaded:', file.name);
		return newImage;
	}

	async function handleDelete2(imageId) {
		images2 = images2.filter(img => img.id !== imageId);
		console.log('Deleted:', imageId);
	}
</script>

<Story name="Empty">
	{#snippet template(args)}
		<div style="width: 400px;">
			<MultiImageUpload
				{...args}
				images={images1}
				onupload={handleUpload1}
				ondelete={handleDelete1}
			/>
		</div>
	{/snippet}
</Story>

<Story name="With Images">
	{#snippet template(args)}
		<div style="width: 400px;">
			<MultiImageUpload
				{...args}
				images={images2}
				onupload={handleUpload2}
				ondelete={handleDelete2}
			/>
		</div>
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template(args)}
		<div style="width: 400px;">
			<MultiImageUpload
				{...args}
				images={images2}
				disabled
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
