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
| `number` | Float or integer | `42` or `3.14` |
| `text` | Multi-language string | `{"en": "Hello", "ro": "Salut"}` |
| `text_list` | Array of multi-language strings | `[{"en": "Item 1"}, {"en": "Item 2"}]` |
| `titled_text_list` | Array with title/text pairs | `[{"title": {...}, "text": {...}}]` |
| `image` | Single image reference (UUID) | `"550e8400-e29b-41d4-a716-446655440000"` |
| `image_list` | Array of image references | `[{"_image": "...", "sort": 1}]` |

**Note:** `null` content_type means the block is a container only (no content allowed).

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

Stores image references with sort order.

```sql
-- Column definition
_images JSONB
```

**Structure:** `[{"_image": "uuid", "sort": number}, ...]`

**Rules:**
- Can be `null` or empty `[]`
- `_image` must be valid UUID referencing `images.id`
- Images must belong to the same collection
- `sort` determines display order
