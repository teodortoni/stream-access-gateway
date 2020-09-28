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
      let content = await this.manager.query(sqlQuery)
      if (content || content.length > 0 || content !== undefined) {
        content = content[0]
        content.body = JSON.parse(content.body)
        delete content.body.audio
        delete content.body.cue_points
        delete content.body.cue_points_json
        delete content.body.frame_preview
        delete content.body.closed_caption

        content.body.episode.wweid = content.wweid
        content.body.episode.wweidSource = "content_versions"
        content.body.episode.image = content.images
        content.body.video = {}
        console.log(content)
        return content
      }
      return null
    } catch (error) {
      this.logger.error(`Method: getContent, wweid: ${wweid}`, error.stack)
      throw new InternalServerErrorException()
    }
  }

  private setVideoContent() {
    try {
      this.video = {}

      if (this.content) {
        this.video["video_type"] = this.content.body.video_type
        this.video["content-package"] = this.content.body["content-package"]
        this.video["release_date"] = this.content.body.release_date
        this.video["sunset_date"] = this.content.body.sunset_date
        this.video["ads_enabled"] = this.content.body.ads_enabled
        this.video["availability"] = this.content.body.availability
        this.video["closed_caption"] = this.content.body.closed_caption
        this.video["frame_preview"] = this.content.body.frame_preview
        this.video["cue_points"] = this.content.body.cue_points
        this.video["cue_points_json"] = this.content.body.cue_points_json
        this.video["episode"] = this.content.body.episode
        this.video["event"] = this.content.body.event
        this.video["tag"] = this.content.body.tag
        this.video["series"] = this.content.body.series
        this.video["season"] = this.content.body.season
        this.video["companion"] = this.content.body.companion
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
