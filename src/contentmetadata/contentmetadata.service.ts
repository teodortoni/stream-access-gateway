import { Injectable, HttpService, Logger, NotFoundException } from "@nestjs/common"
import { FreighterService } from "src/freighter/freighter.service"

@Injectable()
export class ContentmetadataService {
  private logger = new Logger("ContentMetadataService")
  constructor(private httpService: HttpService, private freighterService: FreighterService) {}

  async getVideoById(wweid: string): Promise<any> {
    try {
      const video = await this.freighterService.getVideoById(wweid)
      if (Object.keys(video).length < 1) {
        throw new NotFoundException(`Could not find a record given the ID: ${wweid}`)
      }
      return video
    } catch (error) {
      this.logger.error(`Method: getVideoById, contentVersionWweid: ${wweid}`, error.stack)
      throw error.status === 404 ? error : new NotFoundException()
    }
  }

  async getSeriesById(wweid: string): Promise<object> {
    try {
      const series = await this.freighterService.getSeriesById(wweid)
      if (!series) {
        throw new NotFoundException(`Could not find a record given the ID: ${wweid}`)
      }
      return series
    } catch (error) {
      this.logger.error(`Method: getSeriesById, contentVersionWweid: ${wweid}`, error.stack)
      throw error.status === 404 ? error : new NotFoundException()
    }
  }

  async getSeasonById(wweid: string): Promise<object> {
    try {
      const season = await this.freighterService.getSeasonById(wweid)
      if (!season) {
        throw new NotFoundException(`Could not find a record given the ID: ${wweid}`)
      }
      return season
    } catch (error) {
      this.logger.error(`Method: getSeasonById, contentVersionWweid: ${wweid}`, error.stack)
      throw error.status === 404 ? error : new NotFoundException()
    }
  }
}
