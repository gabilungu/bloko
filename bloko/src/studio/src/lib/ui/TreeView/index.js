import TreeViewComponent from './TreeView.svelte';
import TreeViewItem from './TreeViewItem.svelte';

// Create compound component by attaching sub-components to TreeView
TreeViewComponent.Item = TreeViewItem;

export default TreeViewComponent;