import { Module, HttpModule } from "@nestjs/common"
import { VideostreamsController } from "./videostreams.controller"
import { VideostreamsService } from "./videostreams.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { VideoStreamsRepository } from "./videostreams.repository"
import { LiveVideoStreamsController } from "./livevideostreams/livevideostreams.controller"
import { LivevideostreamsService } from "./livevideostreams/livevideostreams.service"
import { LiveVideoStreamsRepository } from "./livevideostreams/livevideostreams.repository"
import { FreighterService } from "src/freighter/freighter.service"
import { FreighterS3 } from "scripts/FreighterS3"

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([VideoStreamsRepository, LiveVideoStreamsRepository])
  ],
  controllers: [VideostreamsController, LiveVideoStreamsController],
  providers: [VideostreamsService, LivevideostreamsService, FreighterService, FreighterS3]
})
export class VideostreamsModule {}
