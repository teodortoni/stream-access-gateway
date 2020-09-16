import { Controller, Post, Body, ValidationPipe, Get, Render } from "@nestjs/common"
import { LiveStreamParams } from "../dto/live-stream-params.dto"
import { LivevideostreamsService } from "./livevideostreams.service"

@Controller("livestream")
export class LiveVideoStreamsController {
  constructor(private liveVideoStreamService: LivevideostreamsService) {}

  @Get("/form")
  @Render("livestream/index")
  liveStreamForm() {
    return { message: "Hello!" }
  }

  @Post("store")
  storeLiveStreamForPartner(@Body(ValidationPipe) liveStreamParams: LiveStreamParams) {
    return this.liveVideoStreamService.setParams(liveStreamParams).storeLiveStreamForPartner()
  }
}
