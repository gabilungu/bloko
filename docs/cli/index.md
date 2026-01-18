# CLI

Command-line interface for database management.

## Installation

The CLI is included with the `bloko` package:

```bash
npx bloko <command>
```

Or install globally:

```bash
npm install -g bloko
bloko <command>
```

## Configuration

Create a `.env` file in your project root:

```env
# PostgreSQL (required for CLI)
BLOKO_PG_HOST=localhost
BLOKO_PG_PORT=5432
BLOKO_PG_DATABASE=myproject
BLOKO_PG_USER=admin
BLOKO_PG_PASSWORD=secret

# S3 (optional - only needed for image uploads in driver)
BLOKO_S3_ENDPOINT=http://localhost:9000
BLOKO_S3_REGION=us-east-1
BLOKO_S3_BUCKET=my-bucket
BLOKO_S3_ACCESS_KEY=admin
BLOKO_S3_SECRET_KEY=password
```

The CLI automatically loads `.env` from the current working directory.

### PostgreSQL Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BLOKO_PG_HOST` | localhost | PostgreSQL host |
| `BLOKO_PG_PORT` | 5432 | PostgreSQL port |
| `BLOKO_PG_DATABASE` | bloko | Database name |
| `BLOKO_PG_USER` | postgres | PostgreSQL user |
| `BLOKO_PG_PASSWORD` | - | **Required** |

### S3 Variables (Optional)

Only needed if using `bloko.images` service for image uploads.

| Variable | Default | Description |
|----------|---------|-------------|
| `BLOKO_S3_ENDPOINT` | - | S3/MinIO endpoint URL |
| `BLOKO_S3_REGION` | us-east-1 | S3 region |
| `BLOKO_S3_BUCKET` | - | Bucket name |
| `BLOKO_S3_ACCESS_KEY` | - | Access key ID |
| `BLOKO_S3_SECRET_KEY` | - | Secret access key |

## Quick Start

```bash
# Create .env file with your database config
echo "BLOKO_PG_PASSWORD=password" > .env

# Initialize database
npx bloko init

# Seed with sample data
npx bloko seed glossaries
```

## Commands

| Command | Description |
|---------|-------------|
| [init](./commands/init) | Create database and schema |
| [reinit](./commands/reinit) | Drop and recreate database (clears S3) |
| [seed](./commands/seed) | Seed with sample data |
| [studio](./commands/studio) | Launch web-based admin UI |

## Seeds

| Seed | Description |
|------|-------------|
| [dermatology](./seeds/dermatology) | Medical glossary with conditions/treatments |
| [glossaries](./seeds/glossaries) | Multi-language glossary template |
