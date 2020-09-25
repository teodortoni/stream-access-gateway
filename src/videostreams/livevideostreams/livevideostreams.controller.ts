import { Controller, Post, Body, ValidationPipe, BadRequestException } from "@nestjs/common"
import { LiveStreamParams } from "../dto/live-stream-params.dto"
import { LivevideostreamsService } from "./livevideostreams.service"
import { PartnerLiveStreamParams } from "../dto/partner-live-stream-params.dto"

@Controller("v1/livestream")
export class LiveVideoStreamsController {
  constructor(private liveVideoStreamService: LivevideostreamsService) {}

  @Post("/")
  getLiveStreamsForPartner(@Body(ValidationPipe) partnerLiveStreamParams: PartnerLiveStreamParams) {
    return this.liveVideoStreamService.getLiveStreamsForPartner(partnerLiveStreamParams)
  }

  @Post("/active")
  getActiveLiveStreamForPartner(
    @Body(ValidationPipe) partnerLiveStreamParams: PartnerLiveStreamParams
  ) {
    return this.liveVideoStreamService.getActiveLiveStreamForPartner(partnerLiveStreamParams)
  }

  @Post("store")
  storeLiveStreamForPartner(@Body(ValidationPipe) liveStreamParams: LiveStreamParams) {
    if (liveStreamParams.liveStreamPath.trim().substr(0, 1) !== "/") {
      throw new BadRequestException({
        statusCode: 400,
        message: ["liveStreamPath should start with forward slash"],
        error: "Bad Request"
      })
    }
    return this.liveVideoStreamService.setParams(liveStreamParams).storeLiveStreamForPartner()
  }
}
