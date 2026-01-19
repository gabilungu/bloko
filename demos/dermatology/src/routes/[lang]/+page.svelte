<script>
	import { page } from '$app/stores';

	let { data } = $props();
	const lang = $derived($page.params.lang);
</script>

{#if data.hero}
	<section class="hero">
		<h1>{data.hero.headline}</h1>
		<p class="hero-sub">{data.hero.subheadline}</p>
		<a href={data.hero.ctaLink} class="cta-button">
			{lang === 'ro' ? 'Explorează Enciclopedia' : 'Explore Encyclopedia'}
		</a>
	</section>
{/if}

<section class="section">
	<h2>{lang === 'ro' ? 'Afecțiuni Prezentate' : 'Featured Conditions'}</h2>
	<div class="card-grid">
		{#each data.featuredConditions as condition}
			<a href="/{lang}/encyclopedia/{condition.slug}" class="card">
				<h3>{condition.title}</h3>
				{#if condition.subtitle}
					<p class="card-subtitle">{condition.subtitle}</p>
				{/if}
				{#if condition.overview}
					<p class="card-excerpt">{condition.overview.slice(0, 150)}...</p>
				{/if}
			</a>
		{/each}
	</div>
	<a href="/{lang}/encyclopedia" class="view-all">
		{lang === 'ro' ? 'Vezi toate afecțiunile →' : 'View all conditions →'}
	</a>
</section>

<section class="section">
	<h2>{lang === 'ro' ? 'Articole Recente' : 'Recent Articles'}</h2>
	<div class="card-grid">
		{#each data.recentArticles as article}
			<a href="/{lang}/articles/{article.slug}" class="card">
				<h3>{article.title}</h3>
				{#if article.subtitle}
					<p class="card-subtitle">{article.subtitle}</p>
				{/if}
				{#if article.summary}
					<p class="card-excerpt">{article.summary.slice(0, 150)}...</p>
				{/if}
			</a>
		{/each}
	</div>
	<a href="/{lang}/articles" class="view-all">
		{lang === 'ro' ? 'Vezi toate articolele →' : 'View all articles →'}
	</a>
</section>

<style>
	.hero {
		text-align: center;
		padding: 4rem 2rem;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
		color: white;
		border-radius: 16px;
		margin-bottom: 3rem;
	}

	.hero h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.hero-sub {
		font-size: 1.2rem;
		opacity: 0.9;
		margin-bottom: 2rem;
	}

	.cta-button {
		display: inline-block;
		padding: 0.75rem 2rem;
		background: #4ade80;
		color: #1a1a2e;
		text-decoration: none;
		border-radius: 8px;
		font-weight: 600;
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.cta-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3);
	}

	.section {
		margin-bottom: 3rem;
	}

	.section h2 {
		font-size: 1.5rem;
		margin-bottom: 1.5rem;
		color: #1a1a2e;
	}

	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
		margin-bottom: 1rem;
	}

	.card {
		background: white;
		padding: 1.5rem;
		border-radius: 12px;
		text-decoration: none;
		color: inherit;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
	}

	.card h3 {
		color: #1a1a2e;
		margin-bottom: 0.5rem;
	}

	.card-subtitle {
		color: #3b82f6;
		font-size: 0.9rem;
		margin-bottom: 0.75rem;
	}

	.card-excerpt {
		color: #666;
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.view-all {
		display: inline-block;
		color: #3b82f6;
		text-decoration: none;
		font-weight: 500;
	}

	.view-all:hover {
		text-decoration: underline;
	}
</style>
