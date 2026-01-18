# studio

Launch Bloko Studio, a web-based admin interface for browsing and managing your CMS content.

## Usage

```bash
npx bloko studio [port]
```

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `port` | 4173 | Port to run the studio server on |

## Examples

```bash
# Start studio on default port 4173
npx bloko studio

# Start studio on custom port
npx bloko studio 3000
```

## Features

The studio provides a read-only interface to browse:

- **Dashboard** - Overview with counts of collections, languages, node types, and nodes
- **Collections** - List all collections with node counts
- **Collection Detail** - View nodes within a collection
- **Languages** - List configured languages
- **Node Types** - List node types with their templates

## Configuration

Studio reads the same `.env` file as other CLI commands:

```env
BLOKO_PG_HOST=localhost
BLOKO_PG_PORT=5432
BLOKO_PG_DATABASE=myproject
BLOKO_PG_USER=admin
BLOKO_PG_PASSWORD=secret
```

## Notes

- Studio is a pre-built SvelteKit application bundled with the bloko package
- Currently read-only - editing features planned for future versions
- Runs as a local server - not intended for production deployment
