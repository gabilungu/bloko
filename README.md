# Bloko

Multi-language CMS with PostgreSQL and S3.

- [Documentation](https://gabilungu.github.io/bloko/)
- [Storybook](https://gabilungu.github.io/bloko/storybook/)

## Quick Start

1. Create a project folder and add a `.env` file:

```env
BLOKO_PG_HOST=localhost
BLOKO_PG_PORT=5432
BLOKO_PG_DATABASE=myproject
BLOKO_PG_USER=admin
BLOKO_PG_PASSWORD=password

BLOKO_S3_ENDPOINT=http://localhost:9000
BLOKO_S3_REGION=us-east-1
BLOKO_S3_BUCKET=myproject
BLOKO_S3_ACCESS_KEY=admin
BLOKO_S3_SECRET_KEY=password
```

2. Start PostgreSQL and MinIO (or use your own):

```bash
docker run -d --name postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:16
docker run -d --name minio -e MINIO_ROOT_USER=admin -e MINIO_ROOT_PASSWORD=password -p 9000:9000 -p 9001:9001 minio/minio server /data --console-address ":9001"
```

3. Initialize the database and seed with sample data:

```bash
npx bloko init
npx bloko seed dermatology
```

4. Launch the admin studio:

```bash
npx bloko studio
```

Open http://localhost:4173 to manage your content.
