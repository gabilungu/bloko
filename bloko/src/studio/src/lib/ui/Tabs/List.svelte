<script>
	import { getContext } from 'svelte';

	/**
	 * @typedef {Object} TabsListProps
	 * @property {import('svelte').Snippet} [children] - Tab button components
	 */

	/** @type {TabsListProps} */
	let { children } = $props();

	// Get context from parent Tabs component
	const tabsContext = getContext('tabs');

	// Use getters to access reactive values
	let size = $derived(tabsContext.size);
	let tabs = $derived(tabsContext.tabs);
	let activeTabId = $derived(tabsContext.activeTabId);
	let handleTabClick = tabsContext.handleTabClick;
</script>

<div class="tab-nav" role="tablist">
	{#each tabs as tab}
		<button
			id={`tab-${tab.id}`}
			class="tab-button size-{size} intent-{tab.intent || 'default'}"
			class:active={activeTabId === tab.id}
			aria-selected={activeTabId === tab.id}
			aria-controls={`panel-${tab.id}`}
			role="tab"
			tabindex={activeTabId === tab.id ? 0 : -1}
			onclick={() => handleTabClick(tab.id)}
			type="button"
		>
			{tab.label}
		</button>
	{/each}
</div>

<style>
	.tab-nav {
		display: flex;
		border-bottom: 1px solid var(--base200);
		background: var(--base50);
		gap: 0;
	}

	.tab-button {
		font-weight: 500;
		color: var(--base600);
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		cursor: pointer;
		transition: all 0.2s ease;
		position: relative;
	}

	/* Size variants */
	.tab-button.size-24 {
		height: 24px;
		padding: 0 8px;
		font-size: 12px;
	}

	.tab-button.size-28 {
		height: 28px;
		padding: 0 10px;
		font-size: 13px;
	}

	.tab-button.size-32 {
		height: 32px;
		padding: 0 12px;
		font-size: 14px;
	}

	.tab-button.size-40 {
		height: 40px;
		padding: 0 16px;
		font-size: 16px;
	}

	.tab-button:hover {
		color: var(--accent600);
		background: var(--base50);
	}

	.tab-button.active {
		color: var(--action600);
		border-bottom-color: var(--action500);
		background: var(--base0);
	}

	/* Intent base (always visible) */
	.tab-button.intent-default {
		color: var(--action700);
		background: var(--action50);
		border-bottom-color: transparent;
	}
	.tab-button.intent-success {
		color: var(--success700);
		background: var(--success50);
		border-bottom-color: transparent;
	}
	.tab-button.intent-danger {
		color: var(--danger700);
		background: var(--danger50);
		border-bottom-color: transparent;
	}

	/* Intent hover (when not active) */
	.tab-button.intent-default:not(.active):hover {
		background: var(--action100);
		color: var(--action800);
	}
	.tab-button.intent-success:not(.active):hover {
		background: var(--success100);
		color: var(--success800);
	}
	.tab-button.intent-danger:not(.active):hover {
		background: var(--danger100);
		color: var(--danger800);
	}

	/* Intent active (full color with white text) */
	.tab-button.intent-default.active {
		background: var(--action500);
		color: var(--base0);
		border-bottom-color: var(--action600);
	}
	.tab-button.intent-success.active {
		background: var(--success500);
		color: var(--base0);
		border-bottom-color: var(--success600);
	}
	.tab-button.intent-danger.active {
		background: var(--danger500);
		color: var(--base0);
		border-bottom-color: var(--danger600);
	}

	.tab-button:focus-visible {
		outline: 2px solid var(--focus400);
		outline-offset: -2px;
		z-index: 1;
	}
</style>
