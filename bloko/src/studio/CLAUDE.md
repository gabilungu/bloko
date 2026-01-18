# Project: Multilingual CMS Admin with PostgreSQL 17

## Overview

This is a SvelteKit-based admin interface for managing a multilingual CMS with PostgreSQL backend. The system uses a **single database** architecture with collections, nodes, templates, blocks, and content.

## Environment Configuration

### .env File

```bash
# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=cms_test
POSTGRES_USER=postgres
POSTGRES_PASSWORD=

# S3 Object Storage
S3_ENDPOINT=https://nbg1.your-objectstorage.com
S3_BUCKET=glu27-cms-v1
S3_REGION=nbg1
S3_ACCESS_KEY=your_access_key
S3_SECRET_KEY=your_secret_key
S3_FORCE_PATH_STYLE=true
```

## Architecture

### Database Access Pattern (Queries Layer)

All database logic is separated into `/src/lib/server/queries/` - NO SQL in routes!

**Structure:**
```
src/lib/server/
├── PG.js               # Database connection pool
├── s3.js               # S3 operations (shared bucket)
└── queries/
    ├── node-types.js
    ├── languages.js
    ├── collections.js
    ├── templates.js
    ├── nodes.js
    ├── blocks.js
    ├── contents.js
    ├── images.js
    ├── relation-types.js
    └── relations.js
```

**Pattern:**
```javascript
// src/lib/server/PG.js - Single database connection
import pg from 'pg';
import { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER,
         POSTGRES_PASSWORD, POSTGRES_DB } from '$env/static/private';

const { Pool } = pg;
let pool = null;

function getPool() {
  if (!pool) {
    pool = new Pool({
      host: POSTGRES_HOST,
      port: parseInt(POSTGRES_PORT),
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return pool;
}

export { getPool };
```

```javascript
// src/lib/server/queries/node-types.js
import { getPool } from '$lib/server/PG.js';

export async function getAll() {
  const pool = getPool();
  const res = await pool.query('SELECT id FROM public.node_types ORDER BY id');
  return res.rows;
}

export async function create(id) {
  const pool = getPool();
  if (!id?.trim()) throw new Error('ID required');
  const res = await pool.query('INSERT INTO public.node_types (id) VALUES ($1) RETURNING *', [id.trim()]);
  return res.rows[0];
}
```

**Usage in routes:**
```javascript
// src/routes/node-types/+page.server.js
export async function load({ depends }) {
  depends('app:node-types');
  const items = await nodeTypesQueries.getAll();
  return { items };
}

// src/routes/node-types/data.remote.js
export const getNodeTypes = query('unchecked', () =>
  nodeTypesQueries.getAll()
);
export const createNodeType = query('unchecked', ({ id }) =>
  nodeTypesQueries.create(id)
);
```

**Benefits:**
- ✅ Single database connection pool
- ✅ Reusable across routes and API endpoints
- ✅ Testable independently
- ✅ Single source of truth for database logic
- ✅ Clean separation: views don't touch SQL

### URL Structure & Route Patterns

Main route structure:
```
/                           # Redirects to /en/finder
/en/finder                  # Content finder (language-specific)
/node-types                 # Node types management
/languages                  # Languages management
/content-types              # Content types (system enums)
/images                     # Image management with upload
/info                       # Database schema info
/[languageId]/finder/...    # Language-specific content routes
```

**Route Patterns:**

**1. SPA Pattern** (node-types, languages):
- Single +page.svelte with client-side selection state
- All CRUD in one page

**2. Tabbed Interface Pattern** (images):
- Tabs component for switching between views
- Images tab: Upload, grid view, and image selection
- Presets tab: Table view of image processing presets
- Detail routes for individual images ([sid])

**3. Nested Route Pattern** (content-types, finder):
```
/content-types/
├── +layout.svelte          # Left sidebar with list
├── +layout.server.js       # Load all items
├── +page.svelte            # Empty state
├── data.remote.js          # Create + shared operations
└── [id]/
    ├── +page.svelte        # Editor for selected item
    └── +page.server.js     # Load single item
```

**Benefits of nested routes:**
- ✅ URL-based state (shareable links)
- ✅ Browser back/forward works
- ✅ Deselect by clicking same item
- ✅ Server-side data loading per route

### data.remote.js Files

SvelteKit remote query functions - thin wrappers around `/lib/server/queries/`

**Rules:**
- NEVER write SQL directly
- ONLY import from `/lib/server/queries/` or other server utilities
- ONLY export `query('unchecked', ...)` functions
- Keep minimal - just parameter forwarding

