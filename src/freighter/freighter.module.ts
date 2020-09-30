import { Module } from "@nestjs/common"
import { FreighterS3 } from "scripts/FreighterS3"
import { FreighterService } from "./freighter.service"

@Module({
  providers: [FreighterService, FreighterS3]
})
export class FreighterModule {}
