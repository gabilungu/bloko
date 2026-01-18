import type { Crud } from '../crud/index.js';

export interface NavNode {
  id: string;
  code: string;
  title: string;
  slug: string;
  children: NavNode[];
}

export interface CollectionWithNavigation {
  id: string;
  code: string;
  notes: string | null;
  nodes: NavNode[];
}

export function createCollectionsApi(crud: Crud) {
  return {
    /**
     * Find a collection by code
     */
    async findByCode(code: string) {
      const collection = await crud.collections.findByCode(code);
      if (!collection) return null;
      return {
        id: collection.id,
        code: collection.code,
        notes: collection.notes,
      };
    },

    /**
     * Get all collections with basic info
     */
    async findAll(): Promise<Array<{ id: string; code: string; notes: string | null }>> {
      const collections = await crud.collections.findAll();
      return collections.map(c => ({
        id: c.id,
        code: c.code,
        notes: c.notes,
      }));
    },

    /**
     * Get a collection with navigation tree for a specific language
     * Useful for building sidebar navigation
     */
    async getWithNavigation(code: string, lang: string): Promise<CollectionWithNavigation | null> {
      const collection = await crud.collections.findByCode(code);
      if (!collection) return null;

      async function buildNavTree(parentId: string | null): Promise<NavNode[]> {
        const nodes = parentId
          ? await crud.nodes.findChildren(parentId)
          : await crud.nodes.findRoots(collection!.id);

        return Promise.all(
          nodes.map(async (node) => ({
            id: node.id,
            code: node.code,
            title: (node.title as Record<string, string>)?.[lang] || node.code,
            slug: (node.slug as Record<string, string>)?.[lang] || node.code,
            children: await buildNavTree(node.id),
          }))
        );
      }

      return {
        id: collection.id,
        code: collection.code,
        notes: collection.notes,
        nodes: await buildNavTree(null),
      };
    },
  };
}

export type CollectionsApi = ReturnType<typeof createCollectionsApi>;
