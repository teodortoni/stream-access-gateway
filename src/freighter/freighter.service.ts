import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common"
import { InjectEntityManager } from "@nestjs/typeorm"
import { EntityManager } from "typeorm"

@Injectable()
export class FreighterService {
  private logger = new Logger("FreighterService")
  private video
  private content

  constructor(@InjectEntityManager("freighterdb") private manager: EntityManager) {}

  async getVideoById(wweid: string) {
    try {
      await this.getVideoContent(wweid)

      return this.video
    } catch (error) {
      this.logger.error(`Method: getVideoById, wweid: ${wweid}`, error.stack)
      throw new InternalServerErrorException()
    }
  }

  private async getVideoContent(wweid: string): Promise<void> {
    try {
      this.content = await this.getContent(wweid)

      this.setVideoContent()
    } catch (error) {
      this.logger.error(`Method: getVideoContent, wweid: ${wweid}`, error.stack)
      throw new InternalServerErrorException()
    }
  }

  async getContent(wweid: string): Promise<object> {
    try {
      const sqlQuery = `SELECT * FROM network_deliveries 
            JOIN sony_deliveries
            ON sony_deliveries.wweid=network_deliveries.cv_wweid
            WHERE sony_deliveries.wweid="${wweid}"`
      const content = await this.manager.query(sqlQuery)
      return !content || content.length < 1 ? null : content[0]
    } catch (error) {
      this.logger.error(`Method: getContent, wweid: ${wweid}`, error.stack)
      throw new InternalServerErrorException()
    }
  }

  private setVideoContent() {
    try {
      this.video = {}
      const body = this.content ? JSON.parse(this.content.body) : null

      if (body) {
        delete body.audio
        delete body.cue_points
        delete body.cue_points_json
        delete body.frame_preview
        delete body.closed_caption

        body.episode.wweid = this.content.cv_wweid
        body.episode.wweidSource = "content_versions"
        body.episode.image = this.content.images
        body.video = {}

        this.video["video_type"] = body.video_type
        this.video["content-package"] = body["content-package"]
        this.video["release_date"] = body.release_date
        this.video["sunset_date"] = body.sunset_date
        this.video["ads_enabled"] = body.ads_enabled
        this.video["availability"] = body.availability
        this.video["closed_caption"] = body.closed_caption
        this.video["frame_preview"] = body.frame_preview
        this.video["cue_points"] = body.cue_points
        this.video["cue_points_json"] = body.cue_points_json
        this.video["episode"] = body.episode
        this.video["event"] = body.event
        this.video["tag"] = body.tag
        this.video["series"] = body.series
        this.video["season"] = body.season
        this.video["companion"] = body.companion
      }
    } catch (error) {
      this.logger.error(`Method: setVideoContent, content: ${this.content}`, error.stack)
      throw new InternalServerErrorException()
    }
  }

  async getSeriersById(wweid: string): Promise<object | null> {
    try {
      const sqlQuery = `SELECT * FROM network_deliveries WHERE wweid="${wweid}" LIMIT 1`
      const series = await this.manager.query(sqlQuery)
      return !series || series.length < 1 ? null : JSON.parse(series[0].body)
    } catch (error) {
      this.logger.error(`Method: getSeriesById, wweid: ${wweid}`, error.stack)
      throw new InternalServerErrorException()
    }
  }

  async getSeasonById(wweid: string): Promise<object | null> {
    try {
      const sqlQuery = `SELECT * FROM network_deliveries WHERE wweid="${wweid}" LIMIT 1`
      const season = await this.manager.query(sqlQuery)
      return !season || season.length < 1 ? null : JSON.parse(season[0].body)
    } catch (error) {
      this.logger.error(`Method: getSeasonById, wweid: ${wweid}`, error.stack)
      throw new InternalServerErrorException()
    }
  }
}
