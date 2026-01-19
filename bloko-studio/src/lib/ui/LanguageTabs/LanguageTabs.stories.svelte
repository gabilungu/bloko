<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import LanguageTabs from './LanguageTabs.svelte';

	const { Story } = defineMeta({
		title: 'Navigation/LanguageTabs',
		component: LanguageTabs,
		tags: ['autodocs'],
	});
</script>

<script>
	let activeLanguage = $state('en');
	let activeLanguageSuccess = $state('ro');
	let activeLanguageDanger = $state('fr');

	function handleLanguageChange(lang) {
		activeLanguage = lang;
		console.log('Language changed to:', lang);
	}
</script>

<Story name="Default">
	{#snippet template(args)}
		<div style="padding: 20px;">
			<h4 style="margin: 0 0 12px 0;">Default Intent</h4>
			<LanguageTabs
				languages={['en', 'ro', 'fr']}
				{activeLanguage}
				onclick={handleLanguageChange}
			/>
			<p style="margin-top: 16px; color: var(--base600); font-size: 14px;">
				Active: <strong>{activeLanguage}</strong>
			</p>
		</div>
	{/snippet}
</Story>

<Story name="Success Intent">
	{#snippet template(args)}
		<div style="padding: 20px;">
			<h4 style="margin: 0 0 12px 0;">Success Intent</h4>
			<LanguageTabs
				languages={['en', 'ro', 'fr']}
				activeLanguage={activeLanguageSuccess}
				intent="success"
				onclick={(lang) => (activeLanguageSuccess = lang)}
			/>
			<p style="margin-top: 16px; color: var(--base600); font-size: 14px;">
				Active: <strong>{activeLanguageSuccess}</strong>
			</p>
		</div>
	{/snippet}
</Story>

<Story name="Danger Intent">
	{#snippet template(args)}
		<div style="padding: 20px;">
			<h4 style="margin: 0 0 12px 0;">Danger Intent</h4>
			<LanguageTabs
				languages={['en', 'ro', 'fr']}
				activeLanguage={activeLanguageDanger}
				intent="danger"
				onclick={(lang) => (activeLanguageDanger = lang)}
			/>
			<p style="margin-top: 16px; color: var(--base600); font-size: 14px;">
				Active: <strong>{activeLanguageDanger}</strong>
			</p>
		</div>
	{/snippet}
</Story>

<Story name="Per-Tab Intents">
	{#snippet template(args)}
		<div style="padding: 20px;">
			<h4 style="margin: 0 0 12px 0;">Mixed Intents (per tab)</h4>
			<LanguageTabs
				languages={['en', 'ro', 'fr']}
				activeLanguage="en"
				intents={{
					en: 'success',
					ro: 'danger',
					fr: 'default'
				}}
			/>
			<p style="margin-top: 16px; color: var(--base600); font-size: 14px;">
				Each tab has its own intent: en=success, ro=danger, fr=default
			</p>
		</div>
	{/snippet}
</Story>

<Story name="Two Languages">
	{#snippet template(args)}
		<div style="padding: 20px;">
			<h4 style="margin: 0 0 12px 0;">Two Languages</h4>
			<LanguageTabs
				languages={['en', 'ro']}
				activeLanguage="en"
			/>
		</div>
	{/snippet}
</Story>

<Story name="Many Languages">
	{#snippet template(args)}
		<div style="padding: 20px;">
			<h4 style="margin: 0 0 12px 0;">Many Languages</h4>
			<LanguageTabs
				languages={['en', 'ro', 'fr', 'de', 'es', 'it']}
				activeLanguage="de"
			/>
		</div>
	{/snippet}
</Story>
