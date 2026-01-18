<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ColumnView from './ColumnView.svelte';
	import Badge from '../Badge/Badge.svelte';

	const { Story } = defineMeta({
		title: 'Views/ColumnView',
		component: ColumnView,
		tags: ['autodocs'],
		globals: {
			backgrounds: { value: 'base100' },
		},
	});

	let items = [
		{
			id: 1,
			name: 'Item 1',
			order: 0,
			items: [
				{ id: 4, name: 'Item 4', order: 0 },
				{
					id: 5,
					name: 'Item 5',
					order: 1,
					items: [
						{ id: 6, name: 'Item 6', order: 0 },
						{ id: 7, name: 'Item 7', order: 1 },
					],
				},
			],
		},
		{
			id: 2,
			name: 'Item 2',
			order: 1,
			items: [
				{
					id: 8,
					name: 'Item 8',
					order: 0,
				},
			],
		},
		{ id: 3, name: 'Item 3', order: 2 },
	];
	const itemsWithCategories = [
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
							name: 'ColumnView.svelte',
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
			name: 'Backend Services',
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
						name: 'Database',
						background: 'var(--danger500)',
						foreground: 'var(--base0)',
					},
				},
				{
					id: 12,
					name: 'Middleware',
					order: 2,
					category: {
						name: 'Folder',
						background: 'var(--info500)',
						foreground: 'var(--base0)',
					},
					items: [
						{
							id: 13,
							name: 'auth.js',
							order: 0,
							category: {
								name: 'Security',
								background: 'var(--danger500)',
								foreground: 'var(--base0)',
							},
						},
						{
							id: 14,
							name: 'cors.js',
							order: 1,
							category: {
								name: 'Config',
								background: 'var(--base500)',
								foreground: 'var(--base0)',
							},
						},
					],
				},
			],
		},
		{
			id: 15,
			name: 'Documentation',
			order: 2,
			category: {
				name: 'Folder',
				background: 'var(--info500)',
				foreground: 'var(--base0)',
			},
			items: [
				{
					id: 16,
					name: 'README.md',
					order: 0,
					category: {
						name: 'Markdown',
						background: 'var(--base500)',
						foreground: 'var(--base0)',
					},
				},
				{
					id: 17,
					name: 'API.md',
					order: 1,
					category: {
						name: 'Markdown',
						background: 'var(--base500)',
						foreground: 'var(--base0)',
					},
				},
			],
		},
	];
</script>

<Story name="Default" args={{ items: items }} />

<Story
	name="Custom Item Content - Badges"
	args={{ items: itemsWithCategories }}
>
	{#snippet template(args)}
		<ColumnView {...args}>
			{#snippet itemContent(item)}
				<div
					style="display: flex; align-items: center; justify-content: space-between; width: 100%;"
				>
					<span
						style="flex: 1; overflow: hidden; text-overflow: ellipsis; text-align: left;"
						>{item.name}</span
					>
					{#if item.category}
						<Badge
							text={item.category.name}
							background={item.category.background}
							foreground={item.category.foreground}
							size="16"
						/>
					{:else if item.items && item.items.length}
						<span style="font-size: 12px; color: var(--base500);"
							>{item.items.length}</span
						>
					{/if}
				</div>
			{/snippet}
		</ColumnView>
	{/snippet}
</Story>

<Story
	name="Custom Item Content - Children Count"
	args={{ items: itemsWithCategories }}
>
	{#snippet template(args)}
		<ColumnView {...args}>
			{#snippet itemContent(item)}
				<div
					style="display: flex; align-items: start; justify-content: space-between; width: 100%;"
				>
					<span
						style="flex: 1; overflow: hidden; text-overflow: ellipsis; text-align: left;"
						>{item.name}</span
					>
					{#if item.items && item.items.length > 0}
						<span style="font-size: 12px; color: var(--base500);"
							>{item.items.length}</span
						>
					{/if}
				</div>
			{/snippet}
		</ColumnView>
	{/snippet}
</Story>

<Story
	name="Always Show Dropzones"
	args={{ items: items, alwaysShowDropzones: true }}
>
	{#snippet template(args)}
		<div>
			<p style="font-size: 14px; color: #666; margin-bottom: 12px;">
				Drop zones are always visible for easier drag and drop
			</p>
			<ColumnView {...args} />
		</div>
	{/snippet}
</Story>

<Story
	name="Column Gap"
	args={{ items: items, columnsGap: '4px', selectedIds: [1, 5] }}
></Story>

<Story name="Column Padding" args={{ items: items }}>
	{#snippet template(args)}
		<div style="display: flex; flex-direction: column; gap: 20px;">
			<div>
				<p style="font-size: 12px; color: #888; margin-bottom: 8px;">
					Column padding: 4px
				</p>
				<ColumnView {...args} columnPadding="4px" />
			</div>
			<div>
				<p style="font-size: 12px; color: #888; margin-bottom: 8px;">
					Column padding: 8px (default)
				</p>
				<ColumnView {...args} columnPadding="8px" />
			</div>
			<div>
				<p style="font-size: 12px; color: #888; margin-bottom: 8px;">
					Column padding: 16px
				</p>
				<ColumnView {...args} columnPadding="16px" />
			</div>
		</div>
	{/snippet}
</Story>

<Story name="Column Width" args={{ items: items }}>
	{#snippet template(args)}
		<div style="display: flex; flex-direction: column; gap: 20px;">
			<div>
				<p style="font-size: 12px; color: #888; margin-bottom: 8px;">
					Column width: 180px
				</p>
				<ColumnView {...args} columnWidth="180px" />
			</div>
			<div>
				<p style="font-size: 12px; color: #888; margin-bottom: 8px;">
					Column width: 220px (default)
				</p>
				<ColumnView {...args} columnWidth="220px" />
			</div>
			<div>
				<p style="font-size: 12px; color: #888; margin-bottom: 8px;">
					Column width: 280px
				</p>
				<ColumnView {...args} columnWidth="280px" />
			</div>
		</div>
	{/snippet}
</Story>

<Story
	name="Controlled Selection"
	args={{
		items: items,
		selectedIds: [1, 5],
		onSelectionChange: (ids) => console.log('Selection changed:', ids),
	}}
>
	{#snippet template(args)}
		<div>
			<p style="font-size: 14px; color: #666; margin-bottom: 12px;">
				Controlled selection mode - Initial selection: Item 1 → Item 5
			</p>
			<p style="font-size: 12px; color: #888; margin-bottom: 12px;">
				Note: Due to Storybook limitations, visual updates won't
				reflect. Check console for selection changes.
			</p>
			<ColumnView {...args} />
		</div>
	{/snippet}
</Story>

<Story name="Item Sizes" args={{ items: items }}>
	{#snippet template(args)}
		<div style="display: flex; flex-direction: column; gap: 20px;">
			<div>
				<p style="font-size: 12px; color: #888; margin-bottom: 8px;">
					Size 24 (12px font)
				</p>
				<ColumnView {...args} itemSize="24" />
			</div>
			<div>
				<p style="font-size: 12px; color: #888; margin-bottom: 8px;">
					Size 28 (13px font)
				</p>
				<ColumnView {...args} itemSize="28" />
			</div>
			<div>
				<p style="font-size: 12px; color: #888; margin-bottom: 8px;">
					Size 32 - Default (14px font)
				</p>
				<ColumnView {...args} itemSize="32" />
			</div>
			<div>
				<p style="font-size: 12px; color: #888; margin-bottom: 8px;">
					Size 40 (16px font)
				</p>
				<ColumnView {...args} itemSize="40" />
			</div>
		</div>
	{/snippet}
</Story>
