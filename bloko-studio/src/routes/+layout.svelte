<script>
	import '$lib/ui/css/style.css';
	import Navigation from '$lib/ui/Navigation/Navigation.svelte';
	import Notification from '$lib/ui/Notification/Notification.svelte';
	import Checkbox from '$lib/ui/Checkbox/Checkbox.svelte';
	import { page } from '$app/state';
	import { detailedMode } from '$lib/globals.svelte.js';

	let { children } = $props();

	// Navigation items
	let navItems = [
		{ id: 'finder', label: 'Finder', href: '/en/finder' },
		{ id: 'node-types', label: 'Node Types', href: '/en/node-types' },
		{ id: 'languages', label: 'Languages', href: '/languages' },
		{ id: 'images', label: 'Images', href: '/images' },
		{ id: 'info', label: 'Info', href: '/info' },
	];

	// Determine active item based on current route
	let activeNavId = $derived(() => {
		const path = page.url.pathname;
		if (path.includes('/finder')) return 'finder';
		if (path.includes('/node-types')) return 'node-types';
		if (path.includes('/languages')) return 'languages';
		if (path.includes('/images')) return 'images';
		if (path.includes('/info')) return 'info';
		return 'finder';
	});
</script>

<div class="app-layout">
	<Navigation
		brandName="Bloko Studio"
		items={navItems}
		activeId={activeNavId()}
		sticky={true}
	>
		{#snippet rightContent()}
			<div class="right-controls">
				<label class="detailed-mode-label">
					<Checkbox
						checked={detailedMode.value}
						size="16"
						intent="default"
						onchange={() => detailedMode.toggle()}
					/>
					<span>Detailed</span>
				</label>
			</div>
		{/snippet}
	</Navigation>

	<main class="app-content">
		{@render children?.()}
	</main>
</div>

<Notification position="top-right" />

<style>
	.app-layout {
		height: 100vh;
		background: var(--base50);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.app-content {
		width: 100%;
		flex: 1;
		overflow: auto;
		min-height: 0;
	}

	.right-controls {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.detailed-mode-label {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 13px;
		font-weight: 500;
		color: var(--base700);
		cursor: pointer;
		user-select: none;
	}
</style>
