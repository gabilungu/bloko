<script>
	import { page } from '$app/stores';

	let { data } = $props();
	const lang = $derived($page.params.lang);
</script>

<nav class="breadcrumb">
	<a href="/{lang}/articles">{lang === 'ro' ? 'Articole' : 'Articles'}</a>
	<span class="sep">/</span>
	<span>{data.article.title}</span>
</nav>

<article>
	<header class="article-header">
		<h1>{data.article.title}</h1>
		{#if data.article.subtitle}
			<p class="subtitle">{data.article.subtitle}</p>
		{/if}
	</header>

	{#if data.article.summary}
		<div class="summary">
			<p>{data.article.summary}</p>
		</div>
	{/if}

	{#if data.article.body}
		<div class="body">
			{#if Array.isArray(data.article.body)}
				{#each data.article.body as paragraph}
					<p>{paragraph}</p>
				{/each}
			{:else}
				<p>{data.article.body}</p>
			{/if}
		</div>
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
		background: white;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		max-width: 800px;
	}

	.article-header {
		padding-bottom: 1.5rem;
		border-bottom: 1px solid #eee;
		margin-bottom: 1.5rem;
	}

	h1 {
		color: #1a1a2e;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: #3b82f6;
		font-size: 1.1rem;
	}

	.summary {
		background: #f8f9fa;
		padding: 1.5rem;
		border-radius: 8px;
		margin-bottom: 2rem;
		border-left: 4px solid #4ade80;
	}

	.summary p {
		color: #555;
		line-height: 1.6;
		margin: 0;
	}

	.body p {
		color: #444;
		line-height: 1.8;
		margin-bottom: 1.5rem;
	}

	.body p:last-child {
		margin-bottom: 0;
	}
</style>
