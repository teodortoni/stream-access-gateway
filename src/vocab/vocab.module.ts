import { Module, HttpModule } from "@nestjs/common"
import { VocabService } from "./vocab.service"
import { VocabController } from "./vocab.controller"
import { FreighterService } from "../freighter/freighter.service"
import { FreighterS3 } from "../../scripts/FreighterS3"
import { FreighterRepository } from "../freighter/freighter.repository"
import { TypeOrmModule } from "@nestjs/typeorm"
import { freighterdbOrmConfig } from "../../config/freighterdb.config"

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([FreighterRepository], freighterdbOrmConfig.name)],
  controllers: [VocabController],
  providers: [VocabService, FreighterService, FreighterS3]
})
export class VocabModule {}
