import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from "config";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config();

const dbConfig = config.get('app.db');

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: process.env.TYPE || dbConfig.type,
    host: process.env.HOSTNAME || dbConfig.host,
    port: process.env.DBPORT || dbConfig.port,
    username: process.env.USERNAME || dbConfig.username,
    password: process.env.PASSWORD || dbConfig.password,
    database: process.env.DB_NAME || dbConfig.database,
    entities: [__dirname + '/../**/*.entity{.js,.ts}'],
    migrationsTableName: process.env.MIGRATIONS_TABLE_NAME || dbConfig.migrationsTableName,
    migrations: [__dirname + '/../database/migrations/*.{js,ts}'],
    cli: {
        migrationsDir: path.join('src', 'database/migrations')
    },
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true' ? true : false || dbConfig.synchronize,
    logging: process.env.DISPLAY_SQL === 'true' ? true : false
};