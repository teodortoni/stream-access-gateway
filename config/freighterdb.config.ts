import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import * as path from "path"
import configs from "./defaultconfigs"

export const freighterdbOrmConfig: TypeOrmModuleOptions = {
  name: "freighterdb",
  type: configs().app.fdb.type as "mysql",
  host: configs().app.fdb.host,
  port: configs().app.fdb.port,
  username: configs().app.fdb.username,
  password: configs().app.fdb.password,
  database: configs().app.fdb.database,
  entities: [__dirname + "/../src/**/*.entity{.js,.ts}"],
  migrations: [__dirname + "/../src/database/migrations/*.{js,ts}"],
  cli: {
    migrationsDir: path.join("src", "database/migrations")
  },
  synchronize: configs().app.db.synchronize === "true" ? true : false,
  logging: configs().app.db.displaySql === "true" ? true : false
}
