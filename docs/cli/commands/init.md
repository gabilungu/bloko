# init

Creates a new database and initializes the schema.

```bash
npx bloko init
```

## What it does

1. Connects to the PostgreSQL server (using default `postgres` database)
2. Creates the database specified in `BLOKO_PG_DATABASE`
3. Creates all tables, indexes, and triggers

## Errors if

- Database already exists (use [reinit](./reinit) instead)
- Connection fails
- Password not set

## Example

```bash
# Set up environment
export BLOKO_PG_DATABASE=myapp
export BLOKO_PG_USER=admin
export BLOKO_PG_PASSWORD=password

# Initialize
npx bloko init
```

Output:
```
Connecting to localhost:5432...
Creating database "myapp"...
Creating schema...
Database "myapp" initialized successfully.
```
