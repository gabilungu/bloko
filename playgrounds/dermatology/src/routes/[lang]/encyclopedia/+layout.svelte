<script>
	import { page } from '$app/stores';

	let { children, data } = $props();

	const lang = $derived($page.params.lang);
	const currentSlug = $derived($page.params.slug);
</script>

<div class="encyclopedia-layout">
	<aside class="tree-sidebar">
		<h3>{lang === 'ro' ? 'Navigare' : 'Navigation'}</h3>
		<nav class="tree">
			{#each data.tree as section}
				<div class="tree-section">
					<a
						href="/{lang}/encyclopedia/{section.slug}"
						class="tree-item section-item"
						class:active={currentSlug === section.slug}
					>
						{section.title}
					</a>
					{#if section.children.length > 0}
						<ul class="tree-children">
							{#each section.children as child}
								<li>
									<a
										href="/{lang}/encyclopedia/{child.slug}"
										class="tree-item"
										class:active={currentSlug === child.slug}
									>
										{child.title}
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/each}
		</nav>
	</aside>

	<div class="encyclopedia-content">
		{@render children()}
	</div>
</div>

<style>
	.encyclopedia-layout {
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: 2rem;
		min-height: calc(100vh - 200px);
	}

	.tree-sidebar {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		height: fit-content;
		position: sticky;
		top: 100px;
		max-height: calc(100vh - 140px);
		overflow-y: auto;
	}

	.tree-sidebar h3 {
		color: #1a1a2e;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #eee;
	}

	.tree {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.tree-section {
		margin-bottom: 0.5rem;
	}

	.tree-item {
		display: block;
		padding: 0.5rem 0.75rem;
		color: #444;
		text-decoration: none;
		border-radius: 6px;
		font-size: 0.9rem;
		transition: all 0.2s;
	}

	.tree-item:hover {
		background: #f5f5f5;
		color: #1a1a2e;
	}

	.tree-item.active {
		background: #1a1a2e;
		color: white;
	}

	.section-item {
		font-weight: 600;
		color: #1a1a2e;
	}

	.tree-children {
		list-style: none;
		margin: 0;
		padding-left: 1rem;
		border-left: 2px solid #eee;
		margin-left: 0.75rem;
		margin-top: 0.25rem;
	}

	.tree-children li {
		margin: 0;
	}

	.tree-children .tree-item {
		font-size: 0.85rem;
		padding: 0.4rem 0.75rem;
	}

	.encyclopedia-content {
		min-width: 0;
	}

	@media (max-width: 900px) {
		.encyclopedia-layout {
			grid-template-columns: 1fr;
		}

		.tree-sidebar {
			position: static;
			max-height: none;
		}
	}
</style>
