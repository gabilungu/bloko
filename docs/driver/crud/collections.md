# Collections

## Methods

```typescript
bloko.crud.collections.findAll(): Promise<Collection[]>
bloko.crud.collections.findById(id: string): Promise<Collection | null>
bloko.crud.collections.findByCode(code: string): Promise<Collection | null>
bloko.crud.collections.create(data: CollectionInsert): Promise<Collection>
bloko.crud.collections.update(id: string, data: CollectionUpdate): Promise<Collection | null>
bloko.crud.collections.delete(id: string): Promise<boolean>
```

## Types

```typescript
interface Collection {
  id: string;
  code: string;
  notes: string | null;
}

type CollectionInsert = Omit<Collection, 'id'>;
type CollectionUpdate = Partial<CollectionInsert>;
```

## Examples

```typescript
// Create a collection
const collection = await bloko.crud.collections.create({
  code: 'blog',
  notes: 'Blog articles',
});

// Find by code
const blog = await bloko.crud.collections.findByCode('blog');

// Update
await bloko.crud.collections.update(collection.id, {
  notes: 'Updated notes',
});

// Delete
await bloko.crud.collections.delete(collection.id);
```
