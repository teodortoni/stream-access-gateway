import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common"
import { InjectEntityManager } from "@nestjs/typeorm"
import { FreighterS3 } from "scripts/FreighterS3"
import { EntityManager } from "typeorm"

@Injectable()
export class FreighterService {
  private logger = new Logger("FreighterService")
  private video
  private content

  constructor(
    @InjectEntityManager("freighterdb") private manager: EntityManager,
    private s3: FreighterS3
  ) {}

  async getVideoById(wweid: string) {
    try {
      await this.getVideoContent(wweid)

      return this.video
    } catch (error) {
      this.logger.error(`Method: getVideoById, wweid: ${wweid}`, error.stack)
      throw error
    }
  }

  private async getVideoContent(wweid: string): Promise<void> {
    try {
      this.content = await this.getContent(wweid)

      await this.setVideoContent()
    } catch (error) {
      this.logger.error(`Method: getVideoContent, wweid: ${wweid}`, error.stack)
      throw error
    }
  }

  async getContent(wweid: string): Promise<object> {
    try {
      const sqlQuery = `SELECT * FROM network_deliveries 
            JOIN sony_deliveries
            ON sony_deliveries.wweid=network_deliveries.cv_wweid
            WHERE sony_deliveries.wweid="${wweid}"`
      let content = await this.manager.query(sqlQuery)
      if (content.length > 0 && content !== undefined) {
        content = content[0]
        content.body = JSON.parse(content.body)
        delete content.body.audio
        delete content.body.cue_points
        delete content.body.cue_points_json
        delete content.body.frame_preview
        delete content.body.closed_caption

        content.body.episode.wweid = content.wweid
        content.body.episode.wweidSource = "content_versions"
        content.body.episode.image = JSON.parse(content.images)
        content.body.video = {}
        return content
      }
      return null
    } catch (error) {
      this.logger.error(`Method: getContent, wweid: ${wweid}`, error.stack)
      throw new NotFoundException(`Could not find a record given the ID: ${wweid}`)
    }
  }

  private async setVideoContent() {
    try {
      this.video = {}

      if (this.content) {
        this.video["video_type"] = this.content.body.video_type
        if (this.content.body.video_type === "supplemental") {
          this.video["supplemental_to"] = await this.getSupplementalTo(
            this.content.body.supplemental_to.wweid
          )
        }
        this.video["content-package"] = this.content.body["content-package"]
        this.video["release_date"] = this.content.body.release_date
        this.video["sunset_date"] = this.content.body.sunset_date
        this.video["ads_enabled"] = this.content.body.ads_enabled
        this.video["availability"] = this.content.body.availability
        this.video["closed_caption"] = this.content.body.closed_caption
        this.video["episode"] = this.content.body.episode
        this.video["event"] = this.content.body.event
        this.video["tag"] = this.content.body.tag
        this.video["series"] = this.content.body.series
        this.video["season"] = this.content.body.season
        this.video["companion"] = this.content.body.companion
      }
    } catch (error) {
      this.logger.error(`Method: setVideoContent, content: ${this.content}`, error.stack)
      throw error.status === 404
        ? error
        : new NotFoundException(`Could not find a record given the ID: ${this.content.wweid}`)
    }
  }

  async getSeriersById(wweid: string): Promise<object | null> {
    try {
      const sqlQuery = `SELECT * FROM network_deliveries WHERE wweid="${wweid}" AND delivery_type="series" LIMIT 1`
      const result = await this.manager.query(sqlQuery)
      const series = JSON.parse(result[0].body).series
      series.image = JSON.parse(result[0].images)
      return !result || result.length < 1 ? null : series
    } catch (error) {
      this.logger.error(`Method: getSeriesById, wweid: ${wweid}`, error.stack)
      throw new NotFoundException(`Could not find a record given the ID: ${wweid}`)
    }
  }

