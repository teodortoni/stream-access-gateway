# stream-access-gateway API

This application generates a set of API endpoints and calling mechanisms to expose the WWE Network content library to trusted partners for distribution to consumers within their application frameworks.

## Local Development

**Setup your environment:**

This application uses mysql/mariadb DBMS so a running mysql server is required. A database needs to be created named `stream-access-gateway`.

The application is built using [NestJs Framework](https://docs.nestjs.com/ "NestJs Documentation") which utilizes the [TypeORM](https://typeorm.io/ "TypeORM Documentation") object relational mapping. Both Nest and TypeORM CLI need to be installed globally.

```javascript
npm i -g nest  // Install Nest CLI globally
npm i -g typeorm // Intall TypeORM CLI globally
```

NestJs makes it easy to use environment variables by making use of the dotenv package. Copy the `.env.example` file to `.env` and modify the values in the `.env` file to suit your local environment.

```javascript
cp .env.example .env
```

**Install dependencies:**

```javascript
npm install
```

**Run migrations**
This application uses [TypeORM Migrations](https://typeorm.io/#/migrations/using-migration-api-to-write-migrations) to generata the initial schema of `stream-access-gateway` database. TypeORM migrations make use of the `ormconfig.json` file that contains the TypeORM connection configuration variables. So `ormconfig.json` file is required prior to running the migrations. All the commands related to the generation of the `ormconfig.json` file and migrations are found under the _scripts_ tag of the `package.json` file.

_How to generate the `ormconfig.json` file?_
This file is not included in the repo for security reasons, hence needs to be generated prior to running the migrations. The following command generates the file.

```javascript
npm run generate:ormconfig
```

_Running the migrations_
Run migrations once the `ormconfig.json` file is generated in the root directory of the application. The following command runs the migrations.

```javascript
npm run migrations
```

**Start the app:**
```javascript
npm run dev
```

### Working with migrations
The migrations directory is found under `src/database/`.

**How to generate a migration from a newly created entity?**
In a scenario where a new table needs to be added to the database we can create an entity for the new table and generate a migration file based on that new entity.

_Example_
Assuming `new-table.entity.ts` exports `NewTable` class we can generate a migration file for this entity running the following command:

```javascript
npm run migration:generate NewTable
```

The new migration file will be generated under  `src/database/migrations/` directory. The name will be prefixed by a timestamp followed by the name of the class like so `1589168272935-NewTable.ts`.

**How to create a new migration file?**
A new migration file indipendent of an entity can be created by running the following command:

```javascript
npm run migration:create <NameOfMigrationFile>
```

The new migration file will be generated under  `src/database/migrations/` directory.
