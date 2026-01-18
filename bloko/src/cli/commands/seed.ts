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

  // Create nodes
  for (const nodeData of data.nodes) {
    await seedNode(bloko, collection.id, templateMap, blockMap, nodeTypeMap, nodeData, null);
  }
}

async function seedTemplate(
  bloko: ReturnType<typeof createBloko>,
  collectionId: string,
  data: TemplateData
): Promise<{ template: { id: string }; blocks: Record<string, string> }> {
  console.log(`  Creating template: ${data.template.code}`);
  const template = await bloko.crud.templates.create({
    ...data.template,
    _collection: collectionId,
  });

  const blockMap: Record<string, string> = {};

  async function createBlocks(blocks: BlockData[], parentId: string | null) {
    for (const blockData of blocks) {
      const block = await bloko.crud.blocks.create({
        ...blockData.block,
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
  parentId: string | null
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
    ...nodeFields,
    _collection: collectionId,
    _template: templateId,
    _node_type: nodeTypeId,
    _parent: parentId,
  });

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
      await seedNode(bloko, collectionId, templateMap, blockMap, nodeTypeMap, childData, node.id);
    }
  }
}
