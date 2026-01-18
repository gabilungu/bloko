# Database

PostgreSQL 18 with JSONB for multi-language fields.

## Naming Conventions

- **Foreign keys**: Prefixed with `_` (e.g., `_collection`, `_template`, `_parent`)
- **Self-references**: Use `_parent` for recursive relationships (nodes → nodes, blocks → blocks)

## Features

- **UUIDv7 primary keys** - Time-sortable UUIDs for better index performance (new in PG 18)
- **JSONB columns** - Multi-language strings stored as `{"en": "...", "ro": "..."}`
- **Foreign key constraints** - CASCADE and SET NULL rules
- **Triggers** - Language cascade (delete/rename keys in all JSONB fields)
- **Unique constraints** - Compound uniqueness (e.g., code within collection)
- **Check constraints** - Validation rules
