import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
  setupTestDatabase,
  teardownTestDatabase,
  cleanTables,
  getCrud,
} from './setup.js';

beforeAll(async () => {
  await setupTestDatabase();
}, 30000);

afterAll(async () => {
  await teardownTestDatabase();
}, 30000);

beforeEach(async () => {
  await cleanTables();
});

describe('collections', () => {
  it('should create a collection', async () => {
    const crud = getCrud();
    const collection = await crud.collections.create({
      code: 'test-collection',
      notes: 'Test notes',
    });

    expect(collection.id).toBeDefined();
    expect(collection.code).toBe('test-collection');
    expect(collection.notes).toBe('Test notes');
  });

  it('should find collection by id', async () => {
    const crud = getCrud();
    const created = await crud.collections.create({
      code: 'find-by-id',
      notes: null,
    });

    const found = await crud.collections.findById(created.id);
    expect(found).not.toBeNull();
    expect(found?.code).toBe('find-by-id');
  });

  it('should find collection by code', async () => {
    const crud = getCrud();
    await crud.collections.create({
      code: 'find-by-code',
      notes: null,
    });

    const found = await crud.collections.findByCode('find-by-code');
    expect(found).not.toBeNull();
    expect(found?.code).toBe('find-by-code');
  });

  it('should update a collection', async () => {
    const crud = getCrud();
    const created = await crud.collections.create({
      code: 'update-test',
      notes: 'Original',
    });

    const updated = await crud.collections.update(created.id, {
      notes: 'Updated',
    });

    expect(updated?.notes).toBe('Updated');
    expect(updated?.code).toBe('update-test');
  });

  it('should delete a collection', async () => {
    const crud = getCrud();
    const created = await crud.collections.create({
      code: 'delete-test',
      notes: null,
    });

    const deleted = await crud.collections.delete(created.id);
    expect(deleted).toBe(true);

    const found = await crud.collections.findById(created.id);
    expect(found).toBeNull();
  });

  it('should find all collections', async () => {
    const crud = getCrud();
    await crud.collections.create({ code: 'col-a', notes: null });
    await crud.collections.create({ code: 'col-b', notes: null });

    const all = await crud.collections.findAll();
    expect(all.length).toBe(2);
  });
});

describe('languages', () => {
  it('should create a language', async () => {
    const crud = getCrud();
    const language = await crud.languages.create({
      id: 'en',
      title: 'English',
      sort: 1,
    });

    expect(language.id).toBe('en');
    expect(language.title).toBe('English');
  });

  it('should find all languages ordered by sort', async () => {
    const crud = getCrud();
    await crud.languages.create({ id: 'ro', title: 'Romanian', sort: 2 });
    await crud.languages.create({ id: 'en', title: 'English', sort: 1 });

    const all = await crud.languages.findAll();
    expect(all[0]!.id).toBe('en');
    expect(all[1]!.id).toBe('ro');
  });

  it('should update a language', async () => {
    const crud = getCrud();
    await crud.languages.create({ id: 'en', title: 'English', sort: 1 });

    const updated = await crud.languages.update('en', { title: 'EN' });
    expect(updated?.title).toBe('EN');
  });

  it('should delete a language', async () => {
    const crud = getCrud();
    await crud.languages.create({ id: 'en', title: 'English', sort: 1 });

    const deleted = await crud.languages.delete('en');
    expect(deleted).toBe(true);

    const found = await crud.languages.findById('en');
    expect(found).toBeNull();
  });
});

describe('nodeTypes', () => {
  it('should create a node type', async () => {
    const crud = getCrud();
    const nodeType = await crud.nodeTypes.create({
      code: 'page',
      title: { en: 'Page', ro: 'Pagina' },
      sort: 1,
      notes: null,
    });

    expect(nodeType.id).toBeDefined();
    expect(nodeType.code).toBe('page');
    expect(nodeType.title).toEqual({ en: 'Page', ro: 'Pagina' });
  });

  it('should find node type by code', async () => {
    const crud = getCrud();
    await crud.nodeTypes.create({
      code: 'article',
      title: null,
      sort: null,
      notes: null,
    });

    const found = await crud.nodeTypes.findByCode('article');
    expect(found).not.toBeNull();
    expect(found?.code).toBe('article');
  });
});

