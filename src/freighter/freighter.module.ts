import { Module } from "@nestjs/common"
import { FreighterService } from "./freighter.service"

@Module({
  providers: [FreighterService]
})
export class FreighterModule {}
