# Schema Requirements

?> **Note:** Database indexes are implemented in the SQL schema. Timestamp fields (`created_at`, `updated_at`) and user tracking fields (`created_by`, `updated_by`) will be implemented in a future version.

?> **Key Feature:** Language codes are **editable**. When a language is deleted or its `id` is updated, database triggers automatically cascade changes to all multi-language JSONB fields across all entities, including nested structures like `text_list` and `titled_text_list`.

?> **Implementation Guidance:** Relational deployments (e.g., PostgreSQL) enforce cascades, validations, and migrations directly in the database layer via triggers/functions. Document-store deployments (e.g., MongoDB) must provide equivalent logic in their data-access or driver layer to keep behavior consistent.

## Entities

### Collections

**Purpose:** Organizational containers that own templates, node relation types, and images. All nodes belong to a collection, and collections define the boundary for code uniqueness and asset ownership.

**Fields:**

-   `id` (ID, Auto-generated, Unique) - Primary identifier (UUID or auto-increment)
-   `code` (String, Required, Unique) - Internal identifier for admin/AI recognition
-   `notes` (String, Optional) - Internal notes for admin/AI use (not shown in frontend)

**Unique Constraints:**

-   `code` must be globally unique

**Cascade:**

-   Delete: Cascade (deletes all nodes, templates, images, and node relation types in this collection)
-   Update: Allow (including `code`)

**Validation:**

-   `code`: Any characters allowed, max 50 characters
-   `notes`: Optional, no length limit

---

### Languages

**Purpose:** Define available languages for multi-language content support.

**Fields:**

-   `id` (String, Required, Unique) - ISO language code (e.g., `en`, `ro`) - serves as primary identifier
-   `title` (String, Required) - Display name (e.g., "English", "Română")
-   `sort` (Number, Optional) - Sort order for display

**Cascade:**

-   **Delete**: Automatically removes language key from all multi-language JSONB fields across all entities:
    -   Nodes: `title`, `subtitle`, `slug`
    -   Node Types: `title`
    -   Templates: `title`
    -   Blocks: `title`
    -   Node Relation Types: `title`, `reverse_title`
    -   Images: `caption`, `credit`
    -   Contents: `value` (for `text`, `text_list`, `titled_text_list` content types, including nested arrays)
    -   Example: Deleting language `fr` removes `"fr": "..."` from all JSONB fields
    -   Implementation: Database triggers automatically cascade deletion to all JSONB fields
-   **Update `id`**: Automatically renames language key in all multi-language JSONB fields across all entities:
    -   Same fields as delete cascade
    -   Example: Changing `en` → `en-us` renames key in all JSONB fields: `{"en": "Hello"}` → `{"en-us": "Hello"}`
    -   Implementation: Database triggers handle recursive key renaming, including nested structures
    -   Use case: Migrate from generic codes (`en`) to locale-specific codes (`en-us`, `en-gb`)
-   **Update `title`, `sort`**: Allow

**Validation:**

-   `id`: 2-8 characters, lowercase ISO code or locale identifier (letters with optional hyphen + region, e.g., `en`, `ro`, `en-us`)
-   `title`: Required string, 1-50 chars
-   `sort`: Optional, any number (used for display ordering)

**Implementation Notes:**

-   Language `id` is **editable** - triggers cascade the change to all JSONB fields
-   Cascade operations use PostgreSQL triggers with JSONB manipulation
-   For nested structures (`text_list`, `titled_text_list`), recursive functions traverse arrays
-   Performance: Only updates rows containing the language key (`WHERE field ? 'lang_code'`)

---

### Nodes

**Purpose:** Content instances that use templates to structure and display data. Nodes form hierarchical tree structures within their collection. All nodes must belong to a collection.

**Fields:**

