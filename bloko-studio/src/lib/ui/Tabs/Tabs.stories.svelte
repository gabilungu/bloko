<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Tabs from './index.js';

	const { Story } = defineMeta({
		title: 'Layout/Tabs',
		component: Tabs,
		tags: ['autodocs'],
	});
</script>

<script>
	import Button from '../Button/Button.svelte';
	import Input from '../Input/Input.svelte';
	import FormField from '../FormField/FormField.svelte';

	// CONTROLLED MODE
	let activeTab = $state('general');

	function handleTabChange(tabId) {
		activeTab = tabId;
		console.log('Tab changed to:', tabId);
	}

	//END CONTROLLED MODE
</script>

<Story name="Default">
	{#snippet template(args)}
		<Tabs {...args}>
			<!-- Register the tabs -->
			<Tabs.Tab id="tab1" label="First Tab" />
			<Tabs.Tab id="tab2" label="Second Tab" />

			<!-- Render the tab navigation -->
			<Tabs.List />

			<!-- Render the content for each tab -->
			<Tabs.Content tabId="tab1">
				<h4>First Tab Content</h4>
				<p>This is the content of the first tab.</p>
			</Tabs.Content>

			<Tabs.Content tabId="tab2">
				<h4>Second Tab Content</h4>
				<p>This is the content of the second tab.</p>
			</Tabs.Content>
		</Tabs>
	{/snippet}
</Story>

<Story name="Controlled">
	{#snippet template(args)}
		<div>
			<p style="margin-bottom: 16px;">
				Active tab: <strong>{activeTab}</strong>
			</p>
			<div class="tabs-demo">
				<Tabs {activeTab} onTabChange={handleTabChange}>
					<!-- Register the tabs -->
					<Tabs.Tab
						id="general"
						label="General Settings"
						intent="default"
					/>
					<Tabs.Tab id="advanced" label="Advanced" intent="danger" />
					<Tabs.Tab
						id="permissions"
						label="Permissions"
						intent="success"
					/>

					<!-- Render the tab navigation -->
					<Tabs.List />

					<!-- Render the content for each tab -->
					<Tabs.Content tabId="general">
						<div class="form-content">
							<FormField label="Site Name" required>
								<Input placeholder="Enter site name" />
							</FormField>
							<FormField label="Description">
								<Input placeholder="Enter description" />
							</FormField>
							<div class="button-group">
								<Button label="Save Changes" intent="primary" />
								<Button label="Cancel" intent="secondary" />
							</div>
						</div>
					</Tabs.Content>

					<Tabs.Content tabId="advanced">
						<div class="form-content">
							<FormField label="API Key" required>
								<Input
									type="password"
									placeholder="Enter API key"
								/>
							</FormField>
							<FormField label="Webhook URL">
								<Input
									placeholder="https://example.com/webhook"
								/>
							</FormField>
							<div class="button-group">
								<Button
									label="Test Connection"
									intent="primary"
								/>
								<Button label="Reset" intent="danger" />
							</div>
						</div>
					</Tabs.Content>

					<Tabs.Content tabId="permissions">
						<div class="content">
							<h4>User Permissions</h4>
							<p>
								Configure user access levels and permissions
								here.
							</p>
							<ul>
								<li>Admin - Full access</li>
								<li>Editor - Content management</li>
								<li>Viewer - Read-only access</li>
							</ul>
						</div>
					</Tabs.Content>
				</Tabs>
			</div>
		</div>
	{/snippet}
</Story>

<Story name="Sizes">
	{#snippet template(args)}
		<div style="display: flex; flex-direction: column; gap: 24px;">
			<div>
				<h4 style="margin: 0 0 8px 0;">Size 24</h4>
				<div class="tabs-demo-small">
					<Tabs size="24">
						<!-- Register the tabs -->
						<Tabs.Tab id="tab1-24" label="Tab 1" />
						<Tabs.Tab id="tab2-24" label="Tab 2" />

						<!-- Render the tab navigation -->
						<Tabs.List />

						<!-- Render the content for each tab -->
						<Tabs.Content tabId="tab1-24">
							<p>Size 24 tab content</p>
						</Tabs.Content>

						<Tabs.Content tabId="tab2-24">
							<p>Another tab with size 24</p>
						</Tabs.Content>
					</Tabs>
				</div>
			</div>
			<div>
				<h4 style="margin: 0 0 8px 0;">Size 28</h4>
				<div class="tabs-demo-small">
					<Tabs size="28">
						<!-- Register the tabs -->
						<Tabs.Tab id="tab1-28" label="Tab 1" />
						<Tabs.Tab id="tab2-28" label="Tab 2" />

						<!-- Render the tab navigation -->
						<Tabs.List />

						<!-- Render the content for each tab -->
						<Tabs.Content tabId="tab1-28">
							<p>Size 28 tab content</p>
						</Tabs.Content>

						<Tabs.Content tabId="tab2-28">
							<p>Another tab with size 28</p>
						</Tabs.Content>
					</Tabs>
				</div>
			</div>
			<div>
				<h4 style="margin: 0 0 8px 0;">Size 32 (Default)</h4>
				<div class="tabs-demo-small">
					<Tabs size="32">
						<!-- Register the tabs -->
						<Tabs.Tab id="tab1-32" label="Tab 1" />
						<Tabs.Tab id="tab2-32" label="Tab 2" />

						<!-- Render the tab navigation -->
						<Tabs.List />

						<!-- Render the content for each tab -->
						<Tabs.Content tabId="tab1-32">
							<p>Size 32 tab content (default)</p>
						</Tabs.Content>

						<Tabs.Content tabId="tab2-32">
							<p>Another tab with size 32</p>
						</Tabs.Content>
					</Tabs>
				</div>
			</div>
			<div>
				<h4 style="margin: 0 0 8px 0;">Size 40</h4>
				<div class="tabs-demo-small">
					<Tabs size="40">
						<!-- Register the tabs -->
						<Tabs.Tab id="tab1-40" label="Tab 1" />
						<Tabs.Tab id="tab2-40" label="Tab 2" />

						<!-- Render the tab navigation -->
						<Tabs.List />

						<!-- Render the content for each tab -->
						<Tabs.Content tabId="tab1-40">
							<p>Size 40 tab content</p>
						</Tabs.Content>

						<Tabs.Content tabId="tab2-40">
							<p>Another tab with size 40</p>
						</Tabs.Content>
					</Tabs>
				</div>
			</div>
		</div>
	{/snippet}
</Story>

<Story name="Many Tabs">
	{#snippet template(args)}
		<div class="tabs-demo">
			<Tabs>
				<!-- Register the tabs -->
				<Tabs.Tab id="tab-a" label="Dashboard" />
				<Tabs.Tab id="tab-b" label="Users" />
				<Tabs.Tab id="tab-c" label="Content" />
				<Tabs.Tab id="tab-d" label="Analytics" />
				<Tabs.Tab id="tab-e" label="Settings" />
				<Tabs.Tab id="tab-f" label="Integrations" />
				<Tabs.Tab id="tab-g" label="Security" />

				<!-- Render the tab navigation -->
				<Tabs.List />

				<!-- Render the content for each tab -->
				<Tabs.Content tabId="tab-a">
					<p>Dashboard content with charts and metrics.</p>
				</Tabs.Content>

				<Tabs.Content tabId="tab-b">
					<p>User management interface.</p>
				</Tabs.Content>

				<Tabs.Content tabId="tab-c">
					<p>Content management system.</p>
				</Tabs.Content>

				<Tabs.Content tabId="tab-d">
					<p>Analytics and reporting tools.</p>
				</Tabs.Content>

				<Tabs.Content tabId="tab-e">
					<p>Application settings and configuration.</p>
				</Tabs.Content>

				<Tabs.Content tabId="tab-f">
					<p>Third-party integrations and APIs.</p>
				</Tabs.Content>

				<Tabs.Content tabId="tab-g">
					<p>Security settings and access controls.</p>
				</Tabs.Content>
			</Tabs>
		</div>
	{/snippet}
</Story>

<Story name="Intents">
	{#snippet template(args)}
		<div class="tabs-demo">
			<Tabs activeTab="success">
				<!-- Register tabs with intents -->
				<Tabs.Tab id="default" label="Default" intent="default" />
				<Tabs.Tab id="success" label="Success" intent="success" />
				<Tabs.Tab id="danger" label="Danger" intent="danger" />

				<!-- Navigation -->
				<Tabs.List />

				<!-- Panels -->
				<Tabs.Content tabId="default">
					<p>This is a default intent tab.</p>
				</Tabs.Content>
				<Tabs.Content tabId="success">
					<p>This tab uses the success intent.</p>
				</Tabs.Content>
				<Tabs.Content tabId="danger">
					<p>This tab uses the danger intent.</p>
				</Tabs.Content>
			</Tabs>
		</div>
	{/snippet}
</Story>

<style>
	.tabs-demo {
		border: 1px solid var(--base200);
		border-radius: 8px;
		height: 400px;
		overflow: hidden;
	}

	.tabs-demo-small {
		border: 1px solid var(--base200);
		border-radius: 8px;
		height: 200px;
		overflow: hidden;
	}

	.form-content {
		display: flex;
		flex-direction: column;
		gap: 16px;
		max-width: 400px;
	}

	.button-group {
		display: flex;
		gap: 8px;
		margin-top: 8px;
	}

	.content {
		max-width: 600px;
	}

	.content ul {
		margin: 16px 0;
		padding-left: 20px;
	}

	.content li {
		margin-bottom: 8px;
	}
</style>
