import '../src/lib/ui/css/style.css';

/** @type { import('@storybook/sveltekit').Preview } */
const preview = {
    parameters: {
        backgrounds: {
            options: {
                // 👇 Default options
                base0: {name: 'Base 0', value: 'var(--base0)'},
                base50: {name: 'Base 50', value: 'var(--base50)'},
                base100: {name: 'Base 100', value: 'var(--base100)'},
                base900: {name: 'Base 900', value: 'var(--base900)'},
            },
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        options: {
            storySort: {
                order: ['Action', 'Form', 'Layout', 'Upcoming'],
            },
        },
    }, initialGlobals: {
        backgrounds: {value: 'base0'},
    },
};

export default preview;