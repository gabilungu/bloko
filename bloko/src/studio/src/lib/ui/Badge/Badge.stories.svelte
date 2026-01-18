<script module>
    import {defineMeta} from '@storybook/addon-svelte-csf';
    import {Badge} from '$lib/ui';

    const {Story} = defineMeta({
        title: 'Components/Badge',
        component: Badge,
        tags: ['autodocs']
    });
</script>

<Story name="Default" args="{{ text: 'Badge' }}"/>


<Story name="Status Colors" args="{{ text: 'Success' }}">
    {#snippet template(args)}
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
            <Badge text="Success" background="var(--success500)" foreground="var(--base0)"/>
            <Badge text="Warning" background="var(--warning500)" foreground="var(--base0)"/>
            <Badge text="Danger" background="var(--danger500)" foreground="var(--base0)"/>
            <Badge text="Info" background="var(--info500)" foreground="var(--base0)"/>
            <Badge text="Action" background="var(--action500)" foreground="var(--base0)"/>
        </div>
    {/snippet}
</Story>

<Story name="Sizes" args="{{ text: 'Size' }}">
    {#snippet template(args)}
        <Badge text="16" background="var(--info500)" foreground="var(--base0)" size={16}/>
        <Badge text="20" background="var(--info500)" foreground="var(--base0)" size={20}/>
        <Badge text="24" background="var(--info500)" foreground="var(--base0)" size={24}/>
        <Badge text="28" background="var(--info500)" foreground="var(--base0)" size={28}/>
    {/snippet}
</Story>