# Contents

## Methods

```typescript
bloko.crud.contents.findAll(): Promise<Content[]>
bloko.crud.contents.findById(id: string): Promise<Content | null>
bloko.crud.contents.findByNode(nodeId: string): Promise<Content[]>
bloko.crud.contents.findByBlock(blockId: string): Promise<Content[]>
bloko.crud.contents.findByNodeAndBlock(nodeId: string, blockId: string): Promise<Content | null>
bloko.crud.contents.create(data: ContentInsert): Promise<Content>
bloko.crud.contents.upsert(data: ContentInsert): Promise<Content>
bloko.crud.contents.update(id: string, data: ContentUpdate): Promise<Content | null>
bloko.crud.contents.delete(id: string): Promise<boolean>
bloko.crud.contents.deleteByNode(nodeId: string): Promise<number>
```

## Types

```typescript
interface Content {
  id: string;
  _node: string;
  _block: string;
  value: unknown;
}

type ContentInsert = Omit<Content, 'id'>;
type ContentUpdate = Partial<ContentInsert>;
```

## Examples

```typescript
// Create content
const content = await bloko.crud.contents.create({
  _node: node.id,
  _block: block.id,
  value: { en: 'Hello', ro: 'Salut' },
});

// Upsert - create or update
await bloko.crud.contents.upsert({
  _node: node.id,
  _block: block.id,
  value: { en: 'Updated content' },
});

// Find all contents for a node
const nodeContents = await bloko.crud.contents.findByNode(node.id);

// Find specific content
const bodyContent = await bloko.crud.contents.findByNodeAndBlock(
  node.id,
  bodyBlock.id
);

// Delete all contents for a node
await bloko.crud.contents.deleteByNode(node.id);
```

## Content Values

Content values are stored as JSONB and can be any structure:

```typescript
// Multi-language text
{ en: 'Hello', ro: 'Salut' }

// Multi-language list
{ en: ['Item 1', 'Item 2'], ro: ['Element 1', 'Element 2'] }

// Number
42

// Titled text list
{
  en: [
    { title: 'Section 1', text: 'Content...' },
    { title: 'Section 2', text: 'More content...' }
  ]
}
```
