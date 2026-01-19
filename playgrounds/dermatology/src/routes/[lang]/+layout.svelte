<script>
	import { page } from '$app/stores';

	let { children, data } = $props();

	const lang = $derived(data.lang);
	const currentPath = $derived($page.url.pathname.replace(`/${lang}`, ''));

	function switchLang(newLang) {
		return `/${newLang}${currentPath}`;
	}
</script>

<div class="app">
	<header>
		<div class="header-content">
			<a href="/{lang}" class="logo">DermaPedia</a>
			<nav>
				<a href="/{lang}" class:active={currentPath === '' || currentPath === '/'}>Home</a>
				<a href="/{lang}/encyclopedia" class:active={currentPath.startsWith('/encyclopedia')}>Encyclopedia</a>
				<a href="/{lang}/glossary" class:active={currentPath.startsWith('/glossary')}>Glossary</a>
				<a href="/{lang}/articles" class:active={currentPath.startsWith('/articles')}>Articles</a>
				<a href="/{lang}/about" class:active={currentPath.startsWith('/about')}>About</a>
			</nav>
			<div class="lang-switcher">
				<a href={switchLang('en')} class:active={lang === 'en'}>EN</a>
				<a href={switchLang('ro')} class:active={lang === 'ro'}>RO</a>
			</div>
		</div>
	</header>

	<main>
		{@render children()}
	</main>

	<footer>
		<p>DermaPedia - Dermatology Encyclopedia Demo</p>
		<p class="powered">Powered by <a href="https://github.com/user/bloko" target="_blank">Bloko CMS</a></p>
	</footer>
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	header {
		background: #1a1a2e;
		color: white;
		padding: 1rem 2rem;
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.header-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
	}

	.logo {
		font-size: 1.5rem;
		font-weight: 700;
		color: white;
		text-decoration: none;
	}

	nav {
		display: flex;
		gap: 0.5rem;
	}

	nav a {
		color: rgba(255, 255, 255, 0.8);
		text-decoration: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		transition: all 0.2s;
	}

	nav a:hover {
		color: white;
		background: rgba(255, 255, 255, 0.1);
	}

	nav a.active {
		color: white;
		background: rgba(255, 255, 255, 0.2);
	}

	.lang-switcher {
		display: flex;
		gap: 0.25rem;
	}

	.lang-switcher a {
		color: rgba(255, 255, 255, 0.6);
		text-decoration: none;
		padding: 0.25rem 0.5rem;
		font-size: 0.85rem;
		border-radius: 3px;
		transition: all 0.2s;
	}

	.lang-switcher a:hover,
	.lang-switcher a.active {
		color: white;
		background: rgba(255, 255, 255, 0.2);
	}

	main {
		flex: 1;
		max-width: 1200px;
		width: 100%;
		margin: 0 auto;
		padding: 2rem;
	}

	footer {
		background: #1a1a2e;
		color: rgba(255, 255, 255, 0.7);
		padding: 2rem;
		text-align: center;
		margin-top: auto;
	}

	footer p {
		margin: 0.25rem 0;
	}

	.powered {
		font-size: 0.85rem;
	}

	.powered a {
		color: #4ade80;
		text-decoration: none;
	}

	.powered a:hover {
		text-decoration: underline;
	}
</style>
