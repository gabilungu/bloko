<script>
	import { page } from '$app/stores';

	let { data } = $props();
	const lang = $derived($page.params.lang);
</script>

<h1>{lang === 'ro' ? 'Enciclopedia Dermatologică' : 'Dermatology Encyclopedia'}</h1>
<p class="subtitle">
	{lang === 'ro'
		? 'Ghidul tău complet pentru afecțiunile, tratamentele și procedurile pielii'
		: 'Your comprehensive guide to skin conditions, treatments, and procedures'}
</p>

<div class="sections">
	{#each data.sections as section}
		<section class="section-card">
			{#if section.coverImageUrl}
				<div class="section-cover">
					<img src={section.coverImageUrl} alt={section.title} />
				</div>
			{/if}
			<div class="section-content">
				<div class="section-header">
					<h2>{section.title}</h2>
					{#if section.description}
						<p class="section-desc">{section.description}</p>
					{/if}
				</div>

				{#if section.children.length > 0}
					<ul class="entry-list">
						{#each section.children as entry}
							<li>
								<a href="/{lang}/encyclopedia/{entry.slug}">
									{#if entry.coverImageUrl}
										<img class="entry-thumb" src={entry.coverImageUrl} alt="" />
									{/if}
									<div class="entry-info">
										<span class="entry-title">{entry.title}</span>
										{#if entry.subtitle}
											<span class="entry-subtitle">{entry.subtitle}</span>
										{/if}
									</div>
								</a>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="no-entries">{lang === 'ro' ? 'Nicio intrare încă' : 'No entries yet'}</p>
				{/if}
			</div>
		</section>
	{/each}
</div>

<style>
	h1 {
		color: #1a1a2e;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: #666;
		margin-bottom: 2rem;
	}

	.sections {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.section-card {
		background: white;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		display: flex;
		flex-direction: column;
	}

	.section-cover {
		width: 100%;
		height: 200px;
		overflow: hidden;
	}

	.section-cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.section-content {
		padding: 1.5rem;
	}

	.section-header h2 {
		color: #1a1a2e;
		margin-bottom: 0.5rem;
	}

	.section-desc {
		color: #666;
		font-size: 0.95rem;
		margin-bottom: 1rem;
	}

	.entry-list {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 0.75rem;
	}

	.entry-list li a {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: #f8f9fa;
		border-radius: 8px;
		text-decoration: none;
		transition: background 0.2s;
	}

	.entry-list li a:hover {
		background: #e9ecef;
	}

	.entry-thumb {
		width: 48px;
		height: 48px;
		border-radius: 6px;
		object-fit: cover;
		flex-shrink: 0;
	}

	.entry-info {
		flex: 1;
		min-width: 0;
	}

	.entry-title {
		display: block;
		color: #1a1a2e;
		font-weight: 500;
	}

	.entry-subtitle {
		display: block;
		color: #666;
		font-size: 0.85rem;
	}

	.no-entries {
		color: #888;
		font-style: italic;
	}
</style>
