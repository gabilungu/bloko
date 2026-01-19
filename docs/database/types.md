# Types

## Enums

### content_type

Data types for block content values.

```sql
CREATE TYPE content_type AS ENUM (
  'number',
  'text',
  'text_list',
  'titled_text_list',
  'image',
  'image_list'
);
```

| Value | Description | Example |
|-------|-------------|---------|
| `number` | Float or integer (not language-keyed) | `42` or `3.14` |
| `text` | Multi-language string | `{"en": "Hello", "ro": "Salut"}` |
| `text_list` | Multi-language array of strings | `{"en": ["Item 1", "Item 2"], "ro": [...]}` |
| `titled_text_list` | Multi-language array with title/text | `{"en": [{"title": "...", "text": "..."}], ...}` |
| `image` | Single image UUID (not language-keyed) | `"550e8400-e29b-41d4-a716-446655440000"` |
| `image_list` | Array of image UUIDs (not language-keyed) | `["uuid1", "uuid2", "uuid3"]` |

**Note:** `null` content_type means the block is a container only (no content allowed).

**Language-keyed vs plain values:**
- `number`, `image`, `image_list` are stored as plain values (same across all languages)
- `text`, `text_list`, `titled_text_list` are language-keyed (different value per language)

### sort_children_by

Sorting options for child nodes.

```sql
CREATE TYPE sort_children_by AS ENUM ('sort', 'title', 'subtitle');
```

| Value | Description |
|-------|-------------|
| `sort` | Sort by `sort` field (manual ordering) |
| `title` | Sort alphabetically by `title` |
| `subtitle` | Sort alphabetically by `subtitle` |

## Custom Types

### Multi-language String (JSONB)

Stores translations as JSONB with language codes as keys.

```sql
-- Column definition
title JSONB
```

**Structure:** `{"en": "value", "ro": "value", ...}`

**Rules:**
- Can be `null`, empty `{}`, or partial
- Keys must exist in the `languages` table
- Empty strings are auto-removed: `{"en": "", "ro": "Text"}` → `{"ro": "Text"}`

**Cascade behavior:**
- Language delete → key removed from all JSONB fields
- Language rename → key renamed in all JSONB fields

### Images Array (JSONB)

Stores an ordered list of image UUIDs.

```sql
-- Column definition (on nodes table)
_images JSONB
```

**Structure:** `["uuid1", "uuid2", "uuid3"]`

**Rules:**
- Can be `null` or empty `[]`
- Each value must be a valid UUID referencing `images.id`
- Array order determines display order
