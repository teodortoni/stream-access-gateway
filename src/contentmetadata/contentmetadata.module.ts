import { Module, HttpModule } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { freighterdbOrmConfig } from "../../config/freighterdb.config"
import { FreighterS3 } from "../../scripts/FreighterS3"
import { FreighterRepository } from "../freighter/freighter.repository"
import { FreighterService } from "../freighter/freighter.service"
import { ContentmetadataController } from "./contentmetadata.controller"
import { ContentmetadataService } from "./contentmetadata.service"

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([FreighterRepository], freighterdbOrmConfig.name)],
  controllers: [ContentmetadataController],
  providers: [ContentmetadataService, FreighterService, FreighterS3, FreighterRepository]
})
export class ContentmetadataModule {}
