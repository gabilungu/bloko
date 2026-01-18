import type { DB } from '../db.js';
import { collections } from './collections.js';
import { languages } from './languages.js';
import { nodeTypes } from './node-types.js';
import { templates } from './templates.js';
import { blocks } from './blocks.js';
import { nodes } from './nodes.js';
import { contents } from './contents.js';
import { images } from './images.js';
import { imageVariants } from './image-variants.js';
import { nodeRelationTypes } from './node-relation-types.js';
import { nodeRelations } from './node-relations.js';

export function createCrud(db: DB) {
  return {
    collections: collections(db),
    languages: languages(db),
    nodeTypes: nodeTypes(db),
    templates: templates(db),
    blocks: blocks(db),
    nodes: nodes(db),
    contents: contents(db),
    images: images(db),
    imageVariants: imageVariants(db),
    nodeRelationTypes: nodeRelationTypes(db),
    nodeRelations: nodeRelations(db),
  };
}

export type Crud = ReturnType<typeof createCrud>;
