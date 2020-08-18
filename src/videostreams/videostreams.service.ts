import {
  Injectable,
  HttpService,
  Logger,
  InternalServerErrorException,
  NotFoundException
} from "@nestjs/common"
import { VideoStreamParams } from "./dto/video-streams-params.dto"
import * as EdgeAuth from "akamai-edgeauth"
import * as http from "http"
import { ConfigService } from "@nestjs/config"
import { VideoStreamsRepository } from "./videostreams.repository"

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
   * Contains videoId & format (json or m3u8)
   */
  private videoStreamParams: VideoStreamParams

  /**
   * Content
   */
  private content: any

  /**
   * Path of content in akamai
   */
  private contentPath: string

  /**
   * Tokenized content url
   */
  private manifestUrl: string

  /**
   * Edge Authentication Instance
   */
  private edgeAuth: EdgeAuth

  /**
   * Edge Authentication Parameters
   * Encryption / Transition Key bfdcd7b89fe2359d14d2a9ca5e4178e1
   * HLS Segment Encryption Mode AES_128
   */
  private edgeAuthParams = {
    // hostName: "vod.sonyliv.wwe.com.akamaized.net",
    hostName: "edgeauth.akamaized.net",
    encryptionKey: null,
    windowSeconds: 600,
    token: null
  }

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private videoStreamRepo: VideoStreamsRepository
  ) {
    this.edgeAuthParams.encryptionKey = this.configService.get<string>("videoStreams.encryptionKey")
    this.edgeAuth = new EdgeAuth({
      key: this.edgeAuthParams.encryptionKey,
      windowSeconds: this.edgeAuthParams.windowSeconds,
      escapeEarly: true
    })
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
      const { data } = await this.httpService
        .get(`https://freighter.wwe.com/v2/json/content/${this.videoStreamParams.videoId}`)
        .toPromise()
      this.content = data.data

      await this.setContentPath()
    } catch (error) {
      this.logger.error(
        `Method: setContent, data: ${JSON.stringify(this.content)}, ${error}`,
        error.stack
      )
      if (error.response && error.response.status === 404) {
        throw new NotFoundException(error.response.data.message)
      }
      throw new InternalServerErrorException()
    }
  }

  private async setContentPath(): Promise<void> {
    try {
      const { videoId, format } = this.videoStreamParams
      const domain = "http://vod.sonyliv.wwe.com/vod"
      const contentWweid = videoId.replace(/-/g, "_")
      const firstChar = contentWweid.substr(0, 1)
      this.contentPath = `${domain}/${firstChar}/${contentWweid}/hls/${contentWweid}.${format}`
      // this.contentPath =
      //   "http://vod.sonyliv.wwe.com/vod/3/39f25465_982e_3c44_9e03_273a1f67b3f5/hls/39f25465_982e_3c44_9e03_273a1f67b3f5.m3u8"

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
      // this.edgeAuthToken = this.edgeAuth.generateURLToken(this.contentPath)
      this.edgeAuthParams.token = this.edgeAuth.generateURLToken("/akamai/edgeauth")
      // console.log("edgeAuth: ", this.edgeAuth)

      const options = {
        method: "GET",
        hostname: this.edgeAuthParams.hostName,
        path: `${this.contentPath}?${this.edgeAuth.options.tokenName}=${this.edgeAuthParams.token}`
        // path: "/akamai/edgeauth",
        // Cookie: `${this.edgeAuth.options.tokenName}=${this.edgeAuthParams.token}`
      }
      // console.log("Options: ", options)
      const request = http.request(options, (res) => {
        // console.log("Response: ", res)
        // console.log("Akamai Edge Response Status: ", res.statusCode)
        // console.log("Akamai Edge Response Message: ", res.statusMessage)
      })

      // console.log("Request: ", request)
      request.on("error", (err) => {
        // console.error(err)
      })
      request.end()

      this.manifestUrl = `${this.contentPath}?hdnts=${this.edgeAuthParams.token}`

      await this.setVideoStream()
    } catch (error) {
      this.logger.error(
        `Method: getTokenizedUrlFromAkamai, data: ${JSON.stringify(
          this.videoStreamParams
        )}, error code: ${error.code}`,
        error.stack
      )
      throw new InternalServerErrorException()
    }
  }

  private async setVideoStream(): Promise<void> {
    try {
      const { episode } = this.content
      this.videoStream = {
        id: episode.wweid,
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
        token: this.edgeAuthParams.token,
        path: this.contentPath,
        tokenizedPath: this.manifestUrl,
        expiresAt: this.expiresAt()
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
          expiresAt: this.expiresAt()
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

  private expiresAt(): Date {
    const dateTime = new Date()
    return new Date(dateTime.getTime() + this.edgeAuthParams.windowSeconds * 1000)
  }
}
