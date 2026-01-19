<script>
	import { page } from '$app/stores';

	let { data } = $props();
	const lang = $derived($page.params.lang);
</script>

<nav class="breadcrumb">
	<a href="/{lang}/encyclopedia">{lang === 'ro' ? 'Enciclopedie' : 'Encyclopedia'}</a>
	{#if data.parentNode}
		<span class="sep">/</span>
		<a href="/{lang}/encyclopedia/{data.parentNode.slug}">{data.parentNode.title}</a>
	{/if}
	<span class="sep">/</span>
	<span>{data.entry.title}</span>
</nav>

<article class:section-view={data.isSection}>
	<header class="entry-header">
		{#if data.entry.coverImageUrl}
			<div class="cover-image">
				<img src={data.entry.coverImageUrl} alt={data.entry.title} />
			</div>
		{/if}
		<h1>{data.entry.title}</h1>
		{#if data.entry.subtitle}
			<p class="subtitle">{data.entry.subtitle}</p>
		{/if}
		{#if data.entry.nodeType}
			<span class="node-type">{data.entry.nodeType}</span>
		{/if}
	</header>

	{#if data.contentBlocks.length > 0}
		<div class="content">
			{#each data.contentBlocks as block}
				<section class="content-block">
					<h2>{block.title}</h2>
					{#if block.contentType === 'text_list' && Array.isArray(block.value)}
						{#each block.value as paragraph}
							<p>{paragraph}</p>
						{/each}
					{:else if Array.isArray(block.value)}
						<ul>
							{#each block.value as item}
								<li>{item}</li>
							{/each}
						</ul>
					{:else}
						<p>{block.value}</p>
					{/if}
				</section>
			{/each}
		</div>
	{/if}

	{#if data.isSection && data.childNodes.length > 0}
		<div class="children-section">
			<h2>{lang === 'ro' ? 'În această secțiune' : 'In this section'}</h2>
			<div class="children-grid">
				{#each data.childNodes as child}
					<a href="/{lang}/encyclopedia/{child.slug}" class="child-card">
						<h3>{child.title}</h3>
						{#if child.subtitle}
							<p class="child-subtitle">{child.subtitle}</p>
						{/if}
					</a>
				{/each}
			</div>
		</div>
	{/if}

	{#if Object.keys(data.relations).length > 0}
		<aside class="relations">
			<h3>{lang === 'ro' ? 'Legături' : 'Related'}</h3>
			{#each Object.entries(data.relations) as [label, nodes]}
				<div class="relation-group">
					<h4>{label}</h4>
					<ul>
						{#each nodes as node}
							<li>
								<a href="/{lang}/encyclopedia/{node.slug}">{node.title}</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</aside>
	{/if}
</article>

<style>
	.breadcrumb {
		font-size: 0.9rem;
		margin-bottom: 1.5rem;
		color: #666;
	}

	.breadcrumb a {
		color: #3b82f6;
		text-decoration: none;
	}

	.breadcrumb a:hover {
		text-decoration: underline;
	}

	.sep {
		margin: 0 0.5rem;
		color: #ccc;
	}

	article {
		display: grid;
		grid-template-columns: 1fr 250px;
		gap: 2rem;
	}

	article.section-view {
		grid-template-columns: 1fr;
	}

	.entry-header {
		grid-column: 1 / -1;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid #eee;
		margin-bottom: 1rem;
	}

	.cover-image {
		margin-bottom: 1.5rem;
		border-radius: 12px;
		overflow: hidden;
		max-width: 600px;
	}

	.cover-image img {
		width: 100%;
		height: auto;
		display: block;
	}

	h1 {
		color: #1a1a2e;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: #3b82f6;
		font-size: 1.1rem;
		margin-bottom: 0.5rem;
	}

	.node-type {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		background: #e0e7ff;
		color: #3730a3;
		border-radius: 4px;
		font-size: 0.8rem;
		font-weight: 500;
	}

	.content {
		grid-column: 1;
	}

	.content-block {
		margin-bottom: 2rem;
	}

	.content-block h2 {
		color: #1a1a2e;
		font-size: 1.2rem;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid #4ade80;
	}

	.content-block p {
		margin-bottom: 1rem;
		color: #444;
		line-height: 1.7;
	}

	.content-block ul {
		margin-left: 1.5rem;
		color: #444;
	}

	.content-block li {
		margin-bottom: 0.5rem;
	}

	.children-section {
		grid-column: 1 / -1;
	}

	.children-section h2 {
		color: #1a1a2e;
		font-size: 1.2rem;
		margin-bottom: 1rem;
	}

	.children-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
	}

	.child-card {
		display: block;
		padding: 1.25rem;
		background: white;
		border: 1px solid #eee;
		border-radius: 8px;
		text-decoration: none;
		transition: all 0.2s;
	}

	.child-card:hover {
		border-color: #3b82f6;
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
	}

	.child-card h3 {
		color: #1a1a2e;
		font-size: 1rem;
		margin-bottom: 0.25rem;
	}

	.child-subtitle {
		color: #666;
		font-size: 0.85rem;
		margin: 0;
	}

	.relations {
		grid-column: 2;
		grid-row: 2;
		background: #f8f9fa;
		padding: 1.5rem;
		border-radius: 12px;
		height: fit-content;
	}

	.relations h3 {
		color: #1a1a2e;
		margin-bottom: 1rem;
		font-size: 1rem;
	}

	.relation-group {
		margin-bottom: 1rem;
	}

	.relation-group h4 {
		color: #666;
		font-size: 0.85rem;
		font-weight: 500;
		margin-bottom: 0.5rem;
	}

	.relation-group ul {
		list-style: none;
	}

	.relation-group li {
		margin-bottom: 0.25rem;
	}

	.relation-group a {
		color: #3b82f6;
		text-decoration: none;
		font-size: 0.9rem;
	}

	.relation-group a:hover {
		text-decoration: underline;
	}

	@media (max-width: 768px) {
		article {
			grid-template-columns: 1fr;
		}

		.relations {
			grid-column: 1;
		}
	}
</style>
