<script module>
    import {defineMeta} from '@storybook/addon-svelte-csf';
    import Textarea from './Textarea.svelte';

    const {Story} = defineMeta({
        title: 'Upcoming/Textarea',
        component: Textarea,
        tags: ['autodocs']
    });
</script>

<Story name="Default" args={{}}>
    {#snippet template(args)}
        <Textarea {...args} />
    {/snippet}
</Story>

<Story name="With Placeholder" args={{ placeholder: 'Enter your message...' }}>
    {#snippet template(args)}
        <Textarea {...args} />
    {/snippet}
</Story>

<Story name="With Value" args={{ value: 'This is some initial text in the textarea.' }}>
    {#snippet template(args)}
        <Textarea {...args} />
    {/snippet}
</Story>

<Story name="Row Sizes">
    {#snippet template(args)}
        <div style="display: flex; flex-direction: column; gap: 16px;">
            <Textarea placeholder="3 rows" rows={3} />
            <Textarea placeholder="5 rows" rows={5} />
            <Textarea placeholder="8 rows" rows={8} />
        </div>
    {/snippet}
</Story>

<Story name="No Resize" args={{ resize: false, placeholder: 'This textarea cannot be resized' }}>
    {#snippet template(args)}
        <Textarea {...args} />
    {/snippet}
</Story>

<Story name="Disabled" args={{ disabled: true, placeholder: 'Disabled textarea' }}>
    {#snippet template(args)}
        <Textarea {...args} />
    {/snippet}
</Story>

<Story name="Required" args={{ required: true, placeholder: 'Required textarea' }}>
    {#snippet template(args)}
        <Textarea {...args} />
    {/snippet}
</Story>