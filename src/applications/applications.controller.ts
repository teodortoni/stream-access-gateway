import { Controller, Post } from '@nestjs/common';
import * as config from "config";

const versionTag = config.get('api.version');

@Controller(`${versionTag}/applications`)
export class ApplicationsController {
    @Post('/register')
    createApplication() {
        // register application
        return {
            status: "Worked!"
        };
    }
}
