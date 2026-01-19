<script>
	import { page } from '$app/stores';

	let { data } = $props();
	const lang = $derived($page.params.lang);
</script>

<article class="about-page">
	{#if data.about}
		<header>
			<h1>{data.about.title}</h1>
			{#if data.about.subtitle}
				<p class="subtitle">{data.about.subtitle}</p>
			{/if}
		</header>

		{#if data.about.content}
			<div class="content">
				{#if Array.isArray(data.about.content)}
					{#each data.about.content as paragraph}
						<p>{paragraph}</p>
					{/each}
				{:else}
					<p>{data.about.content}</p>
				{/if}
			</div>
		{/if}
	{:else}
		<h1>{lang === 'ro' ? 'Despre' : 'About'}</h1>
		<p class="empty">{lang === 'ro' ? 'Conținut indisponibil' : 'Content unavailable'}</p>
	{/if}
</article>

<style>
	.about-page {
		background: white;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		max-width: 800px;
	}

	header {
		padding-bottom: 1.5rem;
		border-bottom: 1px solid #eee;
		margin-bottom: 2rem;
	}

	h1 {
		color: #1a1a2e;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: #3b82f6;
		font-size: 1.1rem;
	}

	.content p {
		color: #444;
		line-height: 1.8;
		margin-bottom: 1.5rem;
	}

	.content p:last-child {
		margin-bottom: 0;
	}

	.empty {
		color: #888;
		text-align: center;
		padding: 2rem;
	}
</style>
