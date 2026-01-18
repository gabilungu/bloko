<script module>
    import {defineMeta} from '@storybook/addon-svelte-csf';
    import Button from './Button.svelte';

    const {Story} = defineMeta({
        title: 'Action/Button',
        component: Button,
        tags: ['autodocs']
    });
</script>

<Story name="Default" args={{ label: 'Submit', intent: 'primary' }}/>

<Story name="Intents">
    {#snippet template(args)}
        <div style="display: flex; gap: 12px;">
            <Button label="Primary" intent="primary"/>
            <Button label="Secondary" intent="secondary"/>
            <Button label="Danger" intent="danger"/>
        </div>
    {/snippet}
</Story>

<Story name="Sizes">
    {#snippet template(args)}
        <div style="display: flex; gap: 12px; align-items: center;">
            <Button label="Size 24" size="24"/>
            <Button label="Size 28" size="28"/>
            <Button label="Size 32" size="32"/>
            <Button label="Size 40" size="40"/>
        </div>
    {/snippet}
</Story>

<Story name="Disabled">
    {#snippet template(args)}
        <div style="display: flex; gap: 12px;">
            <Button label="Primary" intent="primary" disabled={true}/>
            <Button label="Secondary" intent="secondary" disabled={true}/>
            <Button label="Danger" intent="danger" disabled={true}/>
        </div>
    {/snippet}
</Story>