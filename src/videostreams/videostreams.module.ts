import { Module, HttpModule } from "@nestjs/common"
import { VideostreamsController } from "./videostreams.controller"
import { VideostreamsService } from "./videostreams.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { VideoStreamsRepository } from "./videostreams.repository"

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([VideoStreamsRepository])],
  controllers: [VideostreamsController],
  providers: [VideostreamsService]
})
export class VideostreamsModule {}
