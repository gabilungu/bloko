<script module>
    import {defineMeta} from '@storybook/addon-svelte-csf';
    import Dropdown from './Dropdown.svelte';

    const {Story} = defineMeta({
        title: 'Upcoming/Dropdown',
        component: Dropdown,
        tags: ['autodocs']
    });

    const sampleOptions = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
    ];
</script>

<Story name="Default" args={{ options: sampleOptions }}>
    {#snippet template(args)}
        <Dropdown {...args} />
    {/snippet}
</Story>

<Story name="With Value" args={{ options: sampleOptions, value: 'option2' }}>
    {#snippet template(args)}
        <Dropdown {...args} />
    {/snippet}
</Story>

<Story name="Custom Placeholder" args={{ options: sampleOptions, placeholder: 'Choose an option...' }}>
    {#snippet template(args)}
        <Dropdown {...args} />
    {/snippet}
</Story>

<Story name="Intents">
    {#snippet template(args)}
        <div style="display: flex; flex-direction: column; gap: 16px;">
            <Dropdown options={sampleOptions} placeholder="Default intent" intent="default" />
            <Dropdown options={sampleOptions} placeholder="Success intent" intent="success" />
            <Dropdown options={sampleOptions} placeholder="Danger intent" intent="danger" />
        </div>
    {/snippet}
</Story>

<Story name="Sizes">
    {#snippet template(args)}
        <div style="display: flex; flex-direction: column; gap: 16px; align-items: start;">
            <Dropdown options={sampleOptions} placeholder="Size 24" size="24" />
            <Dropdown options={sampleOptions} placeholder="Size 28" size="28" />
            <Dropdown options={sampleOptions} placeholder="Size 32" size="32" />
            <Dropdown options={sampleOptions} placeholder="Size 40" size="40" />
        </div>
    {/snippet}
</Story>

<Story name="Disabled" args={{ options: sampleOptions, disabled: true }}>
    {#snippet template(args)}
        <Dropdown {...args} />
    {/snippet}
</Story>