import { Module, HttpModule } from '@nestjs/common';
import { ContentmetadataController } from './contentmetadata.controller';
import { ContentmetadataService } from './contentmetadata.service';

@Module({
    imports: [HttpModule],
    controllers: [ContentmetadataController],
    providers: [ContentmetadataService]
})
export class ContentmetadataModule {}
