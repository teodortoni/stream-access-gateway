import { Controller, Get, Param, UseGuards, ParseUUIDPipe } from "@nestjs/common"
import { VideostreamsService } from "./videostreams.service"
import { AuthGuard } from "@nestjs/passport"
import { Scope } from "../scopes/scopes.decorator"
import { FormatValidationPipe } from "./pipes/formats-validation.pipe"
import { GetAuthenticatedPartner } from "../auth/get-authenticated-partner.decorator"
import { AuthenticatedPartner } from "../auth/dto/authenticated-partner.dto"

@Controller("v1")
export class VideostreamsController {
  constructor(private videotreamsService: VideostreamsService) {}

  @UseGuards(AuthGuard("jwt"))
  @Scope("video_stream_get")
  @Get("/watch/:videoId.:format")
  getVideoStreams(
    @Param("videoId", new ParseUUIDPipe()) videoId: string,
    @Param("format", FormatValidationPipe) format: string,
    @GetAuthenticatedPartner() partner: AuthenticatedPartner
  ) {
    return this.videotreamsService
      .setParams({
        videoId,
        format,
        partner
      })
      .getVideoStream()
  }
}
