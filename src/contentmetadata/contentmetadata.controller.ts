import { Controller, Param, Get, UseGuards } from '@nestjs/common';
import { ContentmetadataService } from './contentmetadata.service';
import { AxiosResponse } from 'axios';
import { AuthGuard } from '@nestjs/passport';
import { Scopes } from 'src/scopes/scopes.decorator';

@Controller('v1')
export class ContentmetadataController {
    constructor(private contentmetadataService: ContentmetadataService) {}

    @UseGuards(AuthGuard('jwt'))
    /* This will not be the final Scope for this endpoint. This is here now for testing */ 
    @Scopes('content_meta_get')
    @Get('content/:id')
    getVideoById(@Param('id') id: string): Promise<AxiosResponse<any>> {
        return this.contentmetadataService.getVideoById(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Scopes('series_meta_get')
    @Get('series/:id')
    getSeriesById(@Param('id') id: string): Promise<AxiosResponse<any>> {
        return this.contentmetadataService.getSeriesById(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Scopes('season_meta_get')
    @Get('season/:id')
    getSeasonById(@Param('id') id: string): Promise<AxiosResponse<any>> {
        return this.contentmetadataService.getSeasonById(id);
    }
}
