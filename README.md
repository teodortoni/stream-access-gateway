# stream-access-gateway API

This application generates a set of API endpoints and calling mechanisms to expose the WWE Network content library to trusted partners for distribution to consumers within their application frameworks.

## Local Development

**Setup your environment:**<br/>
The application is built using [NestJs Framework](https://docs.nestjs.com/ "NestJs Documentation") which utilizes the [TypeORM](https://typeorm.io/ "TypeORM Documentation") object relational mapping. Both Nest and TypeORM CLI need to be installed globally. 
It also utilizes mysql/mariadb DBMS so **a running mysql server** is required. A database needs to be created named <b>stream-access-gateway</b>.<br/>
```javascript
npm i -g nest  // Install Nest CLI globally
npm i -g typeorm // Intall TypeORM CLI globally
```

NestJs makes it easy to use environment variables by making use of the dotenv package. 
Copy the <b>.env.example</b> file to <b>.env</b> and modify the values in the <b>.env</b> file to suit your local environment.<br/>
```javascript
cp .env.example .env
```

**Install dependencies:**

```javascript
npm install
```

**Prepping for migrations:**<br/>
This application uses [TypeORM Migrations](https://typeorm.io/#/migrations/using-migration-api-to-write-migrations) to generata the initial schema of <b>stream-access-gateway</b> database. TypeORM migrations make use of the <b>ormconfig.json</b> file that contains the TypeORM connection configuration variables. So ormconfig.json file is required prior to running the migrations. All the commands related to the generation of the ormconfig.json file and migrations are found under the <b>scripts</b> tag of the <b>package.json</b> file.

**How to generate the `ormconfig.json` file?**<br/>
This file is not included in the repo for security reasons, hence needs to be generated prior to running the migrations. The following command generates the file.

```javascript
npm run generate:ormconfig
```

**Running the migrations:**<br/>
Run migrations once the <b>ormconfig.json</b> file is generated in the root directory of the application. The following command runs the migrations.<br/>
```javascript
npm run migrations
```

**Start the app:**<br/>
```javascript
npm run dev
```



## Working with migrations
The migrations directory is found under <b>src/database/</b>.

**How to generate a migration from a newly created entity?**<br/>
In a scenario where a new table needs to be added to the database we can create an entity for the new table and generate a migration file based on that new entity.

**Example:**<br/>
Assuming <b>new-table.entity.ts</b> exports <b>NewTable</b> class we can generate a migration file for this entity running the following command:<br/>
```javascript
npm run migration:generate NewTable
```

The new migration file will be generated under  <b>src/database/migrations/</b> directory. The name will be prefixed by a timestamp followed by the name of the class like so <b>1589168272935-NewTable.ts</b>.

**How to create a new migration file?**<br/>
A new migration file indipendent of an entity can be created by running the following command:<br/>
```javascript
npm run migration:create <NameOfMigrationFile>
```

The new migration file will be generated under  <b>src/database/migrations/</b> directory.


## Deploy with Serverless

`Important:` It is important to update the <b>.env</b> file with the right AWS credentials related to the RDS database instance and VPC configurations. <b>.env.example</b> file has all the necessary variables.<br/>

We can deploy the application either by running <b>scripts/deploy.sh</b> or manually running the following commands:<br/>
```javascript
// Generate ormconfig.json
npm run generate:ormconfig

// Run migrations
npm run migrations

// Build distribution (dist) directory 
npm run build

// Run Serverless Deploy
serverless deploy
```

**How it works?**<br/>
There are two main files used by <b>Serverless Framework</b> that help deploy this application. These two files are <b>serverless.yml</b> and <b>src/lambda.ts</b>. The yaml file <b>serverless.yml</b> is in charge of the configurations and environment setup. This is the file that creates all the necessary services in AWS. These services for our application are: <b>API Getway Endpoint</b> as Proxy, <b>Lambda Function</b>, a <b>S3 Bucket</b> where the source code resides and a <b>CloudWatch</b> instance where the application logs are registered. The <b>src/lambda.ts</b> file is a replica of the <b>main.ts</b> file with minor differences. This file creates the application server and instantiates the application inside a lambda function. This will be the entry point of our application through the lambda function.