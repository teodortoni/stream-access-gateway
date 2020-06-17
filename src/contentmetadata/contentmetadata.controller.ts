import { Controller, Param, Get } from '@nestjs/common';
import { ContentmetadataService } from './contentmetadata.service';
import { AxiosResponse } from 'axios';

@Controller('v1/contentmetadata')
export class ContentmetadataController {
  constructor(private contentmetadataService: ContentmetadataService) {}

  @Get('content/:id')
  getVideoById(@Param('id') id: string): Promise<AxiosResponse<any>> {
    return this.contentmetadataService.getVideoById(id);
  }

  @Get('series/:id')
  getSeriesById(@Param('id') id: string): Promise<AxiosResponse<any>> {
    return this.contentmetadataService.getSeriesById(id);
  }

  @Get('season/:id')
  getSeasonById(@Param('id') id: string): Promise<AxiosResponse<any>> {
    return this.contentmetadataService.getSeasonById(id);
  }
}
