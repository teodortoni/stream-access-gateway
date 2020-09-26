import { typeOrmConfig } from "../config/typeorm.config"
import { freighterdbOrmConfig } from "../config/freighterdb.config"
import * as fs from "fs"

const ormConfig = [typeOrmConfig, freighterdbOrmConfig]

fs.writeFileSync("ormconfig.json", JSON.stringify(ormConfig, null, 2))
// console.log(typeOrmConfig);
