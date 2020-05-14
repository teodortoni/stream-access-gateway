import { Controller } from '@nestjs/common';
import * as config from "config";

const versionTag = config.get('api.version');

@Controller(`${versionTag}/scopes`)
export class ScopesController {}
