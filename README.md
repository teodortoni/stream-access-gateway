# stream-access-gateway API

This application generates a set of API endpoints and calling mechanisms to expose the WWE Network content library to trusted partners for distribution to consumers within their application frameworks.

## Local Development

**Setup your environment:**

This application uses mysql/mariadb DBMS so a running mysql server is required. A database needs to be created named `stream-access-gateway`.

The application is built using [NestJs Framework](https://docs.nestjs.com/ "NestJs Documentation") which utilizes the [TypeORM](https://typeorm.io/ "TypeORM Documentation") object relational mapping. Both Nest and TypeORM CLI need to be installed globally.

```
npm i -g nest  // Install Nest CLI globally
npm i -g typeorm // Intall TypeORM CLI globally
```

NestJs makes it easy to use environment variables by making use of the dotenv package. Copy the `.env.example` file to `.env` and modify the values in the `.env` file to suit your local environment.

```
cp .env.example .env
```

**Install dependencies:**

```
npm install
```

**Start the app:**
```
npm run dev
```
