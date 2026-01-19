<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { TreeView, Badge } from '$lib/ui';

	const { Story } = defineMeta({
		title: 'Views/TreeView',
		component: TreeView,
		tags: ['autodocs'],
	});
</script>

<script>
	const sampleData = [
		{
			id: 1,
			name: 'Documents',
			order: 0,
			items: [
				{
					id: 2,
					name: 'Projects',
					order: 0,
					items: [
						{ id: 3, name: 'Project A', order: 0 },
						{ id: 4, name: 'Project B', order: 1 },
						{
							id: 5,
							name: 'Project C',
							order: 2,
							items: [
								{ id: 6, name: 'Specs.md', order: 0 },
								{ id: 7, name: 'README.md', order: 1 },
							],
						},
					],
				},
				{
					id: 8,
					name: 'Archive',
					order: 1,
					items: [{ id: 9, name: 'Old Files', order: 0 }],
				},
			],
		},
		{
			id: 10,
			name: 'Images',
			order: 1,
			items: [
				{ id: 11, name: 'Screenshots', order: 0 },
				{ id: 12, name: 'Photos', order: 1 },
			],
		},
		{
			id: 13,
			name: 'Downloads',
			order: 2,
		},
	];

	const sampleDataWithCategories = [
		{
			id: 1,
			name: 'Frontend Files',
			order: 0,
			category: {
				name: 'Folder',
				background: 'var(--info500)',
				foreground: 'var(--base0)',
			},
			items: [
				{
					id: 2,
					name: 'Components',
					order: 0,
					category: {
						name: 'Folder',
						background: 'var(--info500)',
						foreground: 'var(--base0)',
					},
					items: [
						{
							id: 3,
							name: 'Button.svelte',
							order: 0,
							category: {
								name: 'Component',
								background: 'var(--success500)',
								foreground: 'var(--base0)',
							},
						},
						{
							id: 4,
							name: 'Badge.svelte',
							order: 1,
							category: {
								name: 'Component',
								background: 'var(--success500)',
								foreground: 'var(--base0)',
							},
						},
						{
							id: 5,
							name: 'TreeView.svelte',
							order: 2,
							category: {
								name: 'Component',
								background: 'var(--success500)',
								foreground: 'var(--base0)',
							},
						},
					],
				},
				{
					id: 6,
					name: 'Styles',
					order: 1,
					category: {
						name: 'Folder',
						background: 'var(--info500)',
						foreground: 'var(--base0)',
					},
					items: [
						{
							id: 7,
							name: 'globals.css',
							order: 0,
							category: {
								name: 'CSS',
								background: 'var(--warning500)',
								foreground: 'var(--base0)',
							},
						},
						{
							id: 8,
							name: 'theme.css',
							order: 1,
							category: {
								name: 'CSS',
								background: 'var(--warning500)',
								foreground: 'var(--base0)',
							},
						},
					],
				},
			],
		},
		{
			id: 9,
			name: 'Backend Files',
			order: 1,
			category: {
				name: 'Folder',
				background: 'var(--info500)',
				foreground: 'var(--base0)',
			},
			items: [
				{
					id: 10,
					name: 'api.js',
					order: 0,
					category: {
						name: 'API',
						background: 'var(--action500)',
						foreground: 'var(--base0)',
					},
				},
				{
					id: 11,
					name: 'database.js',
					order: 1,
					category: {
						name: 'DB',
						background: 'var(--danger500)',
						foreground: 'var(--base0)',
					},
				},
			],
		},
		{
			id: 12,
			name: 'README.md',
			order: 2,
			category: {
				name: 'Docs',
				background: 'var(--base600)',
				foreground: 'var(--base0)',
			},
		},
	];
</script>

<Story name="Nested Structure" args={{ items: sampleData }} />

<Story
	name="Flat Structure"
	args={{ items: sampleData, allowNesting: false }}
/>

<Story name="Always Show Dropzones" args={{ items: sampleData }}>
	{#snippet template(args)}
		<TreeView {...args} alwaysShowDropzones={true} />
	{/snippet}
</Story>

<Story name="Custom Gap" args={{ items: sampleData }}>
	{#snippet template(args)}
		<div style="display: flex; gap: 20px;">
			<div>
				<h4 style="margin-top: 0;">Default Gap (4px)</h4>
				<TreeView {...args} />
			</div>
			<div>
				<h4 style="margin-top: 0;">Large Gap (12px)</h4>
				<TreeView {...args} gap="12px" />
			</div>
		</div>
	{/snippet}
</Story>

<Story name="Custom Dropzone Height" args={{ items: sampleData }}>
	{#snippet template(args)}
		<div style="display: flex; gap: 20px;">
			<div>
				<h4 style="margin-top: 0;">Default Height (8px)</h4>
				<TreeView {...args} alwaysShowDropzones={true} />
			</div>
			<div>
				<h4 style="margin-top: 0;">Thick Dropzones (16px)</h4>
				<TreeView
					{...args}
					alwaysShowDropzones={true}
					dropzoneHeight="16px"
				/>
			</div>
		</div>
	{/snippet}
</Story>

<Story name="Selection Disabled" args={{ items: sampleData }}>
	{#snippet template(args)}
		<div>
			<p style="margin-bottom: 8px; font-size: 14px; color: #666;">
				Selection disabled - clicking items has no effect.
			</p>
			<TreeView {...args} allowSelection={false} />
		</div>
	{/snippet}
</Story>

<Story name="Custom Item Content" args={{ items: sampleDataWithCategories }}>
	{#snippet template(args)}
		<div>
			<p style="font-size: 14px; color: #666;">
				Custom content using snippets.
			</p>
			<TreeView {...args}>
				{#snippet itemContent(item)}
					<div
						style="display: flex; align-items: center; justify-content: space-between;"
					>
						<span>{item.name}</span>
						{#if item.category}
							<div
								style="display: flex; align-items: center; gap: 8px;"
							>
								<Badge
									text={item.category.name}
									background={item.category.background}
									foreground={item.category.foreground}
									size={16}
								/>
								<span
									style="font-size: 12px; color: var(--base500)"
									>{item.order}</span
								>
							</div>
						{/if}
					</div>
				{/snippet}
			</TreeView>
		</div>
	{/snippet}
</Story>
