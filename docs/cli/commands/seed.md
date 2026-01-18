# seed

Seeds the database with sample data from a preset.

```bash
npx bloko seed <preset>
```

## Available Seeds

| Seed | Description |
|------|-------------|
| [dermatology](../seeds/dermatology) | Medical dermatology glossary |
| [glossaries](../seeds/glossaries) | Multi-language glossary template |

## What it does

1. Creates languages
2. Creates node types
3. Creates collections with templates and blocks
4. Creates nodes with content

## Example

```bash
# Initialize and seed
npx bloko init
npx bloko seed glossaries
```

Output:
```
Seeding database with "glossaries" preset...
Created 3 languages
Created 3 node types
Created 1 collection with 3 templates
Created 4 nodes with content
Seeding complete.
```

## Reset and Reseed

```bash
npx bloko reinit
npx bloko seed dermatology
```
