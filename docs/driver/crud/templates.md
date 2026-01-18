# Templates

## Methods

```typescript
bloko.crud.templates.findAll(): Promise<Template[]>
bloko.crud.templates.findById(id: string): Promise<Template | null>
bloko.crud.templates.findByCollection(collectionId: string): Promise<Template[]>
bloko.crud.templates.findByCode(collectionId: string, code: string): Promise<Template | null>
bloko.crud.templates.create(data: TemplateInsert): Promise<Template>
bloko.crud.templates.update(id: string, data: TemplateUpdate): Promise<Template | null>
bloko.crud.templates.delete(id: string): Promise<boolean>
```

## Types

```typescript
interface Template {
  id: string;
  code: string;
  _collection: string;
  title: MultiLang | null;
  sort: number | null;
  notes: string | null;
}

type TemplateInsert = Omit<Template, 'id'>;
type TemplateUpdate = Partial<TemplateInsert>;
```

## Examples

```typescript
// Create a template
const template = await bloko.crud.templates.create({
  _collection: collection.id,
  code: 'article',
  title: { en: 'Article Template' },
  sort: 1,
  notes: null,
});

// Find templates in a collection
const templates = await bloko.crud.templates.findByCollection(collection.id);

// Find by code
const articleTemplate = await bloko.crud.templates.findByCode(
  collection.id,
  'article'
);
```
