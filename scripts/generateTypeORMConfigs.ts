import { typeOrmConfig } from '../config/typeorm.config';
import * as fs from 'fs';

fs.writeFileSync('ormconfig.json', JSON.stringify(typeOrmConfig, null, 2));
// console.log(typeOrmConfig);