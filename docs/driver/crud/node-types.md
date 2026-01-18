# Node Types

## Methods

```typescript
bloko.crud.nodeTypes.findAll(): Promise<NodeType[]>
bloko.crud.nodeTypes.findById(id: string): Promise<NodeType | null>
bloko.crud.nodeTypes.findByCode(code: string): Promise<NodeType | null>
bloko.crud.nodeTypes.create(data: NodeTypeInsert): Promise<NodeType>
bloko.crud.nodeTypes.update(id: string, data: NodeTypeUpdate): Promise<NodeType | null>
bloko.crud.nodeTypes.delete(id: string): Promise<boolean>
```

## Types

```typescript
interface NodeType {
  id: string;
  code: string;
  title: MultiLang | null;
  sort: number | null;
  notes: string | null;
}

type NodeTypeInsert = Omit<NodeType, 'id'>;
type NodeTypeUpdate = Partial<NodeTypeInsert>;
```

## Examples

```typescript
// Create a node type
const articleType = await bloko.crud.nodeTypes.create({
  code: 'article',
  title: { en: 'Article', ro: 'Articol' },
  sort: 1,
  notes: null,
});

// Find by code
const article = await bloko.crud.nodeTypes.findByCode('article');
```
