<script module>
    import {defineMeta} from '@storybook/addon-svelte-csf';
    import Checkbox from './Checkbox.svelte';

    const {Story} = defineMeta({
        title: 'Upcoming/Checkbox',
        component: Checkbox,
        tags: ['autodocs']
    });
</script>

<Story name="Default" args={{}}>
    {#snippet template(args)}
        <Checkbox {...args} />
    {/snippet}
</Story>

<Story name="Checked" args={{ checked: true }}>
    {#snippet template(args)}
        <Checkbox {...args} />
    {/snippet}
</Story>

<Story name="Intents">
    {#snippet template(args)}
        <div style="display: flex; gap: 16px; align-items: center;">
            <Checkbox intent="default" />
            <Checkbox intent="base" />
            <Checkbox intent="success" />
            <Checkbox intent="danger" />
        </div>
    {/snippet}
</Story>

<Story name="Intents Checked">
    {#snippet template(args)}
        <div style="display: flex; gap: 16px; align-items: center;">
            <Checkbox intent="default" checked={true} />
            <Checkbox intent="base" checked={true} />
            <Checkbox intent="success" checked={true} />
            <Checkbox intent="danger" checked={true} />
        </div>
    {/snippet}
</Story>

<Story name="Sizes">
    {#snippet template(args)}
        <div style="display: flex; gap: 16px; align-items: center;">
            <Checkbox size="16" />
            <Checkbox size="20" />
            <Checkbox size="24" />
        </div>
    {/snippet}
</Story>

<Story name="Sizes Checked">
    {#snippet template(args)}
        <div style="display: flex; gap: 16px; align-items: center;">
            <Checkbox size="16" checked={true} />
            <Checkbox size="20" checked={true} />
            <Checkbox size="24" checked={true} />
        </div>
    {/snippet}
</Story>

<Story name="Disabled" args={{ disabled: true }}>
    {#snippet template(args)}
        <div style="display: flex; gap: 16px; align-items: center;">
            <Checkbox {...args} />
            <Checkbox {...args} checked={true} />
        </div>
    {/snippet}
</Story>