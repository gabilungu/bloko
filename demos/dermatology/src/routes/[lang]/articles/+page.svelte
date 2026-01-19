<script>
	import { page } from '$app/stores';

	let { data } = $props();
	const lang = $derived($page.params.lang);
</script>

<h1>{lang === 'ro' ? 'Articole' : 'Articles'}</h1>
<p class="subtitle">
	{lang === 'ro'
		? 'Sfaturi și informații despre sănătatea pielii'
		: 'Tips and information about skin health'}
</p>

{#if data.articles.length === 0}
	<p class="empty">{lang === 'ro' ? 'Niciun articol încă' : 'No articles yet'}</p>
{:else}
	<div class="articles-grid">
		{#each data.articles as article}
			<a href="/{lang}/articles/{article.slug}" class="article-card">
				<h2>{article.title}</h2>
				{#if article.subtitle}
					<p class="article-subtitle">{article.subtitle}</p>
				{/if}
				{#if article.summary}
					<p class="article-summary">{article.summary}</p>
				{/if}
				<span class="read-more">
					{lang === 'ro' ? 'Citește mai mult →' : 'Read more →'}
				</span>
			</a>
		{/each}
	</div>
{/if}

<style>
	h1 {
		color: #1a1a2e;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: #666;
		margin-bottom: 2rem;
	}

	.empty {
		text-align: center;
		color: #888;
		padding: 3rem;
	}

	.articles-grid {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.article-card {
		display: block;
		background: white;
		padding: 2rem;
		border-radius: 12px;
		text-decoration: none;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.article-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
	}

	.article-card h2 {
		color: #1a1a2e;
		margin-bottom: 0.5rem;
	}

	.article-subtitle {
		color: #3b82f6;
		font-size: 0.95rem;
		margin-bottom: 1rem;
	}

	.article-summary {
		color: #555;
		line-height: 1.6;
		margin-bottom: 1rem;
	}

	.read-more {
		color: #3b82f6;
		font-weight: 500;
	}
</style>
