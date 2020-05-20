import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as path from "path";
import configs from "./defaultconfigs";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: configs().app.db.type as "mysql",
    host: configs().app.db.host,
    port: configs().app.db.port,
    username: configs().app.db.username,
    password: configs().app.db.password,
    database: configs().app.db.database,
    entities: [__dirname + '/../src/**/*.entity{.js,.ts}'],
    migrationsTableName: configs().app.db.migrationsTableName,
    migrations: [__dirname + '/../src/database/migrations/*.{js,ts}'],
    cli: {
        migrationsDir: path.join('src', 'database/migrations')
    },
    synchronize: configs().app.db.synchronize === 'true' ? true : false,
    logging: configs().app.db.displaySql === 'true' ? true : false
};