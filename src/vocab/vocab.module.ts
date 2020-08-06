import { Module, HttpModule } from '@nestjs/common';
import { VocabService } from './vocab.service';
import { VocabController } from './vocab.controller';

@Module({
  imports: [HttpModule],
  controllers: [VocabController],
  providers: [VocabService]
})
export class VocabModule {}
