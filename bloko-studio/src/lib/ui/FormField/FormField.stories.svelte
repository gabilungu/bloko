<script module>
    import {defineMeta} from '@storybook/addon-svelte-csf';
    import FormField from './FormField.svelte';
    import Input from '../Input/Input.svelte';

    const {Story} = defineMeta({
        title: 'Upcoming/FormField',
        component: FormField,
        tags: ['autodocs']
    });
</script>

<Story name="Required" args={{ label: "Email", required: true, helperText: "This field is required" }}>
    {#snippet template(args)}
        <FormField {...args}>
            <Input type="text" placeholder="Enter email..."/>
        </FormField>
    {/snippet}
</Story>

<Story name="Intents">
    {#snippet template(args)}
        <div style="display: flex; flex-direction: column; gap: 16px;">
            <FormField label="Default" helperText="This is default helper text" intent="default">
                <Input placeholder="Default..."/>
            </FormField>
            <FormField label="Info" helperText="This is info helper text" intent="info">
                <Input placeholder="Info..."/>
            </FormField>
            <FormField label="Success" helperText="This is success helper text" intent="success">
                <Input placeholder="Success..."/>
            </FormField>
            <FormField label="Warning" helperText="This is warning helper text" intent="warning">
                <Input placeholder="Warning..."/>
            </FormField>
            <FormField label="Danger" helperText="This is danger helper text" intent="danger">
                <Input placeholder="Danger..."/>
            </FormField>
        </div>
    {/snippet}
</Story>

<Story name="Label Sizes">
    {#snippet template(args)}
        <div style="display: flex; flex-direction: column; gap: 16px;">
            <FormField label="Small Label" labelFontSize="14" helperText="Size 14 label">
                <Input placeholder="Small label..."/>
            </FormField>
            <FormField label="Medium Label" labelFontSize="16" helperText="Size 16 label">
                <Input placeholder="Medium label..."/>
            </FormField>
            <FormField label="Large Label" labelFontSize="18" helperText="Size 18 label">
                <Input placeholder="Large label..."/>
            </FormField>
        </div>
    {/snippet}
</Story>

<Story name="Helper Text Sizes">
    {#snippet template(args)}
        <div style="display: flex; flex-direction: column; gap: 16px;">
            <FormField label="Small Helper" helperText="This is size 12 helper text" helperFontSize="12">
                <Input placeholder="Small helper..."/>
            </FormField>
            <FormField label="Large Helper" helperText="This is size 14 helper text" helperFontSize="14">
                <Input placeholder="Large helper..."/>
            </FormField>
        </div>
    {/snippet}
</Story>