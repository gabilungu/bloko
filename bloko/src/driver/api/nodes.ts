import type { Crud } from '../crud/index.js';
import type { Node, Block } from '../types.js';

export interface NodeWithContents {
  id: string;
  code: string;
  title: Record<string, string>;
  subtitle: Record<string, string>;
  slug: Record<string, string>;
  contents: ContentItem[];
}

export interface ContentItem {
  id: string;
  blockCode: string;
  blockTitle: Record<string, string>;
  contentType: string;
  sort: number;
  value: Record<string, unknown>;
}

export interface TreeNode {
  id: string;
  code: string;
  title: Record<string, string>;
  slug: Record<string, string>;
  childrenCount: number;
  children: TreeNode[];
}

export interface FindByPathResult {
  node: NodeWithContents;
  breadcrumb: Array<{ id: string; code: string; title: Record<string, string>; slug: Record<string, string> }>;
}

export function createNodesApi(crud: Crud) {
  /**
   * Build content items with block info for a node
   */
  async function buildContents(nodeId: string): Promise<ContentItem[]> {
    const contents = await crud.contents.findByNode(nodeId);
    if (contents.length === 0) return [];

    // Get unique block IDs and fetch blocks
    const blockIds = [...new Set(contents.map(c => c._block))];
    const blocks = await Promise.all(
      blockIds.map(id => crud.blocks.findById(id))
    );
    const blocksMap = new Map(
      blocks.filter((b): b is Block => b !== null).map(b => [b.id, b])
    );

    // Build content items
    const items = contents.map(c => {
      const block = blocksMap.get(c._block);
      return {
        id: c.id,
        blockCode: block?.code || 'unknown',
        blockTitle: block?.title || {},
        contentType: block?.content_type || 'text',
        sort: block?.sort || 0,
        value: c.value as Record<string, unknown>,
      };
    });

    // Sort by block sort order
    return items.sort((a, b) => a.sort - b.sort);
  }

  /**
   * Convert a node to NodeWithContents format
   */
  async function toNodeWithContents(node: Node): Promise<NodeWithContents> {
    return {
      id: node.id,
      code: node.code,
      title: node.title || {},
      subtitle: node.subtitle || {},
      slug: node.slug || {},
      contents: await buildContents(node.id),
    };
  }

  return {
    /**
     * Find a node by walking a slug path
     * Returns the node with contents and breadcrumb trail
     */
    async findByPath(
      lang: string,
      slugPath: string[]
    ): Promise<FindByPathResult | null> {
      const breadcrumb: FindByPathResult['breadcrumb'] = [];
      let parentId: string | null = null;
      let node: Node | null = null;

      for (const slug of slugPath) {
        node = await crud.nodes.findBySlug(lang, slug, parentId);
        if (!node) return null;

        breadcrumb.push({
          id: node.id,
          code: node.code,
          title: node.title || {},
          slug: node.slug || {},
        });
        parentId = node.id;
      }

      if (!node) return null;

      return {
        node: await toNodeWithContents(node),
        breadcrumb,
      };
    },

    /**
     * Get a node by ID with its contents
     */
    async findById(id: string): Promise<NodeWithContents | null> {
      const node = await crud.nodes.findById(id);
      if (!node) return null;
      return toNodeWithContents(node);
    },

    /**
     * Get a node tree for a collection
     */
    async getTree(
      collectionId: string,
      options?: { depth?: number; lang?: string }
    ): Promise<TreeNode[]> {
      const maxDepth = options?.depth ?? 10;

      async function buildTree(parentId: string | null, currentDepth: number): Promise<TreeNode[]> {
        if (currentDepth >= maxDepth) return [];

        const nodes = parentId
          ? await crud.nodes.findChildren(parentId)
          : await crud.nodes.findRoots(collectionId);

        return Promise.all(
          nodes.map(async (node) => {
            const children = await buildTree(node.id, currentDepth + 1);
            return {
              id: node.id,
              code: node.code,
              title: node.title || {},
              slug: node.slug || {},
              childrenCount: children.length,
              children,
            };
          })
        );
      }

      return buildTree(null, 0);
    },

    /**
     * Get children of a node with their contents
     */
    async findChildren(parentId: string): Promise<NodeWithContents[]> {
      const children = await crud.nodes.findChildren(parentId);
      return Promise.all(children.map(toNodeWithContents));
    },

    /**
     * Get root nodes of a collection with their contents
     */
    async findRoots(collectionId: string): Promise<NodeWithContents[]> {
      const roots = await crud.nodes.findRoots(collectionId);
      return Promise.all(roots.map(toNodeWithContents));
    },

    /**
     * Get the root ancestor of a node (top-level node in hierarchy).
     * Returns the node with its contents, or null if not found.
     */
    async getRootAncestor(nodeId: string): Promise<NodeWithContents | null> {
      const rootId = await crud.nodes.findRootAncestor(nodeId);
      if (!rootId) return null;
      const node = await crud.nodes.findById(rootId);
      if (!node) return null;
      return toNodeWithContents(node);
    },
  };
}

export type NodesApi = ReturnType<typeof createNodesApi>;