describe('templates', () => {
  it('should create a template', async () => {
    const crud = getCrud();
    const collection = await crud.collections.create({ code: 'col', notes: null });

    const template = await crud.templates.create({
      code: 'blog-post',
      _collection: collection.id,
      title: { en: 'Blog Post' },
      sort: 1,
      notes: null,
    });

    expect(template.id).toBeDefined();
    expect(template.code).toBe('blog-post');
    expect(template._collection).toBe(collection.id);
  });

  it('should find templates by collection', async () => {
    const crud = getCrud();
    const col = await crud.collections.create({ code: 'col', notes: null });
    await crud.templates.create({
      code: 'tpl-1',
      _collection: col.id,
      title: null,
      sort: 1,
      notes: null,
    });
    await crud.templates.create({
      code: 'tpl-2',
      _collection: col.id,
      title: null,
      sort: 2,
      notes: null,
    });

    const templates = await crud.templates.findByCollection(col.id);
    expect(templates.length).toBe(2);
  });
});

describe('blocks', () => {
  it('should create a block', async () => {
    const crud = getCrud();
    const col = await crud.collections.create({ code: 'col', notes: null });
    const tpl = await crud.templates.create({
      code: 'tpl',
      _collection: col.id,
      title: null,
      sort: null,
      notes: null,
    });

    const block = await crud.blocks.create({
      code: 'title',
      _template: tpl.id,
      _parent: null,
      title: { en: 'Title' },
      content_type: 'text',
      sort: 1,
      notes: null,
    });

    expect(block.id).toBeDefined();
    expect(block.code).toBe('title');
    expect(block.content_type).toBe('text');
  });

  it('should create nested blocks', async () => {
    const crud = getCrud();
    const col = await crud.collections.create({ code: 'col', notes: null });
    const tpl = await crud.templates.create({
      code: 'tpl',
      _collection: col.id,
      title: null,
      sort: null,
      notes: null,
    });

    const parent = await crud.blocks.create({
      code: 'parent',
      _template: tpl.id,
      _parent: null,
      title: null,
      content_type: null,
      sort: 1,
      notes: null,
    });

    const child = await crud.blocks.create({
      code: 'child',
      _template: tpl.id,
      _parent: parent.id,
      title: null,
      content_type: 'text',
      sort: 1,
      notes: null,
    });

    expect(child._parent).toBe(parent.id);
  });
});

describe('nodes', () => {
  it('should create a node with auto-generated slug', async () => {
    const crud = getCrud();
    const col = await crud.collections.create({ code: 'col', notes: null });
    const nodeType = await crud.nodeTypes.create({
      code: 'page',
      title: null,
      sort: null,
      notes: null,
    });
    const tpl = await crud.templates.create({
      code: 'tpl',
      _collection: col.id,
      title: null,
      sort: null,
      notes: null,
    });

    const node = await crud.nodes.create({
      code: 'my-page',
      _collection: col.id,
      _template: tpl.id,
      _node_type: nodeType.id,
      _parent: null,
      title: { en: 'My Page', ro: 'Pagina Mea' },
      subtitle: null,
        slug: null,
      sort: null,
      sort_children_by: null,
      _cover_image: null,
      _images: null,
      notes: null,
    });

    expect(node.id).toBeDefined();
    expect(node.code).toBe('my-page');
    expect(node.slug).toEqual({ en: 'my-page', ro: 'pagina-mea' });
  });

  it('should find nodes by collection', async () => {
    const crud = getCrud();
    const col = await crud.collections.create({ code: 'col', notes: null });
    const nodeType = await crud.nodeTypes.create({
      code: 'page',
      title: null,
      sort: null,
      notes: null,
    });

    await crud.nodes.create({
      code: 'node-1',
      _collection: col.id,
      _template: null,
      _node_type: nodeType.id,
      _parent: null,
      title: { en: 'Node 1' },
      subtitle: null,
        slug: null,
      sort: null,
      sort_children_by: null,
      _cover_image: null,
      _images: null,
      notes: null,
    });

    const nodes = await crud.nodes.findByCollection(col.id);
    expect(nodes.length).toBe(1);
  });

  it('should find child nodes', async () => {
    const crud = getCrud();
    const col = await crud.collections.create({ code: 'col', notes: null });
    const nodeType = await crud.nodeTypes.create({
      code: 'page',
      title: null,
      sort: null,
      notes: null,
    });

    const parent = await crud.nodes.create({
      code: 'parent',
      _collection: col.id,
      _template: null,
      _node_type: nodeType.id,
      _parent: null,
      title: { en: 'Parent' },
      subtitle: null,
        slug: null,
      sort: null,
      sort_children_by: null,
      _cover_image: null,
      _images: null,
      notes: null,
    });

    await crud.nodes.create({
      code: 'child',
      _collection: col.id,
      _template: null,
      _node_type: nodeType.id,
      _parent: parent.id,
      title: { en: 'Child' },
      subtitle: null,
        slug: null,
      sort: null,
      sort_children_by: null,
      _cover_image: null,
      _images: null,
      notes: null,
    });

    const children = await crud.nodes.findChildren(parent.id);
    expect(children.length).toBe(1);
    expect(children[0]!.code).toBe('child');
  });
});

