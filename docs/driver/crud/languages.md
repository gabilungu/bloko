# Languages

## Methods

```typescript
bloko.crud.languages.findAll(): Promise<Language[]>
bloko.crud.languages.findById(id: string): Promise<Language | null>
bloko.crud.languages.create(data: LanguageInsert): Promise<Language>
bloko.crud.languages.update(id: string, data: LanguageUpdate): Promise<Language | null>
bloko.crud.languages.delete(id: string): Promise<boolean>
```

## Types

```typescript
interface Language {
  id: string;      // User-provided (e.g., 'en', 'ro')
  title: string;
  sort: number | null;
}

type LanguageInsert = Language;  // id is user-provided
type LanguageUpdate = Partial<Omit<Language, 'id'>>;
```

**Note:** Language `id` is user-provided (e.g., `'en'`, `'ro'`), not auto-generated.

## Examples

```typescript
// Create languages
await bloko.crud.languages.create({
  id: 'en',
  title: 'English',
  sort: 1,
});

await bloko.crud.languages.create({
  id: 'ro',
  title: 'Romanian',
  sort: 2,
});

// Get all languages
const languages = await bloko.crud.languages.findAll();

// Find by ID
const english = await bloko.crud.languages.findById('en');
```
