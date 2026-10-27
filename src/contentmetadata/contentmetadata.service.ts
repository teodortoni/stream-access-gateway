import {
  Injectable,
  HttpService,
  Logger,
  NotFoundException,
  InternalServerErrorException
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class ContentmetadataService {
  private logger = new Logger("ContentMetadataService")
  constructor(private httpService: HttpService, private configService: ConfigService) {}

  private getContentApiBaseUrl(): string {
    return this.configService.get<string>("api.contentBaseUrl")
  }

  async getVideoById(id: string): Promise<any> {
    try {
      const response = await this.httpService
        .get(`${this.getContentApiBaseUrl()}/json/content/${id}`)
        .toPromise()
      const data = response.data.data
      const video = {}
      video["video_type"] = data["video_type"]
      if (data["video_type"] === "supplemental") {
        video["supplemental_to"] = data["supplemental_to"]
      }
      video["content-package"] = data["content-package"]
      video["release_date"] = data["release_date"]
      video["sunset_date"] = data["sunset_date"]
      video["ads_enabled"] = data["ads_enabled"]
      video["availability"] = data["availability"]
      video["closed_caption"] = data["closed_caption"]
      video["episode"] = data["episode"]
      video["event"] = data["event"]
      video["tag"] = data["tag"]
      video["series"] = data["series"]
      video["season"] = data["season"]
      video["companion"] = data["companion"]
      return video
    } catch (error) {
      this.logger.error(
        `Method: getVideoById, data: ${JSON.stringify({
          contentVersionId: id
        })}, ${error.message}, status: ${error.status}`,
        error.stack
      )
      if (error.response && error.response.status === 404) {
        throw new NotFoundException(error.response.data.message)
      }
      throw new InternalServerErrorException()
    }
  }

  async getSeriesById(id: string): Promise<any> {
    try {
      const response = await this.httpService
        .get(`${this.getContentApiBaseUrl()}/json/series/${id}`)
        .toPromise()
      return response.data.data.series
    } catch (error) {
      this.logger.error(
        `Method: getSeriesById, data: ${JSON.stringify({
          contentVersionId: id
        })}, ${error.message}, status: ${error.status}`,
        error.stack
      )
      if (error.response && error.response.status === 404) {
        throw new NotFoundException(error.response.data.message)
      }
      throw new InternalServerErrorException()
    }
  }

  async getSeasonById(id: string): Promise<any> {
    try {
      const response = await this.httpService
        .get(`${this.getContentApiBaseUrl()}/json/season/${id}`)
        .toPromise()
      return response.data.data.season
    } catch (error) {
      this.logger.error(
        `Method: getSeasonById, data: ${JSON.stringify({
          contentVersionId: id
        })}, ${error.message}, status: ${error.status}`,
        error.stack
      )
      if (error.response && error.response.status === 404) {
        throw new NotFoundException(error.response.data.message)
      }
      throw new InternalServerErrorException()
    }
  }
}
