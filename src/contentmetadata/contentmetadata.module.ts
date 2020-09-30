import { Module, HttpModule } from "@nestjs/common"
import { FreighterS3 } from "scripts/FreighterS3"
import { FreighterService } from "src/freighter/freighter.service"
import { ContentmetadataController } from "./contentmetadata.controller"
import { ContentmetadataService } from "./contentmetadata.service"

@Module({
  imports: [HttpModule],
  controllers: [ContentmetadataController],
  providers: [ContentmetadataService, FreighterService, FreighterS3]
})
export class ContentmetadataModule {}