describe('contents', () => {
  it('should create content', async () => {
    const crud = getCrud();
    const col = await crud.collections.create({ code: 'col', notes: null });
    const nodeType = await crud.nodeTypes.create({
      code: 'page',
      title: null,
      sort: null,
      notes: null,
    });
    const tpl = await crud.templates.create({
      code: 'tpl',
      _collection: col.id,
      title: null,
      sort: null,
      notes: null,
    });
    const block = await crud.blocks.create({
      code: 'body',
      _template: tpl.id,
      _parent: null,
      title: null,
      content_type: 'text',
      sort: 1,
      notes: null,
    });
    const node = await crud.nodes.create({
      code: 'page',
      _collection: col.id,
      _template: tpl.id,
      _node_type: nodeType.id,
      _parent: null,
      title: { en: 'Page' },
      subtitle: null,
        slug: null,
      sort: null,
      sort_children_by: null,
      _cover_image: null,
      _images: null,
      notes: null,
    });

    const content = await crud.contents.create({
      _node: node.id,
      _block: block.id,
      value: { en: 'Hello', ro: 'Salut' },
    });

    expect(content.id).toBeDefined();
    expect(content.value).toEqual({ en: 'Hello', ro: 'Salut' });
  });

  it('should find contents by node', async () => {
    const crud = getCrud();
    const col = await crud.collections.create({ code: 'col', notes: null });
    const nodeType = await crud.nodeTypes.create({
      code: 'page',
      title: null,
      sort: null,
      notes: null,
    });
    const tpl = await crud.templates.create({
      code: 'tpl',
      _collection: col.id,
      title: null,
      sort: null,
      notes: null,
    });
    const block = await crud.blocks.create({
      code: 'body',
      _template: tpl.id,
      _parent: null,
      title: null,
      content_type: 'text',
      sort: 1,
      notes: null,
    });
    const node = await crud.nodes.create({
      code: 'page',
      _collection: col.id,
      _template: tpl.id,
      _node_type: nodeType.id,
      _parent: null,
      title: { en: 'Page' },
      subtitle: null,
        slug: null,
      sort: null,
      sort_children_by: null,
      _cover_image: null,
      _images: null,
      notes: null,
    });

    await crud.contents.create({
      _node: node.id,
      _block: block.id,
      value: { en: 'Content 1' },
    });

    const contents = await crud.contents.findByNode(node.id);
    expect(contents.length).toBe(1);
  });
});

describe('images and variants', () => {
  it('should create an image', async () => {
    const crud = getCrud();
    const col = await crud.collections.create({ code: 'col', notes: null });

    const image = await crud.images.create({
      _collection: col.id,
      s3_key: 'images/col/test.jpg',
      file_name: 'test.jpg',
      mime_type: 'image/jpeg',
      format: 'jpeg',
      file_size: 1024,
      width: 800,
      height: 600,
      caption: { en: 'Test image' },
      credit: null,
    });

    expect(image.id).toBeDefined();
    expect(image.s3_key).toBe('images/col/test.jpg');
  });

  it('should create an image variant', async () => {
    const crud = getCrud();
    const col = await crud.collections.create({ code: 'col', notes: null });
    const image = await crud.images.create({
      _collection: col.id,
      s3_key: 'images/col/test.jpg',
      file_name: 'test.jpg',
      mime_type: 'image/jpeg',
      format: 'jpeg',
      file_size: 1024,
      width: 800,
      height: 600,
      caption: null,
      credit: null,
    });

    const variant = await crud.imageVariants.create({
      _image: image.id,
      width: 150,
      height: 150,
      s3_key: 'images/col/test-150x150.webp',
      format: 'webp',
      file_size: 512,
    });

    expect(variant.id).toBeDefined();
    expect(variant._image).toBe(image.id);
  });

  it('should find variants by image', async () => {
    const crud = getCrud();
    const col = await crud.collections.create({ code: 'col', notes: null });
    const image = await crud.images.create({
      _collection: col.id,
      s3_key: 'images/col/test.jpg',
      file_name: 'test.jpg',
      mime_type: 'image/jpeg',
      format: 'jpeg',
      file_size: 1024,
      width: 800,
      height: 600,
      caption: null,
      credit: null,
    });

    await crud.imageVariants.create({
      _image: image.id,
      width: 150,
      height: 150,
      s3_key: 'images/col/test-150x150.webp',
      format: 'webp',
      file_size: 512,
    });

    await crud.imageVariants.create({
      _image: image.id,
      width: 640,
      height: 480,
      s3_key: 'images/col/test-640x480.webp',
      format: 'webp',
      file_size: 2048,
    });

    const variants = await crud.imageVariants.findByImage(image.id);
    expect(variants.length).toBe(2);
  });
});

