import { Controller, Post, Body, ValidationPipe } from "@nestjs/common"
import { LiveStreamParams } from "../dto/live-stream-params.dto"
import { LivevideostreamsService } from "./livevideostreams.service"

@Controller("livestream")
export class LiveVideoStreamsController {
  constructor(private liveVideoStreamService: LivevideostreamsService) {}

  @Post("store")
  storeLiveStreamForPartner(@Body(ValidationPipe) liveStreamParams: LiveStreamParams) {
    return this.liveVideoStreamService.setParams(liveStreamParams).storeLiveStreamForPartner()
  }
}
