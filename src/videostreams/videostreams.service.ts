import {
  Injectable,
  HttpService,
  Logger,
  InternalServerErrorException,
  NotFoundException
} from "@nestjs/common"
import { VideoStreamParams } from "./dto/video-streams-params.dto"
import * as EdgeAuth from "akamai-edgeauth"
import { ConfigService } from "@nestjs/config"
import { VideoStreamsRepository } from "./videostreams.repository"
import { LivevideostreamsService } from "./livevideostreams/livevideostreams.service"
import { expiresAt } from "../../scripts/helpers"

@Injectable()
export class VideostreamsService {
  /**
   * Logger
   */
  private logger = new Logger("VideostreamsService")

  /**
   * Video Stream that will be returned to partner
   */
  private videoStream: object

  /**
   * Video Stream Request Parameters
   * Contains videoId, format (json or m3u8 or mpd) & partner
   */
  private videoStreamParams: VideoStreamParams

  /**
   * Content
   */
  private content: any

  /**
   * Path of content in akamai
   */
  private contentPath: any

  /**
   * Tokenized content url
   */
  private manifestUrl: string | object

  /**
   * Edge Authentication Instance
   */
  private edgeAuth: EdgeAuth

  /**
   * Edge Authentication Parameters
   */
  private edgeAuthParams = {
    hostName: this.configService.get<string>("videoStreams.hostName"),
    windowSeconds: 600,
    token: null
  }

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private videoStreamRepo: VideoStreamsRepository,
    private liveVideoStreamService: LivevideostreamsService
  ) {
    this.edgeAuth = new EdgeAuth({
      key: this.configService.get<string>("videoStreams.encryptionKey"),
      windowSeconds: this.edgeAuthParams.windowSeconds,
      escapeEarly: true
    })
  }

  private getContentApiBaseUrl(): string {
    return this.configService.get<string>("api.contentBaseUrl")
  }

  setParams(videoStreamParams: VideoStreamParams) {
    this.videoStreamParams = videoStreamParams
    return this
  }

  async getVideoStream(): Promise<object> {
    try {
      await this.setContent()
      return this.videoStream
    } catch (error) {
      this.logger.error(
        `Method: getVideoStream, data: ${JSON.stringify(this.videoStreamParams)}, error code: ${
          error.code
        }`,
        error.stack
      )
      throw error
    }
  }

  private async setContent(): Promise<void> {
    try {
      const result = await this.httpService
        .get(`${this.getContentApiBaseUrl()}/json/content/${this.videoStreamParams.videoId}`)
        .toPromise()
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            throw new NotFoundException(error.response.data.message)
          }
        })
      this.content = result ? result.data.data : null

      await this.setContentPath()
    } catch (error) {
      this.logger.error(
        `Method: setContent, data: ${JSON.stringify(this.content)}, ${error}`,
        error.stack
      )
      throw new InternalServerErrorException()
    }
  }

  private async setContentPath(): Promise<void> {
    try {
      const { videoId, format } = this.videoStreamParams
      const contentId = videoId.replace(/-/g, "_")
      const firstChar = contentId.substr(0, 1)
      const pathFormat = format === "m3u8" ? "hls" : format
      if (format === "json") {
        const hlsPath = `/${firstChar}/${contentId}/hls/${contentId}.m3u8`
        const dashPath = `/${firstChar}/${contentId}/mpd/${contentId}.mpd`
        this.contentPath = { hlsPath, dashPath }
      } else {
        this.contentPath = `/${firstChar}/${contentId}/${pathFormat}/${contentId}.${format}`
      }

      await this.setManifestUrl()
    } catch (error) {
      this.logger.error(
        `Method: setContentPath, data: ${JSON.stringify(this.content)}, ${error}`,
        error.stack
      )
      throw new InternalServerErrorException()
    }
  }

  private async setManifestUrl(): Promise<void> {
    try {
      this.manifestUrl = await this.getManifestUrl()
      await this.setVideoStream()
    } catch (error) {
      this.logger.error(
        `Method: setManifestUrl, data: ${JSON.stringify(this.videoStreamParams)}, error code: ${
          error.code
        }`,
        error.stack
      )
      throw new InternalServerErrorException()
    }
  }

  private async getManifestUrl(): Promise<string | object> {
    try {
      if (this.videoStreamParams.format === "json") {
        return await this.getManifestUrlObject()
      } else if (this.videoStreamParams.format === "live") {
        return await this.liveVideoStreamService
          .setParams({
            clientId: this.videoStreamParams.partner.clientId,
            applicationId: this.videoStreamParams.partner.applicationId,
            contentVersionId: this.videoStreamParams.videoId,
            liveStreamPath: null
          })
          .getTokenizedUrl()
      } else {
        return await this.getManifestUrlString()
      }
    } catch (error) {
      this.logger.error(`Method: getManifestUrl, error: `, error)
    }
  }

  private async getManifestUrlObject(): Promise<object> {
    try {
      this.edgeAuthParams.token = { hlsPathToken: null, dashPathToken: null }
      return {
        hls: await this.getTokenizedUrlByFormat("hls"),
        dash: await this.getTokenizedUrlByFormat("dash"),
        live: await this.liveVideoStreamService
          .setParams({
            clientId: this.videoStreamParams.partner.clientId,
            applicationId: this.videoStreamParams.partner.applicationId,
            contentVersionId: this.videoStreamParams.videoId,
            liveStreamPath: null
          })
          .getTokenizedUrl()
      }
    } catch (error) {
      this.logger.error(`Method: getManifestUrlObject, error: `, error)
    }
  }

  private async getTokenizedUrlByFormat(format: string): Promise<string> {
    try {
      const path = format === "hls" ? this.contentPath.hlsPath : this.contentPath.dashPath
      const pathToken = this.edgeAuth.generateACLToken(path)
      format === "hls"
        ? (this.edgeAuthParams.token.hlsPathToken = pathToken)
        : (this.edgeAuthParams.token.dashPathToken = pathToken)

      return await this.testManifestUrlRequest(
        `https://${this.edgeAuthParams.hostName}${path}?hdnts=${pathToken}`
      )
    } catch (error) {
      this.logger.error(`Method: getTokenizedUrlByFormat, error: `, error)
    }
  }

  private async getManifestUrlString(): Promise<string> {
    try {
      this.edgeAuthParams.token = this.edgeAuth.generateACLToken(this.contentPath)
      const manifestUrl = `https://${this.edgeAuthParams.hostName}${this.contentPath}?hdnts=${this.edgeAuthParams.token}`
      return await this.testManifestUrlRequest(manifestUrl)
    } catch (error) {
      this.logger.error(`Method: getManifestUrlString, error: `, error)
    }
  }

  private async testManifestUrlRequest(manifestUrl: string): Promise<string> {
    try {
      const response = await this.httpService
        .get(`${manifestUrl}`)
        .toPromise()
        .catch((error) => {
          this.logger.error(
            `Method: testManifestUrl, data: ${JSON.stringify({ manifestUrl })}, error status: ${
              error.response ? error.response.status : error
            } | ${error.response ? error.response.statusText : error}`
          )
        })
      return response === undefined ? null : manifestUrl
      // return manifestUrl
    } catch (error) {
      this.logger.error(`Method: testManifestUrlRequest, error: `, error)
    }
  }

  private async setVideoStream(): Promise<void> {
    try {
      const { episode } = this.content
      this.videoStream = {
        id: episode.id || episode.contentId,
        manifestUrl: this.manifestUrl,
        name: episode.name,
        synopsis: episode.synopsis,
        duration: this.duration(),
        rating: episode.rating.mpaa
      }

      await this.storeVideoStream()
    } catch (error) {
      this.logger.error(
        `Method: setVideoStream, data: ${JSON.stringify(this.content)}, error code: ${error.code}`,
        error.stack
      )
      throw new InternalServerErrorException()
    }
  }

  private async storeVideoStream() {
    try {
      const record = {
        clientId: this.videoStreamParams.partner.clientId,
        applicationId: this.videoStreamParams.partner.applicationId,
        contentVersionId: this.videoStreamParams.videoId,
        token:
          typeof this.edgeAuthParams.token === "object"
            ? JSON.stringify(this.edgeAuthParams.token)
            : this.edgeAuthParams.token,
        path:
          typeof this.contentPath === "object"
            ? JSON.stringify(this.contentPath)
            : this.contentPath,
        tokenizedPath:
          typeof this.manifestUrl === "object"
            ? JSON.stringify(this.manifestUrl)
            : this.manifestUrl,
        expiresAt: expiresAt(this.edgeAuthParams.windowSeconds)
      }
      await this.videoStreamRepo.store(record)
    } catch (error) {
      this.logger.error(
        `Method: storeVideoStream, data: ${JSON.stringify({
          clientId: this.videoStreamParams.partner.clientId,
          applicationId: this.videoStreamParams.partner.applicationId,
          token: this.edgeAuthParams.token,
          path: this.contentPath,
          tokenizedPath: this.manifestUrl,
          expiresAt: expiresAt(this.edgeAuthParams.windowSeconds)
        })}, error code: ${error.code}`,
        error.stack
      )
      throw new InternalServerErrorException()
    }
  }

  private duration(): string {
    try {
      const { duration } = this.content
      const newDuration = new Date(null, null, null, null, null, duration)
      if (isNaN(newDuration.getSeconds())) {
        throw new Error("Invalid Date")
      }
      return newDuration.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")
    } catch (error) {
      this.logger.error(
        `Method: duration, data: ${JSON.stringify(this.content)}, ${error}`,
        error.stack
      )
      throw new InternalServerErrorException()
    }
  }
}