**Example:**
```javascript
import { query } from '$app/server';
import * as nodeTypesQueries from '$lib/server/queries/node-types.js';

export const getNodeTypes = query('unchecked', () =>
  nodeTypesQueries.getAll()
);

export const createNodeType = query('unchecked', ({ id, notes }) =>
  nodeTypesQueries.create(id, notes)
);
```

### S3 Integration

All S3 operations centralized in `/lib/server/s3.js` - NO duplication!

**Core operations:**
```javascript
import * as s3 from '$lib/server/s3.js';

// Upload/Delete
await s3.uploadToS3(key, buffer, contentType);
await s3.deleteFromS3(key);
await s3.deleteImageFiles(imageId, ext);

// URL/Key conversion
const url = s3.keyToUrl(key);
const url = s3.toS3UrlMaybe(keyOrUrl);  // Handles both
const key = s3.urlToKey(urlOrKey);      // Handles both

// Management (admin operations)
const { items, nextToken } = await s3.listS3({ prefix: 'nodes/', token });
const meta = await s3.headS3({ key });
const result = await s3.deleteS3({ keys: [...] });  // Bulk delete
```

**Pattern:** Import entire module with namespace to keep context clear

### Image Management System

Images are managed through a dedicated interface at `/images`:

**Features:**
- **Tabbed interface**: "Images" tab for browsing/uploading, "Presets" tab for configuration
- **Upload**: Drag-and-drop or click to upload JPEG, PNG, WebP, GIF images
- **Automatic processing**: Images are processed using PL/Python functions to generate variants
- **S3 storage**: Images stored in S3 bucket
- **Database tracking**: Image metadata stored in `public.images`, `public.image_presets`, `public.image_variants`

**Database Functions (PL/Python):**
```sql
-- Upload and process image
SELECT public.images_process_upload(
  p_filename TEXT,
  p_file_data BYTEA,
  p_s3_bucket TEXT,
  p_s3_endpoint TEXT,
  p_s3_region TEXT,
  p_s3_access_key TEXT,
  p_s3_secret_key TEXT
) RETURNS INT; -- Returns image sid

-- Delete image and S3 files
SELECT public.images_delete(p_image_sid INT) RETURNS INT; -- Returns deleted file count
```

**Query Functions:**
```javascript
// src/lib/server/queries/images.js
import { getPool } from '$lib/server/PG.js';

export async function getAll(options = {});  // List images with variants
export async function getBySid(sid);         // Get single image with variants
export async function upload(buffer, filename);  // Upload and process image
export async function remove(sid);           // Delete image and S3 files
export async function getPresets();          // Get image presets
```

**Important Notes:**
- Upload calls PL/Python function `images_process_upload` which handles S3 upload and variant generation
- Delete calls PL/Python function `images_delete` which deletes both database records and S3 files
- All S3 operations for images are handled server-side in PostgreSQL for consistency

## Translation Format (IMPORTANT)

- **Format**: JSONB with language codes as keys
- **Correct**: `'{"en": "English text", "ro": "Romanian text"}'`
- **Empty**: `'{}'` (empty JSON object)
- **Validation**: Language codes are validated against `public.languages` table
- **Slug format**: URL-safe only (lowercase, hyphens, alphanumeric) - enforced by trigger
  - Valid: `"hades"`, `"greek-mythology"`, `"element-118"`
  - Invalid: `"Hades"`, `"greek_mythology"`, `"element#118"`

## Collections System

**Collections are organizational containers** (like folders) that group related content:
- Collections are **NOT** a node type - they are separate entities
- Each collection contains its own templates and nodes
- Templates and nodes **must** belong to the same collection (enforced by triggers)
- Collections enable strict boundaries: templates can only be used by nodes in the same collection
- Examples: "Greek Mythology", "Chemical Elements", "Blog Posts"

**Key Rules:**
- Parent nodes must be in the same collection as their children
- Node templates must be in the same collection as the node
- Collections use SERIAL primary keys (sid)
- Deleting a collection CASCADE deletes all its templates and nodes

## Frontend Components

### BlockPreview Component
Displays template blocks with content editing in NodeForm:
- **Purpose**: Shows block code, title, hint, content form, and nested children
- **Props**: `code`, `title`, `hint`, `contentType`, `contentForm` (snippet), `children` (snippet)
- **Location**: `/src/lib/ui/BlockPreview/BlockPreview.svelte`
- **Usage**: Used in NodeForm to render hierarchical block structure with inline content editing

