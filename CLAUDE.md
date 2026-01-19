# Bloko

Multi-language CMS with PostgreSQL and S3.

## Documentation

**The `/docs` folder is the source of truth** for CLI usage, driver API, database schema, and S3 configuration. Always keep docs updated when making changes.

```bash
cd docs && npm run dev   # http://localhost:5173
```

## Local Development

```bash
docker compose up -d                # Start PostgreSQL + MinIO
cd bloko && npm install && npm run build && npm test
```

| Service | URL | Credentials |
|---------|-----|-------------|
| PostgreSQL | localhost:5432 | admin / password |
| MinIO | localhost:9000 (API), localhost:9001 (Console) | admin / password |

## CLI Commands
```bash
npx bloko init              # Initialize database schema
npx bloko reinit            # Drop and recreate database
npx bloko seed dermatology  # Seed with dermatology data
npx bloko studio            # Launch admin UI at http://localhost:4173
```

## Publishing

GitHub Actions auto-publishes to npm when version changes on push to main.

To publish `bloko` or `bloko-studio`:
1. Bump version in `package.json`
2. Commit and push to main
3. GitHub Actions builds and publishes automatically
