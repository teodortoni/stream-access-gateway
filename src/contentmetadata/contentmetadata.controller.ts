<<<<<<< HEAD
import { Controller, Param, Get, UseGuards, ParseUUIDPipe } from "@nestjs/common"
=======
import { Controller, Param, Get, UseGuards } from "@nestjs/common"
>>>>>>> Updates content meta data and video streams to get content from freighter db.
import { ContentmetadataService } from "./contentmetadata.service"
import { AxiosResponse } from "axios"
import { AuthGuard } from "@nestjs/passport"
import { Scope } from "src/scopes/scopes.decorator"

@Controller("v1")
export class ContentmetadataController {
  constructor(private contentmetadataService: ContentmetadataService) {}

  @UseGuards(AuthGuard("jwt"))
  /* This will not be the final Scope for this endpoint. This is here now for testing */
  @Scope("content_meta_get")
  @Get("content/:id")
  getVideoById(@Param("id", new ParseUUIDPipe()) id: string): Promise<AxiosResponse<any>> {
    return this.contentmetadataService.getVideoById(id)
  }

  @UseGuards(AuthGuard("jwt"))
  @Scope("series_meta_get")
  @Get("series/:id")
  getSeriesById(@Param("id", new ParseUUIDPipe()) id: string): Promise<AxiosResponse<any>> {
    return this.contentmetadataService.getSeriesById(id)
  }

  @UseGuards(AuthGuard("jwt"))
  @Scope("season_meta_get")
  @Get("season/:id")
  getSeasonById(@Param("id", new ParseUUIDPipe()) id: string): Promise<AxiosResponse<any>> {
    return this.contentmetadataService.getSeasonById(id)
  }
}
