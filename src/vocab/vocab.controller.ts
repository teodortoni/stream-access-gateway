import { Controller, UseGuards, Get, Param } from '@nestjs/common';
import { VocabService } from './vocab.service';
import { AxiosResponse } from 'axios';
import { AuthGuard } from '@nestjs/passport';
import { Scopes } from 'src/scopes/scopes.decorator';

@Controller('v1')
export class VocabController {
  constructor(private vocabService: VocabService) {}

  @UseGuards(AuthGuard('jwt'))
  @Scopes('content_meta_get')
  @Get('vocab')
  getVocab(): Promise<AxiosResponse<any>> {
    return this.vocabService.getVocab();
  }

  @UseGuards(AuthGuard('jwt'))
  @Scopes()
  @Get('vocab/:vocabulary_type')
  getVocabType(@Param('vocabulary_type') vocabulary_type: string): Promise<AxiosResponse<any>> {
    return this.vocabService.getVocabType(vocabulary_type);
  }

}
