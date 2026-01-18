<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Notification from './Notification.svelte';

    const { Story } = defineMeta({
        title: 'UI/Notification',
        component: Notification,
        tags: ['autodocs'],
        argTypes: {
            position: {
                control: 'select',
                options: ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'],
                description: 'Position of notifications on screen'
            }
        }
    });
</script>

<script>
    import { notifications } from './Notification.svelte';
    import Button from '../Button/Button.svelte';
    
    function showSuccess() {
        notifications.success('Operation completed successfully!');
    }
    
    function showError() {
        notifications.error('An error occurred while processing your request.');
    }
    
    function showWarning() {
        notifications.warning('Please review your changes before continuing.');
    }
    
    function showInfo() {
        notifications.info('New updates are available.');
    }
    
    function showPersistent() {
        notifications.add('This notification will stay until closed', 'info', 0);
    }
    
    function showMultiple() {
        notifications.success('First notification');
        setTimeout(() => notifications.info('Second notification'), 500);
        setTimeout(() => notifications.warning('Third notification'), 1000);
        setTimeout(() => notifications.error('Fourth notification'), 1500);
    }
</script>

<Story name="Default">
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <Button onclick={showSuccess}>Show Success</Button>
        <Button onclick={showError}>Show Error</Button>
        <Button onclick={showWarning}>Show Warning</Button>
        <Button onclick={showInfo}>Show Info</Button>
        <Button onclick={showPersistent}>Show Persistent</Button>
        <Button onclick={showMultiple}>Show Multiple</Button>
    </div>
    
    <Notification position="top-right" />
</Story>

<Story name="Top Left">
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <Button onclick={showSuccess}>Show Success</Button>
        <Button onclick={showError}>Show Error</Button>
        <Button onclick={showWarning}>Show Warning</Button>
        <Button onclick={showInfo}>Show Info</Button>
    </div>
    
    <Notification position="top-left" />
</Story>

<Story name="Bottom Right">
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <Button onclick={showSuccess}>Show Success</Button>
        <Button onclick={showError}>Show Error</Button>
        <Button onclick={showWarning}>Show Warning</Button>
        <Button onclick={showInfo}>Show Info</Button>
    </div>
    
    <Notification position="bottom-right" />
</Story>

<Story name="Bottom Left">
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <Button onclick={showSuccess}>Show Success</Button>
        <Button onclick={showError}>Show Error</Button>
        <Button onclick={showWarning}>Show Warning</Button>
        <Button onclick={showInfo}>Show Info</Button>
    </div>
    
    <Notification position="bottom-left" />
</Story>

<Story name="Top Center">
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <Button onclick={showSuccess}>Show Success</Button>
        <Button onclick={showError}>Show Error</Button>
        <Button onclick={showWarning}>Show Warning</Button>
        <Button onclick={showInfo}>Show Info</Button>
    </div>
    
    <Notification position="top-center" />
</Story>

<Story name="Bottom Center">
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <Button onclick={showSuccess}>Show Success</Button>
        <Button onclick={showError}>Show Error</Button>
        <Button onclick={showWarning}>Show Warning</Button>
        <Button onclick={showInfo}>Show Info</Button>
    </div>
    
    <Notification position="bottom-center" />
</Story>