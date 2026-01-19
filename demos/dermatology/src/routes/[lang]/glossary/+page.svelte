<script>
	import { page } from '$app/stores';

	let { data } = $props();
	const lang = $derived($page.params.lang);
</script>

<h1>{lang === 'ro' ? 'Glosar Dermatologic' : 'Dermatology Glossary'}</h1>
<p class="subtitle">
	{lang === 'ro'
		? 'Definiții ale termenilor medicali comuni din dermatologie'
		: 'Definitions of common medical terms in dermatology'}
</p>

{#if data.terms.length === 0}
	<p class="empty">{lang === 'ro' ? 'Niciun termen încă' : 'No terms yet'}</p>
{:else}
	<div class="alphabet-nav">
		{#each Object.keys(data.grouped).sort() as letter}
			<a href="#{letter}">{letter}</a>
		{/each}
	</div>

	<div class="glossary">
		{#each Object.entries(data.grouped).sort(([a], [b]) => a.localeCompare(b)) as [letter, terms]}
			<section id={letter}>
				<h2 class="letter-header">{letter}</h2>
				<div class="terms">
					{#each terms as term}
						<div class="term-card">
							<h3>{term.title}</h3>
							{#if term.subtitle}
								<p class="term-subtitle">{term.subtitle}</p>
							{/if}
							{#if term.definition}
								<p class="definition">{term.definition}</p>
							{/if}
						</div>
					{/each}
				</div>
			</section>
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

	.alphabet-nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 2rem;
		padding: 1rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.alphabet-nav a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		background: #f8f9fa;
		border-radius: 4px;
		text-decoration: none;
		color: #1a1a2e;
		font-weight: 600;
		transition: all 0.2s;
	}

	.alphabet-nav a:hover {
		background: #1a1a2e;
		color: white;
	}

	.glossary {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	section {
		scroll-margin-top: 100px;
	}

	.letter-header {
		font-size: 1.5rem;
		color: #1a1a2e;
		padding-bottom: 0.5rem;
		border-bottom: 3px solid #4ade80;
		margin-bottom: 1rem;
	}

	.terms {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.term-card {
		background: white;
		padding: 1.5rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.term-card h3 {
		color: #1a1a2e;
		margin-bottom: 0.25rem;
	}

	.term-subtitle {
		color: #3b82f6;
		font-size: 0.9rem;
		font-style: italic;
		margin-bottom: 0.75rem;
	}

	.definition {
		color: #555;
		line-height: 1.6;
	}
</style>
