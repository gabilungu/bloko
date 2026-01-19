<script module>
    import {defineMeta} from '@storybook/addon-svelte-csf';
    import Radio from './Radio.svelte';

    const {Story} = defineMeta({
        title: 'Upcoming/Radio',
        component: Radio,
        tags: ['autodocs']
    });
</script>

<Story name="Default" args={{}}>
    {#snippet template(args)}
        <Radio {...args} />
    {/snippet}
</Story>

<Story name="Checked" args={{ checked: true }}>
    {#snippet template(args)}
        <Radio {...args} />
    {/snippet}
</Story>

<Story name="Intents">
    {#snippet template(args)}
        <div style="display: flex; gap: 16px; align-items: center;">
            <Radio intent="default" />
            <Radio intent="base" />
            <Radio intent="success" />
            <Radio intent="danger" />
        </div>
    {/snippet}
</Story>

<Story name="Intents Checked">
    {#snippet template(args)}
        <div style="display: flex; gap: 16px; align-items: center;">
            <Radio intent="default" checked={true} />
            <Radio intent="base" checked={true} />
            <Radio intent="success" checked={true} />
            <Radio intent="danger" checked={true} />
        </div>
    {/snippet}
</Story>

<Story name="Sizes">
    {#snippet template(args)}
        <div style="display: flex; gap: 16px; align-items: center;">
            <Radio size="16" />
            <Radio size="20" />
            <Radio size="24" />
        </div>
    {/snippet}
</Story>

<Story name="Sizes Checked">
    {#snippet template(args)}
        <div style="display: flex; gap: 16px; align-items: center;">
            <Radio size="16" checked={true} />
            <Radio size="20" checked={true} />
            <Radio size="24" checked={true} />
        </div>
    {/snippet}
</Story>

<Story name="Radio Group">
    {#snippet template(args)}
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <label style="display: flex; align-items: center; gap: 8px;">
                <Radio name="group1" value="option1" />
                Option 1
            </label>
            <label style="display: flex; align-items: center; gap: 8px;">
                <Radio name="group1" value="option2" checked={true} />
                Option 2
            </label>
            <label style="display: flex; align-items: center; gap: 8px;">
                <Radio name="group1" value="option3" />
                Option 3
            </label>
        </div>
    {/snippet}
</Story>

<Story name="Disabled" args={{ disabled: true }}>
    {#snippet template(args)}
        <div style="display: flex; gap: 16px; align-items: center;">
            <Radio {...args} />
            <Radio {...args} checked={true} />
        </div>
    {/snippet}
</Story>