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

## Using Bloko Driver Directly

**IMPORTANT:** When working with bloko data, use the driver directly via inline Node.js commands from the `playground/` folder. Do NOT create separate JS/TS script files.

Example - run from playground folder:
```bash
cd playground
node -e "
import { createBloko } from 'bloko';
const bloko = createBloko({ db: { host: 'localhost', port: 5432, database: 'playground', user: 'admin', password: 'password' } });
const nodes = await bloko.crud.nodes.findAll();
console.log(nodes);
await bloko.disconnect();
"
```

Or use the CLI commands:
```bash
npx bloko init              # Initialize database schema
npx bloko reinit            # Drop and recreate database
npx bloko seed dermatology  # Seed with dermatology data
npx bloko studio            # Launch admin UI at http://localhost:4173
```
