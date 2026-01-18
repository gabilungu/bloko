# Node Relation Types

## Methods

```typescript
bloko.crud.nodeRelationTypes.findAll(): Promise<NodeRelationType[]>
bloko.crud.nodeRelationTypes.findById(id: string): Promise<NodeRelationType | null>
bloko.crud.nodeRelationTypes.findByCollection(collectionId: string): Promise<NodeRelationType[]>
bloko.crud.nodeRelationTypes.findByCode(collectionId: string, code: string): Promise<NodeRelationType | null>
bloko.crud.nodeRelationTypes.create(data: NodeRelationTypeInsert): Promise<NodeRelationType>
bloko.crud.nodeRelationTypes.update(id: string, data: NodeRelationTypeUpdate): Promise<NodeRelationType | null>
bloko.crud.nodeRelationTypes.delete(id: string): Promise<boolean>
```

## Types

```typescript
interface NodeRelationType {
  id: string;
  code: string;
  _collection: string;
  title: MultiLang | null;
  reverse_title: MultiLang | null;
  notes: string | null;
}

type NodeRelationTypeInsert = Omit<NodeRelationType, 'id'>;
type NodeRelationTypeUpdate = Partial<NodeRelationTypeInsert>;
```

## Examples

```typescript
// Create a relation type
const relationType = await bloko.crud.nodeRelationTypes.create({
  _collection: collection.id,
  code: 'related',
  title: { en: 'Related To' },
  reverse_title: { en: 'Related From' },
  notes: null,
});

// Create a "see also" relation type
const seeAlso = await bloko.crud.nodeRelationTypes.create({
  _collection: collection.id,
  code: 'see-also',
  title: { en: 'See Also' },
  reverse_title: { en: 'Referenced By' },
  notes: null,
});

// Find relation types in a collection
const types = await bloko.crud.nodeRelationTypes.findByCollection(collection.id);
```