  async getSeasonById(wweid: string): Promise<object | null> {
    try {
      const sqlQuery = `SELECT * FROM network_deliveries WHERE wweid="${wweid}" AND delivery_type="season" LIMIT 1`
      const result = await this.manager.query(sqlQuery)
      const season = JSON.parse(result[0].body).season
      season.image = JSON.parse(result[0].images)
      return !result || result.length < 1 ? null : season
    } catch (error) {
      this.logger.error(`Method: getSeasonById, wweid: ${wweid}`, error.stack)
      throw new NotFoundException(`Could not find a record given the ID: ${wweid}`)
    }
  }

  async getVocab() {
    try {
      const enabled = await this.isVocabEnabled()

      const value = enabled.replace(/\[/g, "(").replace(/\]/g, ")")

      const output = {}
      const entriesQuery = `SELECT production_id, md5 FROM network_deliveries WHERE production_id IN ${value}`
      const entries = await this.manager.query(entriesQuery)

      for (const entry of entries) {
        output[entry.production_id] = entry.md5
      }

      for (const vocab of JSON.parse(enabled)) {
        if (output[vocab] === undefined) {
          const details = await this.getVocabTypeDetails(vocab)
          if (details.data.success) {
            output[vocab] = details.data.md5
          }
        }
      }

      return output
    } catch (error) {
      this.logger.error(`Method: getVocab, `, error.stack)
      throw new NotFoundException("Could not find a vocab records")
    }
  }

  async isVocabEnabled(vocab?: string) {
    try {
      const sqlQuery = `SELECT value FROM app_config WHERE flag="enabled_vocabularies" AND active=1 LIMIT 1`
      const enabled = await this.manager.query(sqlQuery)
      if (!enabled || (vocab !== undefined && enabled[0].value.indexOf(vocab) < 0)) {
        throw new NotFoundException("Could not load application configuration.")
      }

      return enabled[0].value
    } catch (error) {
      throw error
    }
  }

  async getVocabTypeDetails(vocab: string) {
    try {
      if (!(await this.isVocabEnabled(vocab))) {
        throw new BadRequestException("Unregistered vocabulary requested.")
      }

      const typeDetailsQuery = `SELECT body, md5 FROM network_deliveries WHERE delivery_type="controlled_vocabulary" AND production_id="${vocab}" AND enabled=1 LIMIT 1`
      const typeDetails = await this.manager.query(typeDetailsQuery)

      // const location = `controlled_vocabularies/${vocab}.json`

      // const remote = await this.getRemoteVocab(location)

      // return typeDetails ? JSON.parse(typeDetails[0].body) : JSON.parse(remote.body)
      return JSON.parse(typeDetails[0].body)
    } catch (error) {
      this.logger.error(`Method: getVocabTypeDetails, `, error.stack)
      throw error.status === 400
        ? error
        : new NotFoundException(`Could not find a record given type: ${vocab}`)
    }
  }

  async getRemoteVocab(location) {
    try {
      const remote = await this.s3.get(location)
      if (!remote) {
        return undefined
      }

      return {
        lmod: new Date(remote["LastModified"]),
        body: JSON.parse(remote.Body.toString()),
        md5:
          remote.Metadata.md5 !== undefined ? remote.Metadata.md5 : remote.ETag.replace(/"/gi, "")
      }
    } catch (error) {
      this.logger.error(`Method: getRemoteVocab, `, error.stack)
      throw new NotFoundException()
    }
  }

  async getSupplementalTo(wweid: string): Promise<object> {
    try {
      const query = `SELECT cv_wweid, wweid_source FROM network_deliveries WHERE wweid="${wweid}"`
      const result = await this.manager.query(query)
      if (result[0].cv_wweid === null) {
        throw new NotFoundException()
      }
      return {
        type: result[0].wweid_source,
        wweid: result[0].cv_wweid
      }
    } catch (error) {
      this.logger.error(`Method: getSupplementalTo, `, error)
      throw new NotFoundException(
        `Could not find a record given the ID: ${this.content.wweid} supplemental to ID: ${wweid}`
      )
    }
  }
}
