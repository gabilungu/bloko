import type { Crud } from '../crud/index.js';
import { createNodesApi, type NodesApi } from './nodes.js';
import { createCollectionsApi, type CollectionsApi } from './collections.js';

export interface Api {
  nodes: NodesApi;
  collections: CollectionsApi;
}

export function createApi(crud: Crud): Api {
  return {
    nodes: createNodesApi(crud),
    collections: createCollectionsApi(crud),
  };
}

// Re-export types
export type { NodesApi, NodeWithContents, ContentItem, TreeNode, FindByPathResult } from './nodes.js';
export type { CollectionsApi, CollectionWithNavigation, NavNode } from './collections.js';
