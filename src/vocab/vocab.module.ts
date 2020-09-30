import { Module, HttpModule } from "@nestjs/common"
import { VocabService } from "./vocab.service"
import { VocabController } from "./vocab.controller"
import { FreighterModule } from "src/freighter/freighter.module"
import { FreighterService } from "src/freighter/freighter.service"
import { FreighterS3 } from "scripts/FreighterS3"

@Module({
  imports: [HttpModule, FreighterModule],
  controllers: [VocabController],
  providers: [VocabService, FreighterService, FreighterS3]
})
export class VocabModule {}
