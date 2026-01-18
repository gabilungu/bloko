export default {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
	addons: ['@storybook/addon-docs', '@storybook/addon-svelte-csf'],
	framework: { name: '@storybook/sveltekit', options: {} },
};
