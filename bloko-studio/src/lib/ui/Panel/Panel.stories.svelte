<script module>
    import {defineMeta} from '@storybook/addon-svelte-csf';
    import Panel from './Panel.svelte';
    import Button from '../Button/Button.svelte';

    const {Story} = defineMeta({
        title: 'Layout/Panel',
        component: Panel,
        tags: ['autodocs']
    });
</script>

<script>
    // Sample long content for scrolling demo
    const longContent = Array.from({length: 50}, (_, i) =>
        `This is line ${i + 1} of content. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`
    );
</script>

<Story name="Default"
       globals={{ backgrounds: { value: "base50" }}}
       args={{ title: 'Panel Title', subtitle: 'This is a subtitle for the panel' }}>

    <div style="background-color: var(--accent100); height: 200px;"></div>
</Story>

<Story name="Nested Levels"
       globals={{ backgrounds: { value: "base50" }}}>
    {#snippet template(args)}
        <Panel title="Level 0 - Main Panel" subtitle="This is the top level panel" level="0">
            <Panel title="Level 1 - Nested Panel" subtitle="First level of nesting" level="1">
                <Panel title="Level 2 - Deeply Nested" subtitle="Second level" level="2">
                    <Panel title="Level 3 - Very Deep" subtitle="Third level" level="3">
                        <div style="background-color: var(--accent100); height: 200px;"></div>
                    </Panel>
                </Panel>
            </Panel>
        </Panel>
    {/snippet}
</Story>

<Story name="With Header Actions">
    {#snippet template(args)}
        <div style="height: 400px;">
            <Panel title="Users" subtitle="Manage system users">
                {#snippet topRightSlot()}
                    <Button label="Add User" intent="primary" size="28"/>
                    <Button label="Export" intent="secondary" size="28"/>
                {/snippet}
                <p>User management content goes here...</p>
            </Panel>
        </div>
    {/snippet}
</Story>

<Story name="With Footer">
    {#snippet template(args)}
        <Panel {...args}>
            {#snippet bottomLeftSlot()}
                <span style="font-size: 12px; color: var(--base600);">* Required fields</span>
            {/snippet}
            {#snippet bottomRightSlot()}
                <Button label="Cancel" intent="secondary"/>
                <Button label="Save" intent="primary"/>
            {/snippet}
            <p>Form content would go here...</p>
        </Panel>
    {/snippet}
</Story>

<Story name="Full Featured">
    {#snippet template(args)}
        <Panel title="Dashboard" subtitle="Overview of your data" level="2">
            {#snippet topRightSlot()}
                <Button label="Refresh" intent="secondary" size="28"/>
                <Button label="Settings" intent="secondary" size="28"/>
            {/snippet}
            {#snippet bottomLeftSlot()}
                <span style="font-size: 12px; color: var(--base600);">Last updated: 2 mins ago</span>
            {/snippet}
            {#snippet bottomSlot()}
                <span style="font-size: 12px; color: var(--base600);">Page 1 of 10</span>
            {/snippet}
            {#snippet bottomRightSlot()}
                <Button label="Previous" intent="secondary" size="28"/>
                <Button label="Next" intent="primary" size="28"/>
            {/snippet}
            <div style="padding: 20px; background: var(--base50); border-radius: 4px;">
                <h3>Dashboard Content</h3>
                <p>This is where your dashboard widgets would appear.</p>
            </div>
        </Panel>
    {/snippet}
</Story>

<Story name="Scrollable Content">
    {#snippet template(args)}
        <div style="height: 400px;">
            <Panel title="Long Content" subtitle="This panel has scrollable content" scrollable={true}>
                {#snippet topRightSlot()}
                    <Button label="Scroll to Top" intent="secondary" size="28"/>
                {/snippet}
                {#snippet bottomRightSlot()}
                    <Button label="Load More" intent="primary"/>
                {/snippet}
                {#each longContent as line}
                    <p>{line}</p>
                {/each}
            </Panel>
        </div>
    {/snippet}
</Story>

<Story name="Minimal">
    {#snippet template(args)}
        <div style="height: 300px;">
            <Panel>
                <h3>Minimal Panel</h3>
                <p>This panel has no header or footer, just content.</p>
                <p>It's useful when you just need a simple container.</p>
            </Panel>
        </div>
    {/snippet}
</Story>

<Story name="Header Only">
    {#snippet template(args)}
        <div style="height: 300px;">
            <Panel title="Header Only Panel">
                <p>This panel has a header but no footer.</p>
                <p>Good for simple content sections.</p>
            </Panel>
        </div>
    {/snippet}
</Story>

<Story name="Footer Only">
    {#snippet template(args)}
        <div style="height: 300px;">
            <Panel>
                {#snippet bottomRightSlot()}
                    <Button label="Action 1" intent="secondary"/>
                    <Button label="Action 2" intent="primary"/>
                {/snippet}
                <p>This panel has a footer but no header.</p>
                <p>Useful when you need actions at the bottom.</p>
            </Panel>
        </div>
    {/snippet}
</Story>