import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from "config";

const dbConfig = config.get('app.db');

export const typeOrmConfig = (ConfigService): TypeOrmModuleOptions => {
    const dotenv = new ConfigService();

    return {
        type: dotenv.get('TYPE') || dbConfig.type,
        host: dotenv.get('HOSTNAME') || dbConfig.host,
        port: dotenv.get('DBPORT') || dbConfig.port,
        username: dotenv.get('USERNAME') || dbConfig.username,
        password: dotenv.get('PASSWORD') || dbConfig.password,
        database: dotenv.get('DB_NAME') || dbConfig.database,
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        migrations: [__dirname + '/../../migrations/*.{js,ts}'],
        cli: {
            migrationsDir: __dirname + '/../../migrations'
        },
        synchronize: dotenv.get('TYPEORM_SYNCHRONIZE') || dbConfig.synchronize,
        logging: dotenv.get('DISPLAY_SQL') === 'true' ? true : false,
    };
};