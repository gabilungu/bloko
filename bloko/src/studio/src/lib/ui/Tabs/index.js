import TabsComponent from './Tabs.svelte';
import Tab from './Tab.svelte';
import List from './List.svelte';
import Content from './Content.svelte';

// Create compound component by attaching all sub-components to Tabs
TabsComponent.Tab = Tab;
TabsComponent.List = List;
TabsComponent.Content = Content;

export default TabsComponent;