-   `id` (ID, Auto-generated, Unique) - Primary identifier (UUID or auto-increment)
-   `code` (String, Required) - Internal identifier for admin/AI recognition
-   `_collection` (Reference, Required) → Collection - Collection this node belongs to
-   `_template` (Reference, Optional) → Template
-   `_node_type` (Reference, Required) → Node Type
-   `_parent` (Reference, Optional) → Node (must be in same collection)
-   `title` (Multi-language String, Optional) - Multi-language string
-   `subtitle` (Multi-language String, Optional) - Multi-language string
-   `slug` (Multi-language String, Optional) - Auto-generated URL slug (multi-language string)
-   `sort` (Number, Optional) - Manual sort order for this node among siblings
-   `sort_children_by` (Reference, Optional) → Node Children Sort Option - Determines how child nodes are sorted
-   `_cover_image` (Reference, Optional) → Image - Cover/featured image for this node
-   `_images` (Images Array, Optional) - Gallery images for this node
-   `notes` (String, Optional) - Internal notes for admin/AI use (not shown in frontend)

**Unique Constraints:**

-   `code` must be unique within the collection
-   `slug` per language uniqueness depends on parent:
    -   Top-level nodes (`_parent` is null): globally unique per language across all top-level nodes in all collections
    -   Child nodes (`_parent` is set): unique among siblings (same `_parent`) per language

**Cascade:**

