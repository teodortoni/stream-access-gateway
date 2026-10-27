# Content Delivery API

This project is a NestJS-based API for:

- managing partner/application credentials
- issuing scoped access tokens
- retrieving content metadata
- generating tokenized playback URLs for multiple stream formats

It is intended as a generic backend foundation for content distribution integrations.

## License

This project is licensed under [PolyForm Noncommercial 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0/).
Commercial use is not permitted under this license.

## Tech Stack

- [NestJS](https://docs.nestjs.com/)
- [TypeORM](https://typeorm.io/)
- MySQL/MariaDB
- Serverless Framework (optional deployment flow)

## Local Development

### 1) Install global CLIs

```bash
npm i -g @nestjs/cli
npm i -g typeorm
```

### 2) Configure environment

Copy `.env.example` to `.env` and update values for your environment:

```bash
cp .env.example .env
```

Key variables include:

- `CONTENT_API_BASE_URL` (content metadata source)
- `EDGE_AUTH_HOSTNAME` and `EDGE_AUTH_LIVE_HOSTNAME` (stream hostnames)
- database and AWS settings for your target environment

### 3) Install dependencies

```bash
npm install
```

### 4) Generate TypeORM config

```bash
npm run generate:ormconfig
```

### 5) Run migrations

```bash
npm run migrations
```

### 6) Start in development mode

```bash
npm run dev
```

## Migrations

Migrations are stored in `src/database/migrations`.

Generate from entity changes:

```bash
npm run migration:generate <MigrationName>
```

Create an empty migration:

```bash
npm run migration:create <MigrationName>
```

## Deployment (Serverless)

Before deployment, ensure `.env` contains valid production settings (DB, VPC, region, and stream/auth keys).

Typical flow:

```bash
npm run generate:ormconfig
npm run migrations
npm run build
serverless deploy
```

Serverless entry points:

- `serverless.yml`: infrastructure/runtime configuration
- `src/lambda.ts`: Lambda bootstrap