describe('node relations', () => {
  it('should create a node relation type', async () => {
    const crud = getCrud();
    const col = await crud.collections.create({ code: 'col', notes: null });

    const relType = await crud.nodeRelationTypes.create({
      code: 'related',
      _collection: col.id,
      title: { en: 'Related to' },
      reverse_title: { en: 'Related from' },
      notes: null,
    });

    expect(relType.id).toBeDefined();
    expect(relType.code).toBe('related');
  });

  it('should create a node relation', async () => {
    const crud = getCrud();
    const col = await crud.collections.create({ code: 'col', notes: null });
    const nodeType = await crud.nodeTypes.create({
      code: 'page',
      title: null,
      sort: null,
      notes: null,
    });

    const node1 = await crud.nodes.create({
      code: 'node-1',
      _collection: col.id,
      _template: null,
      _node_type: nodeType.id,
      _parent: null,
      title: { en: 'Node 1' },
      subtitle: null,
        slug: null,
      sort: null,
      sort_children_by: null,
      _cover_image: null,
      _images: null,
      notes: null,
    });

    const node2 = await crud.nodes.create({
      code: 'node-2',
      _collection: col.id,
      _template: null,
      _node_type: nodeType.id,
      _parent: null,
      title: { en: 'Node 2' },
      subtitle: null,
        slug: null,
      sort: null,
      sort_children_by: null,
      _cover_image: null,
      _images: null,
      notes: null,
    });

    const relType = await crud.nodeRelationTypes.create({
      code: 'related',
      _collection: col.id,
      title: null,
      reverse_title: null,
      notes: null,
    });

    const relation = await crud.nodeRelations.create({
      _from: node1.id,
      _to: node2.id,
      _node_relation_type: relType.id,
    });

    expect(relation.id).toBeDefined();
    expect(relation._from).toBe(node1.id);
    expect(relation._to).toBe(node2.id);
  });

  it('should find relations from a node', async () => {
    const crud = getCrud();
    const col = await crud.collections.create({ code: 'col', notes: null });
    const nodeType = await crud.nodeTypes.create({
      code: 'page',
      title: null,
      sort: null,
      notes: null,
    });

    const node1 = await crud.nodes.create({
      code: 'node-1',
      _collection: col.id,
      _template: null,
      _node_type: nodeType.id,
      _parent: null,
      title: { en: 'Node 1' },
      subtitle: null,
        slug: null,
      sort: null,
      sort_children_by: null,
      _cover_image: null,
      _images: null,
      notes: null,
    });

    const node2 = await crud.nodes.create({
      code: 'node-2',
      _collection: col.id,
      _template: null,
      _node_type: nodeType.id,
      _parent: null,
      title: { en: 'Node 2' },
      subtitle: null,
        slug: null,
      sort: null,
      sort_children_by: null,
      _cover_image: null,
      _images: null,
      notes: null,
    });

    const relType = await crud.nodeRelationTypes.create({
      code: 'related',
      _collection: col.id,
      title: null,
      reverse_title: null,
      notes: null,
    });

    await crud.nodeRelations.create({
      _from: node1.id,
      _to: node2.id,
      _node_relation_type: relType.id,
    });

    const relations = await crud.nodeRelations.findByFrom(node1.id);
    expect(relations.length).toBe(1);
    expect(relations[0]!._to).toBe(node2.id);
  });
});
