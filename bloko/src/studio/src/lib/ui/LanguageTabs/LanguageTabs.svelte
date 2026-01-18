<script>
	/**
	 * @typedef {Object} LanguageTabsProps
	 * @property {string[]} languages - Array of language codes (e.g., ['en', 'ro', 'fr'])
	 * @property {string} activeLanguage - Currently active language code
	 * @property {(lang: string) => void} [onclick] - Callback when language is clicked
	 * @property {Object.<string, 'default' | 'success' | 'danger'>} [intents] - Map of language codes to intents (e.g., { 'en': 'default', 'ro': 'success' })
	 */

	/** @type {LanguageTabsProps} */
	let { languages, activeLanguage, onclick, intents = {} } = $props();

	function getIntent(lang) {
		return intents[lang] || 'default';
	}
</script>

<div class="languageTabs">
	{#each languages as lang}
		{@const intent = getIntent(lang)}
		<button
			type="button"
			class="lang"
			class:active={activeLanguage === lang}
			class:intent-default={intent === 'default'}
			class:intent-success={intent === 'success'}
			class:intent-danger={intent === 'danger'}
			onclick={() => onclick?.(lang)}
		>
			<span class="dot"></span>
			{lang}
		</button>
	{/each}
</div>

<style>
	.languageTabs {
		display: flex;
		gap: 4px;
		position: sticky;
		top: 0;
		z-index: 10;
		background: var(--base0);
		padding: 8px 0;
		margin: -8px 0 0 0;
	}

	.lang {
		height: 28px;
		padding: 0 10px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 12px;
		font-weight: 500;
		transition: all 0.15s;
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: currentColor;
	}

	/* Default variant */
	.lang.intent-default {
		background: var(--base200);
		color: var(--base800);
	}

	.lang.intent-default:hover {
		opacity: 0.8;
	}

	.lang.intent-default.active {
		background: var(--base1000);
		color: var(--base0);
	}

	/* Success variant */
	.lang.intent-success {
		background: var(--success100);
		color: var(--success700);
	}

	.lang.intent-success:hover {
		opacity: 0.8;
	}

	.lang.intent-success.active {
		background: var(--success500);
		color: var(--base0);
	}

	/* Danger variant */
	.lang.intent-danger {
		background: var(--danger100);
		color: var(--danger700);
	}

	.lang.intent-danger:hover {
		opacity: 0.8;
	}

	.lang.intent-danger.active {
		background: var(--danger500);
		color: var(--base0);
	}
</style>