### ContentForm Component
Inline content editor that shows appropriate input based on content type:
- **Purpose**: Edit, create, and delete content values with type-specific inputs
- **Props**: `data`, `block`, `node`, `contentValue`
- **Location**: `/src/routes/[languageId]/finder/forms/ContentForm.svelte`
- **Input types**:
  - `text` → Input component (single line)
  - `paragraph` → Textarea component (multiline)
  - `number` → Input with type="number"
- **Features**:
  - **Create**: Enter text in empty input to create new content
  - **Edit**: Modify existing content, saves on blur
  - **Delete**: Click "Delete" button (only shown when content exists) or clear input
- **Save behavior**: Saves on blur, shows notifications, invalidates cache with `invalidate('app:nodes')`
- **State management**: Uses `$state` for edit value and saving flag, `$effect` to sync with prop changes
- **Delete button**: Only visible when `block.content?.sid` exists

### NodeForm Component
Main node editing interface with multilingual support:
- **Features**:
  - Language tabs with intent indicators (success/danger based on title + slug presence)
  - Template selection dropdown
  - Node type dropdown
  - Multilingual fields: title, subtitle, slug
  - Hierarchical block display with ContentForm for each block
  - "View Template" button to navigate to template editor
- **Block hierarchy**: Uses `buildBlockHierarchy()` to create tree structure from flat block list, attaching content to each block
- **Recursive rendering**: Uses snippet `renderBlock` to recursively render nested blocks

## Svelte 5 & SvelteKit Development

### Component State Management

**Stateful Components with Internal Mutations:**
When a component maintains internal state that it mutates (e.g., TreeView with drag-and-drop):

```javascript
// ❌ DON'T: Try to sync internal state with props using $effect
let tree = $state(createTreeCopy(items));
$effect(() => {
  tree = createTreeCopy(items); // Causes issues with internal mutations
});

// ✅ DO: Let the component own its state, trust it after mutations
let tree = $state(createTreeCopy(items));
// Component mutates tree directly, parent trusts the result
```

**Parent-Child Communication:**
```javascript
// Parent component
async function onReorder(updates) {
  await saveToDatabase(updates);
  // ✅ Trust child's internal state - don't reload
  // ❌ Don't call loadData() to "refresh" - child already updated visually
}
```

### Reactivity Rules

1. **`$effect` tracks what you READ**: Access reactive values inside the effect to track them
2. **`$derived` is read-only**: Use for computed values, not for state that needs mutation
3. **Avoid `{#key}` for reactivity**: Use it for forced remounts, not for syncing state
4. **IDs are integers**: All database IDs use SERIAL (integers), use `parseInt(params.id, 10)` for route params

### Preventing "Revert on Blur" in Forms

When editing forms that sync with server data, prevent inputs from reverting to old values after save:

```javascript
// ❌ DON'T: Effect overwrites inputs after save completes
let editValue = $state('');
$effect(() => {
  editValue = data.item?.value ?? ''; // Runs with stale data after invalidate
});

async function onBlur() {
  const updated = await saveToServer(editValue);
  await invalidate('app:items'); // Effect runs with OLD data, overwrites input!
}

// ✅ DO: Use sync key to prevent effect from running after save
let editValue = $state('');
let lastSyncKey = $state('');

$effect(() => {
  const key = `${$page.params.id}|${someOtherDep}`;
  if (key !== lastSyncKey) {
    editValue = data.item?.value ?? '';
    lastSyncKey = key;
  }
});

async function onBlur() {
  const updated = await saveToServer(editValue);
  editValue = updated.value; // Update immediately from server
  lastSyncKey = `${$page.params.id}|${someOtherDep}`; // Advance key to prevent overwrite
  await invalidate('app:items'); // Effect won't overwrite because key matches
}
```

**Key pattern**: Track when inputs should sync with a composite key, only sync when the key changes.

### TreeView Pattern

The TreeView demonstrates **internal state ownership**:
- Component receives initial `items` prop
- Creates internal copy for manipulation
- Mutates internal state during drag operations
- Calls parent's `onReorder` callback with updates
- Parent saves to database and trusts TreeView's visual state
- Only reload from database on **error** to restore correct state

## Running the Admin

```bash
cd admin
npm install
npm run dev
```

The admin will be available at `http://localhost:5173` and will redirect to `/en/finder`.

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run storybook` - Run Storybook for UI components