-   Delete: Cascade (deletes all child nodes and all contents associated with this node)
-   Update: Allow (including `code`)
-   Collection Delete: Cascade (node is deleted)
-   Template Delete: Set to null (node's `_template` becomes null)
-   Node Type Delete: Cascade (node is deleted)
-   Parent Delete: Cascade (node is deleted)
-   Cover Image Delete: Set to null (node's `_cover_image` becomes null)
-   Gallery Image Delete: Remove from `_images` array

**Validation:**

-   `code`: Any characters allowed, max 50 characters, unique within collection
-   `_collection`: Must reference existing collection
-   `_template`: Optional. If set, must reference existing template in the same collection
-   `_node_type`: Must reference existing node type
-   `_parent`: Optional, must be in same collection, cannot reference self, cannot create circular references (must maintain tree structure)
-   `title`: Multi-language string (see Custom Types section).
-   `subtitle`: Multi-language string (see Custom Types section).
-   `slug`: Persisted multi-language string maintained by database-level routines. Auto-generated from `title` per language. Only generated for languages where `title[lang]` exists. If `title[lang]` is null/missing, `slug[lang]` is null. Uniqueness validation only checks non-null values. If duplicate exists among siblings (or globally for top-level), append `-1`, `-2`, etc.
-   `sort`: Optional, any number (used for manual ordering among siblings)
-   `sort_children_by`: Optional. If set, must reference existing Node Children Sort Option. Determines the field used to sort child nodes.
-   `_cover_image`: Optional. If set, must reference existing image in the same collection
-   `_images`: Images array (see Custom Types section). All referenced images must exist and belong to same collection.
-   `notes`: Optional, no length limit

**Slug Generation Rules:**

-   Generated from `title` field for each language where `title[lang]` exists
-   If `title[lang]` is null/missing → `slug[lang]` is null (no generation, no validation)
-   Converted to lowercase, replace spaces/special chars with hyphens
-   Uniqueness check depends on `_parent` (only validates non-null slugs):
    -   **Top-level nodes** (`_parent` is null): Check globally per language across all top-level nodes. If exists, append `-1`, `-2`, etc.
    -   **Child nodes** (`_parent` is set): Check among siblings (nodes with same `_parent`) per language. If exists, append `-1`, `-2`, etc.
-   Regenerated automatically by database logic when `title[lang]` OR `_parent` changes
-   Multiple nodes can have `slug[lang]: null` without conflict

**URL Structure:**

-   Top-level node: `/{slug}`
-   Child node: `/{parent-slug}/{slug}`
-   Nested child: `/{grandparent-slug}/{parent-slug}/{slug}`
-   Example: `/vitamins/vitamin-d/benefits`

---

### Node Types

**Purpose:** Organizational categorization for nodes.

**Fields:**

-   `id` (ID, Auto-generated, Unique) - Primary identifier (UUID or auto-increment)
-   `code` (String, Required, Unique) - Internal identifier for admin/AI recognition
-   `title` (Multi-language String, Optional) - Multi-language string
-   `sort` (Number, Optional) - Sort order for display in admin UI
-   `notes` (String, Optional) - Internal notes for admin/AI use (not shown in frontend)

**Unique Constraints:**

-   `code` must be globally unique

**Cascade:**

-   Delete: Cascade (deletes all nodes using this node type, which cascades to their contents)
-   Update: Allow (including `code`)

**Validation:**

-   `code`: Any characters allowed, max 50 characters
-   `title`: Multi-language string (see Custom Types section).
-   `sort`: Optional, any number (used for ordering in admin UI)
-   `notes`: Optional, no length limit

---

### Templates

**Purpose:** Define the structure and layout for nodes using blocks. Templates are owned by collections.

**Fields:**

-   `id` (ID, Auto-generated, Unique) - Primary identifier (UUID or auto-increment)
-   `code` (String, Required) - Internal identifier for admin/AI recognition
-   `_collection` (Reference, Required) → Collection
-   `title` (Multi-language String, Optional) - Multi-language string
-   `sort` (Number, Optional) - Sort order for display in admin UI
-   `notes` (String, Optional) - Internal notes for admin/AI use (not shown in frontend)

**Unique Constraints:**

-   `code` must be unique within collection

**Cascade:**

-   Delete: Cascade (deletes all blocks in template and sets `_template` to null for all nodes using this template)
-   Update: Allow (including `code`)
-   Collection Delete: Cascade (template is deleted)

**Validation:**

-   `code`: Any characters allowed, max 50 characters, unique within collection
-   `_collection`: Must reference existing collection
-   `title`: Multi-language string (see Custom Types section).
-   `sort`: Optional, any number (used for ordering in admin UI)
-   `notes`: Optional, no length limit

---

### Blocks

**Purpose:** Define content areas within templates with support for hierarchical nesting.

**Fields:**

-   `id` (ID, Auto-generated, Unique) - Primary identifier (UUID or auto-increment)
-   `code` (String, Required) - Internal identifier for admin/AI recognition
-   `_template` (Reference, Required) → Template
-   `_parent` (Reference, Optional) → Block (for nesting)
-   `title` (Multi-language String, Optional) - Multi-language string
-   `content_type` (Reference, Optional) → Content Type
-   `sort` (Number, Optional) - Sort order for display within template
-   `notes` (String, Optional) - Internal notes for admin/AI use (not shown in frontend)

**Unique Constraints:**

-   `code` must be unique within `_template`

**Cascade:**

-   Delete: Cascade (deletes all child blocks, all contents in this block and child blocks)
-   Update: Allow (including `code`)
-   Update `content_type`: Cascade (deletes all contents in this block)
-   Template Delete: Cascade (block is deleted)
-   Parent Delete: Cascade (block and all children are deleted)
-   Content Type Delete: Prevent (system entity)

**Validation:**

-   `code`: Any characters allowed, max 50 characters, unique within template
-   `_template`: Must reference existing template
-   `_parent`: Optional, must reference block in same template, cannot reference self, cannot create circular references (must maintain tree structure)
-   `title`: Multi-language string (see Custom Types section).
-   `content_type`: Optional, must reference existing Content Type. If `null`, no contents can exist for this block.
-   `sort`: Optional, any number (used for ordering blocks within template)
-   `notes`: Optional, no length limit

---

### Contents

**Purpose:** Store actual content data for nodes, organized by blocks.

**Fields:**

-   `id` (ID, Auto-generated, Unique) - Primary identifier (UUID or auto-increment)
-   `_node` (Reference, Required) → Node
-   `_block` (Reference, Required) → Block
-   `value` (Mixed, Required) - Content value (type based on block's `content_type`)

**Unique Constraints:**

-   `(_node, _block)` combination must be unique

**Cascade:**

-   Delete: Allow
-   Update: Allow
-   Node Delete: Cascade (content is deleted)
-   Block Delete: Cascade (content is deleted)
-   Block `content_type` Update: Cascade (content is deleted)

**Validation:**

-   `_node`: Must reference existing node
-   `_block`: Must reference existing block with a non-null `content_type`. The block's template must match the node's template.
-   `value`: Required, must match the structure defined by block's `content_type`
-   If `content_type` is `image`: value must be valid Image ID, image must belong to same collection as the content's node
-   If `content_type` is `images`: value must be valid images array, all referenced images must belong to same collection as the content's node
-   Unique: Only one content allowed per node/block combination
-   Cannot create content if block's `content_type` is `null`

---

### Images

**Purpose:** Store image files and their metadata. Owned by collections.

**Fields:**

-   `id` (ID, Auto-generated, Unique) - Primary identifier (UUID or auto-increment)
-   `_collection` (Reference, Required) → Collection
-   `s3_key` (String, Required) - Path to original image in S3
-   `file_name` (String, Required) - Original uploaded filename
-   `mime_type` (String, Required) - MIME type (e.g., "image/jpeg", "image/png", "image/webp")
-   `format` (String, Required) - Image format (e.g., "jpg", "png", "webp", "gif")
-   `file_size` (Number, Required) - File size in bytes
-   `width` (Number, Required) - Original width in pixels
-   `height` (Number, Required) - Original height in pixels
-   `caption` (Multi-language String, Optional) - Image caption/description
-   `credit` (Multi-language String, Optional) - Attribution, copyright, and license information

**Cascade:**

-   Delete: Cascade (deletes all image variants, should trigger S3 file deletion)
-   Update: Allow (including metadata)
-   Collection Delete: Cascade (image is deleted)

**Validation:**

-   `_collection`: Must reference existing collection
-   `s3_key`: Required, unique
-   `file_name`: Required, max 255 characters
-   `mime_type`: Required, must be valid image MIME type
-   `format`: Required, must match mime_type (e.g., "image/jpeg" → "jpg")
-   `file_size`: Required, positive number
-   `width`: Required, positive integer
-   `height`: Required, positive integer
-   `caption`: Multi-language string (see Custom Types section).
-   `credit`: Multi-language string (see Custom Types section).

---

### Image Variants

**Purpose:** Store generated image size variants with lazy loading support.

**Fields:**

-   `id` (ID, Auto-generated, Unique) - Primary identifier (UUID or auto-increment)
-   `_image` (Reference, Required) → Image
-   `req_width` (Number, Optional) - Requested width in pixels (null = auto/proportional)
-   `req_height` (Number, Optional) - Requested height in pixels (null = auto/proportional)
-   `format` (String, Required, Default: 'webp') - Output format ("webp", "jpeg", "png")
-   `quality` (Number, Required, Default: 80) - Compression quality (1-100)
-   `actual_width` (Number, Required) - Actual output width after resize/crop
-   `actual_height` (Number, Required) - Actual output height after resize/crop
-   `s3_key` (String, Required) - Path to variant image in S3
-   `file_size` (Number, Required) - File size in bytes

**Unique Constraints:**

-   `(_image, req_width, req_height, format, quality)` combination must be unique (using COALESCE for nullable dimensions)

**Cascade:**

-   Delete: Allow (triggers S3 file deletion)
-   Update: Allow
-   Image Delete: Cascade (variant is deleted)

**Validation:**

-   `_image`: Must reference existing image
-   `req_width`: Optional, positive integer or null (null = auto)
-   `req_height`: Optional, positive integer or null (null = auto)
-   `format`: Required, valid image format
-   `quality`: Required, 1-100
-   `actual_width`: Required, positive integer
-   `actual_height`: Required, positive integer
-   `s3_key`: Required, unique
-   `file_size`: Required, positive number
-   At least one of `req_width` or `req_height` should be non-null, or both null for original dimensions

**Dimension Behavior:**

| req_width | req_height | Result |
|-----------|------------|--------|
| null | null | Original dimensions (re-encoded to format/quality) |
| 1000 | null | Scale to 1000px wide, auto height (maintain aspect ratio) |
| null | 600 | Scale to 600px tall, auto width (maintain aspect ratio) |
| 1000 | 600 | Crop/cover to exactly 1000×600 |

**No Upscaling:** If requested dimensions exceed original, output is clamped to the largest possible size within the original image

---

### Node Relation Types

**Purpose:** Define types of relationships between nodes. Owned by collections but can be used to relate nodes across different collections.

**Fields:**

-   `id` (ID, Auto-generated, Unique) - Primary identifier (UUID or auto-increment)
-   `code` (String, Required) - Internal identifier for admin/AI recognition
-   `_collection` (Reference, Required) → Collection
-   `title` (Multi-language String, Optional) - Multi-language string
-   `reverse_title` (Multi-language String, Optional) - Multi-language string
-   `notes` (String, Optional) - Internal notes for admin/AI use (not shown in frontend)

**Unique Constraints:**

-   `code` must be unique within collection

**Cascade:**

-   Delete: Cascade (deletes all node relations using this node relation type)
-   Update: Allow (including `code`)
-   Collection Delete: Cascade (node relation type is deleted)

**Validation:**

-   `code`: Any characters allowed, max 50 characters, unique within collection
-   `_collection`: Must reference existing collection
-   `title`: Multi-language string (see Custom Types section). (e.g., "parent of", "linked disease")
-   `reverse_title`: Multi-language string (see Custom Types section). (e.g., "child of", "disease in article")
-   `notes`: Optional, no length limit

---

### Node Relations

**Purpose:** Create directed relationships between nodes.

**Fields:**

-   `id` (ID, Auto-generated, Unique) - Primary identifier (UUID or auto-increment)
-   `_from` (Reference, Required) → Node (must be in same collection as node relation type)
-   `_to` (Reference, Required) → Node (can be in any collection)
-   `_node_relation_type` (Reference, Required) → Node Relation Type

**Unique Constraints:**

-   `(_from, _to, _node_relation_type)` combination must be unique

**Cascade:**

-   Delete: Allow
-   Update: Allow
-   From Node Delete: Cascade (relation is deleted)
-   To Node Delete: Cascade (relation is deleted)
-   Node Relation Type Delete: Cascade (relation is deleted)

**Validation:**

-   `_from`: Must reference existing node in same collection as `_node_relation_type`
-   `_to`: Must reference existing node (can be in any collection)
-   `_node_relation_type`: Must reference existing node relation type
-   Unique: Only one relation allowed per from/to/type combination

---

## System Enums

### Content Types

System enum defining the data types available for content values.

**Available Values:**

-   `null` - No content allowed (block acts as container for child blocks only)
-   `number` - Float or integer
-   `text` - Multi-language string
-   `text_list` - Array of multi-language strings
-   `titled_text_list` - Array of objects with `title` and `text` (both multi-language strings)
-   `image` - Single image reference (Image ID)
-   `images` - Images array

**Examples:**

**`null`:**

-   No validation, no content allowed
-   Block serves as container for child blocks only

**`number`:**

-   Must be valid numeric value (float or integer)
-   Example: `42` or `3.14`

**`text`:**

-   Multi-language string (see Custom Types section)
-   Example:

```json
{
	"en": "Welcome to our site",
	"ro": "Bun venit pe site-ul nostru"
}
```

**`text_list`:**

-   Array of multi-language strings
-   Each array item is a multi-language string (can be partial)
-   Example (list of benefits):

```json
[
	{
		"en": "Fast delivery",
		"ro": "Livrare rapidă"
	},
	{
		"en": "Free returns",
		"ro": null
	},
	{
		"en": "24/7 support",
		"ro": "Suport 24/7"
	}
]
```

**`titled_text_list`:**

-   Array of objects, each with `title` and `text` (both multi-language strings)
-   Both `title` and `text` can be partial per item
-   Example (step-by-step instructions):

```json
[
	{
		"title": { "en": "Step 1", "ro": "Pasul 1" },
		"text": { "en": "Mix the ingredients", "ro": "Amestecă ingredientele" }
	},
	{
		"title": { "en": "Step 2", "ro": null },
		"text": { "en": "Bake for 30 minutes" }
	}
]
```

**`image`:**

-   Single image reference (Image ID)
-   Example:

```json
"img-123"
```

**`images`:**

-   Images array (see Custom Types section)
-   Example:

```json
[
	{ "_image": "img-123", "sort": 1 },
	{ "_image": "img-456", "sort": 2 }
]
```

### Node Children Sort Options

System enum defining available sorting options for node children.

**Available Values:**

-   `sort` - Sort by the `sort` field (manual ordering)
-   `title` - Sort alphabetically by `title` field
-   `subtitle` - Sort alphabetically by `subtitle` field

**Usage:**

-   Used in Nodes `sort_children_by` field to determine how child nodes are sorted
-   When `sort_children_by` is set to `sort`, children are ordered by their `sort` field value (ascending)
-   When set to `title` or `subtitle`, children are sorted alphabetically by that field in the current language context:
    -   Sorting is based on the value in the current language (e.g., `title.en` when viewing English site)
    -   Nodes with null or missing values for the current language appear at the end
    -   Example: Viewing in English with sort by `title`, nodes without `title.en` appear after nodes with `title.en`

---

## Custom Types

### Multi-language String

A **multi-language string** is a custom type for storing translations as objects with language codes as keys:

**Structure:** `{en: "value", ro: "value", ...}`

**Rules:**

-   Can be `null`, empty object `{}`, or partial (e.g., `{en: "value"}`)
-   All keys must be valid language IDs that exist in the Languages entity
-   Must be flat structure (no nesting like `{en: {nested: "value"}}`)
-   **Empty strings are treated as null**: Keys with empty string values (`""`) are automatically removed
    -   Example: `{"en": "", "ro": "Text"}` becomes `{"ro": "Text"}`
-   **Automatic cascade behavior**:
    -   When a language is **deleted**, its key is automatically removed from all multi-language strings
    -   When a language `id` is **updated**, the key is automatically renamed in all multi-language strings
    -   Example: Update `en` → `en-us` changes `{"en": "Hello"}` to `{"en-us": "Hello"}` everywhere

**Examples:**

-   `{en: "Hello", ro: "Salut"}` - Full translation
-   `{en: "Hello"}` - Partial translation (Romanian missing)
-   `{}` or `null` - No translations yet

**Usage in Schema:**

-   **Fields like `title`, `subtitle`, `slug`**: Use multi-language string type
-   **Content type `text`**: Multi-language string
-   **Content type `text_list`**: Array of multi-language strings
-   **Content type `titled_text_list`**: Array of objects with `title` and `text` (both multi-language strings)

### Images Array

An **images array** is a custom type for storing references to multiple images with sort order:

**Structure:** `[{_image: "id", sort: number}, ...]`

**Rules:**

-   Can be `null`, empty array `[]`, or contain image references
-   Each object must have `_image` (valid Image ID) and `sort` (number)
-   All referenced images must exist and belong to the same root node
-   Sort values determine display order

**Examples:**

```json
[
	{ "_image": "img-123", "sort": 1 },
	{ "_image": "img-456", "sort": 2 },
	{ "_image": "img-789", "sort": 3 }
]
```

**Usage in Schema:**

-   **Node `_images` field**: Images array (for node galleries)
-   **Content type `images`**: Images array
