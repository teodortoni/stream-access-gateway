import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { freighterdbOrmConfig } from "../../config/freighterdb.config"
import { FreighterS3 } from "../../scripts/FreighterS3"
import { FreighterRepository } from "./freighter.repository"
import { FreighterService } from "./freighter.service"

@Module({
  imports: [TypeOrmModule.forFeature([FreighterRepository], freighterdbOrmConfig.name)],
  providers: [FreighterService, FreighterS3]
})
export class FreighterModule {}
