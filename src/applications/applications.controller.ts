import { Controller, Post, ValidationPipe, Body, Get } from '@nestjs/common';
import * as config from "config";
import { ApplicationScopesDto } from './dto/application-scopes.dto';
import { ApplicationsService } from './applications.service';

const versionTag = config.get('api.version');

@Controller(`${versionTag}/applications`)
export class ApplicationsController {
    constructor(private applicationService: ApplicationsService) { }

    // Create application scopes relationship
    @Post('/scopes/register')
    createApplicationRelationship(@Body(ValidationPipe) applicationScopesDto: ApplicationScopesDto ): Promise<object> {
        return this.applicationService.createApplicationScopesRelationship(applicationScopesDto);
    }

    @Get('/scopes/names')
    getApplicationScopesNames(@Body() applicationId: string): Promise<string[]> {
        return this.applicationService.getApplicationScopesNames(applicationId);
    }

}
