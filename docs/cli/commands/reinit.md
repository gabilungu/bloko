# reinit

Drops and recreates the database. **Destroys all data.**

```bash
npx bloko reinit
```

## What it does

1. Clears all objects from S3 bucket (if configured)
2. Terminates all connections to the database
3. Drops the database
4. Creates a fresh database with schema

## Use when

- Starting fresh during development
- Schema changes require a clean slate

## S3 Cleanup

If `BLOKO_S3_BUCKET` is set, all images in the bucket will be deleted before the database is dropped.

## Example

```bash
npx bloko reinit
```

Output:
```
Clearing S3 bucket "my-bucket"...
Deleted 42 objects from S3.
Connecting to localhost:5432...
Terminating connections to "myapp"...
Dropping database "myapp"...
Creating database "myapp"...
Creating schema...
Database "myapp" reinitialized successfully.
```

## Warning

This command is destructive and cannot be undone. All data in both the database and S3 bucket will be permanently deleted.
