# Blocks

## Methods

```typescript
bloko.crud.blocks.findAll(): Promise<Block[]>
bloko.crud.blocks.findById(id: string): Promise<Block | null>
bloko.crud.blocks.findByTemplate(templateId: string): Promise<Block[]>
bloko.crud.blocks.findByCode(templateId: string, code: string): Promise<Block | null>
bloko.crud.blocks.findChildren(parentId: string): Promise<Block[]>
bloko.crud.blocks.create(data: BlockInsert): Promise<Block>
bloko.crud.blocks.update(id: string, data: BlockUpdate): Promise<Block | null>
bloko.crud.blocks.delete(id: string): Promise<boolean>
```

## Types

```typescript
interface Block {
  id: string;
  code: string;
  _template: string;
  _parent: string | null;
  title: MultiLang | null;
  content_type: ContentType | null;
  sort: number | null;
  notes: string | null;
}

type ContentType = 'number' | 'text' | 'text_list' | 'titled_text_list' | 'image' | 'image_list';

type BlockInsert = Omit<Block, 'id'>;
type BlockUpdate = Partial<BlockInsert>;
```

## Examples

```typescript
// Create a block
const block = await bloko.crud.blocks.create({
  _template: template.id,
  _parent: null,
  code: 'body',
  title: { en: 'Body' },
  content_type: 'text',
  sort: 1,
  notes: null,
});

// Create a nested block
const nestedBlock = await bloko.crud.blocks.create({
  _template: template.id,
  _parent: block.id,
  code: 'summary',
  title: { en: 'Summary' },
  content_type: 'text',
  sort: 1,
  notes: null,
});

// Find blocks in a template
const blocks = await bloko.crud.blocks.findByTemplate(template.id);

// Find children
const children = await bloko.crud.blocks.findChildren(block.id);
```
