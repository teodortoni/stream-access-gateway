import { Module, HttpModule } from "@nestjs/common"
import { FreighterService } from "src/freighter/freighter.service"
import { ContentmetadataController } from "./contentmetadata.controller"
import { ContentmetadataService } from "./contentmetadata.service"

@Module({
  imports: [HttpModule],
  controllers: [ContentmetadataController],
  providers: [ContentmetadataService, FreighterService]
})
export class ContentmetadataModule {}
