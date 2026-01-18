import { createBloko } from '../../driver/index.js';
import { getConfig } from '../config.js';
import type { Preset, CollectionData, TemplateData, BlockData, NodeData } from '../seeds/types.js';

// Dynamic preset imports
const seeds: Record<string, () => Promise<Preset>> = {
  dermatology: async () => (await import('../seeds/dermatology.js')).default,
  glossaries: async () => (await import('../seeds/glossaries.js')).default,
};

export async function seed(presetName: string) {
  const loadPreset = seeds[presetName];
  if (!loadPreset) {
    const available = Object.keys(seeds).join(', ');
    throw new Error(`Unknown preset: ${presetName}. Available: ${available}`);
  }

  const preset = await loadPreset();
  const config = getConfig();
  const bloko = createBloko({ db: config });

  console.log(`Seeding with preset: ${preset.name}`);
  console.log(`Description: ${preset.description}`);

  try {
    // Create languages
    console.log('Creating languages...');
    for (const lang of preset.languages) {
      await bloko.crud.languages.create(lang);
    }

    // Create node types
    console.log('Creating node types...');
    const nodeTypeMap: Record<string, string> = {};
    for (const nt of preset.nodeTypes) {
      const created = await bloko.crud.nodeTypes.create(nt);
      nodeTypeMap[nt.code] = created.id;
    }

    // Create collections with templates and nodes
    for (const collectionData of preset.collections) {
      await seedCollection(bloko, collectionData, nodeTypeMap);
    }

    console.log('Seeding completed successfully.');
  } finally {
    await bloko.disconnect();
  }
}

async function seedCollection(
  bloko: ReturnType<typeof createBloko>,
  data: CollectionData,
  nodeTypeMap: Record<string, string>
) {
  console.log(`Creating collection: ${data.collection.code}`);
  const collection = await bloko.crud.collections.create(data.collection);

  // Create templates and blocks
  const templateMap: Record<string, string> = {};
  const blockMap: Record<string, Record<string, string>> = {};

  for (const templateData of data.templates) {
    const { template, blocks } = await seedTemplate(bloko, collection.id, templateData);
    templateMap[templateData.template.code] = template.id;
    blockMap[templateData.template.code] = blocks;
  }

  // Create nodes and build node code map
  const nodeCodeMap: Record<string, string> = {};
  for (const nodeData of data.nodes) {
    await seedNode(bloko, collection.id, templateMap, blockMap, nodeTypeMap, nodeData, null, nodeCodeMap);
  }

  // Create relation types
  const relationTypeMap: Record<string, string> = {};
  if (data.relationTypes) {
    console.log('  Creating relation types...');
    for (const rt of data.relationTypes) {
      const created = await bloko.crud.nodeRelationTypes.create({
        _collection: collection.id,
        code: rt.code,
        title: rt.title,
        reverse_title: rt.reverse_title,
        notes: rt.notes || null,
      });
      relationTypeMap[rt.code] = created.id;
      console.log(`    Created relation type: ${rt.code}`);
    }
  }

  // Create relations
  if (data.relations) {
    console.log('  Creating relations...');
    for (const rel of data.relations) {
      const relationTypeId = relationTypeMap[rel.relationTypeCode];
      const fromNodeId = nodeCodeMap[rel.fromNodeCode];
      const toNodeId = nodeCodeMap[rel.toNodeCode];

      if (!relationTypeId) {
        throw new Error(`Relation type not found: ${rel.relationTypeCode}`);
      }
      if (!fromNodeId) {
        throw new Error(`From node not found: ${rel.fromNodeCode}`);
      }
      if (!toNodeId) {
        throw new Error(`To node not found: ${rel.toNodeCode}`);
      }

      await bloko.crud.nodeRelations.create({
        _node_relation_type: relationTypeId,
        _from: fromNodeId,
        _to: toNodeId,
      });
      console.log(`    Created relation: ${rel.fromNodeCode} --[${rel.relationTypeCode}]--> ${rel.toNodeCode}`);
    }
  }
}

async function seedTemplate(
  bloko: ReturnType<typeof createBloko>,
  collectionId: string,
  data: TemplateData
): Promise<{ template: { id: string }; blocks: Record<string, string> }> {
  console.log(`  Creating template: ${data.template.code}`);
  const template = await bloko.crud.templates.create({
    code: data.template.code,
    title: data.template.title ?? null,
    sort: data.template.sort ?? null,
    notes: data.template.notes ?? null,
    _collection: collectionId,
  });

  const blockMap: Record<string, string> = {};

  async function createBlocks(blocks: BlockData[], parentId: string | null) {
    for (const blockData of blocks) {
      const block = await bloko.crud.blocks.create({
        code: blockData.block.code,
        title: blockData.block.title ?? null,
        content_type: blockData.block.content_type ?? null,
        sort: blockData.block.sort ?? null,
        notes: blockData.block.notes ?? null,
        _template: template.id,
        _parent: parentId,
      });
      blockMap[blockData.block.code] = block.id;

      if (blockData.children) {
        await createBlocks(blockData.children, block.id);
      }
    }
  }

  await createBlocks(data.blocks, null);

  return { template, blocks: blockMap };
}

async function seedNode(
  bloko: ReturnType<typeof createBloko>,
  collectionId: string,
  templateMap: Record<string, string>,
  blockMap: Record<string, Record<string, string>>,
  nodeTypeMap: Record<string, string>,
  data: NodeData,
  parentId: string | null,
  nodeCodeMap: Record<string, string>
) {
  const { templateCode, nodeTypeCode, ...nodeFields } = data.node;
  const templateId = templateMap[templateCode];
  const nodeTypeId = nodeTypeMap[nodeTypeCode];

  if (!templateId) {
    throw new Error(`Template not found: ${templateCode}`);
  }
  if (!nodeTypeId) {
    throw new Error(`Node type not found: ${nodeTypeCode}`);
  }

  console.log(`    Creating node: ${data.node.code}`);
  const node = await bloko.crud.nodes.create({
    code: nodeFields.code,
    title: nodeFields.title ?? null,
    subtitle: nodeFields.subtitle ?? null,
    slug: nodeFields.slug ?? null,
    sort: nodeFields.sort ?? null,
    sort_children_by: nodeFields.sort_children_by ?? null,
    _cover_image: nodeFields._cover_image ?? null,
    _images: nodeFields._images ?? null,
    notes: nodeFields.notes ?? null,
    _collection: collectionId,
    _template: templateId,
    _node_type: nodeTypeId,
    _parent: parentId,
  });

  // Track node code to id mapping for relations
  nodeCodeMap[data.node.code] = node.id;

  // Create contents
  if (data.contents) {
    const blocks = blockMap[templateCode];
    if (!blocks) {
      throw new Error(`Block map not found for template: ${templateCode}`);
    }

    for (const content of data.contents) {
      const blockId = blocks[content.blockCode];
      if (!blockId) {
        throw new Error(`Block not found: ${content.blockCode}`);
      }

      await bloko.crud.contents.create({
        _node: node.id,
        _block: blockId,
        value: content.value,
      });
    }
  }

  // Create child nodes
  if (data.children) {
    for (const childData of data.children) {
      await seedNode(bloko, collectionId, templateMap, blockMap, nodeTypeMap, childData, node.id, nodeCodeMap);
    }
  }
}
