<script module>
    import {defineMeta} from '@storybook/addon-svelte-csf';
    import Modal from './Modal.svelte';
    import Button from '../Button/Button.svelte';

    const {Story} = defineMeta({
        title: 'UI/Modal',
        component: Modal,
        tags: ['autodocs'],
        parameters: {
            layout: 'centered'
        },
        // argTypes: {
        //     open: {
        //         control: 'boolean',
        //         description: 'Whether the modal is open'
        //     },
        //     title: {
        //         control: 'text',
        //         description: 'Title displayed in the modal header'
        //     },
        //     width: {
        //         control: 'text',
        //         description: 'Width of the modal',
        //         defaultValue: '600px'
        //     },
        //     onClose: {
        //         action: 'closed',
        //         description: 'Callback when modal is closed'
        //     }
        // }
    });
</script>

<script>
    let basicOpen = $state(false);
    let longContentOpen = $state(false);
    let customWidthOpen = $state(false);
    let noFooterOpen = $state(false);
</script>

<Story name="Default" args={{ open: true, title: 'Default Modal', width: '600px' }}>
    <p>This is the default modal content.</p>
    <p>It demonstrates the basic modal structure with default props.</p>
</Story>

<Story name="Basic Example with footer">
    {#snippet template(args)}
        <Button label="Open modal" onclick={() => basicOpen = true}></Button>

        <Modal bind:open={basicOpen} title="Basic Modal">
            {#snippet children()}
                <p>This is a basic modal with some content.</p>
                <p>You can close it by clicking the X button, pressing Escape, or clicking outside.</p>
            {/snippet}

            {#snippet footer()}
                <div style="display: flex; gap: 8px; justify-content: flex-end;">
                    <Button variant="ghost" onclick={() => basicOpen = false}>Cancel</Button>
                    <Button variant="primary" onclick={() => basicOpen = false}>Save Changes</Button>
                </div>
            {/snippet}
        </Modal>
    {/snippet}
</Story>