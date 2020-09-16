import { Injectable, Logger, HttpService, InternalServerErrorException } from "@nestjs/common"
import { LiveVideoStreamsRepository } from "./livevideostreams.repository"
import { ConfigService } from "@nestjs/config"
import { LiveStreamParams } from "../dto/live-stream-params.dto"
import * as EdgeAuth from "akamai-edgeauth"

@Injectable()
export class LivevideostreamsService {
  /**
   * Logger
   */
  private logger = new Logger("LiveVideoStreamsService")

  // test path hls/live/2016858/test880/master.m3u8
  private liveStreamParams: LiveStreamParams

  private tokenizedUrl: string

  /**
   * Edge Authentication Instance
   */
  private edgeAuth: EdgeAuth

  /**
   * Edge Authentication Parameters
   */
  private edgeAuthParams = {
    hostName: this.configService.get<string>("videoStreams.liveHostName"),
    windowSeconds: parseInt(this.configService.get<string>("videoStreams.windowSeconds"), 10),
    token: null
  }

  constructor(
    private repo: LiveVideoStreamsRepository,
    private configService: ConfigService,
    private httpService: HttpService
  ) {
    this.edgeAuth = new EdgeAuth({
      key: this.configService.get<string>("videoStreams.liveEncryptionKey"),
      windowSeconds: this.edgeAuthParams.windowSeconds,
      escapeEarly: true
    })
  }

  setParams(liveStreamParams: LiveStreamParams) {
    this.liveStreamParams = liveStreamParams
    return this
  }

  async storeLiveStreamForPartner() {
    try {
      await this.tokenizeUrl()
      return this.tokenizedUrl
    } catch (error) {
      this.logger.error(`Method: storeLiveStreamForPartner`, error.stack)
      throw new InternalServerErrorException()
    }
  }

  private async tokenizeUrl(): Promise<void> {
    try {
      const { liveStreamPath: path } = this.liveStreamParams

      // Generate token
      this.edgeAuthParams.token = this.edgeAuth.generateACLToken(`/${path}`)
      // this.edgeAuthParams.token = this.edgeAuth.generateACLToken(`/*`)

      // Test tokenized path
      this.tokenizedUrl = await this.testTokenizedUrl(
        `https://${this.edgeAuthParams.hostName}/${path}?hdnts=${this.edgeAuthParams.token}`
      )

      // If tokenized path test is successful set VideoStreamRecord to be passed
      // to repo.store() and store the record. Otherwise don't save the record.
      if (this.tokenizedUrl) {
        await this.storeLiveVideoStream()
      }
    } catch (error) {
      this.logger.error(`Method: tokenizeUrl`, error)
      throw new InternalServerErrorException()
    }
  }

  private async testTokenizedUrl(tokenizedUrl: string): Promise<string> {
    try {
      const response = await this.httpService
        .get(`${tokenizedUrl}`)
        .toPromise()
        .catch((error) => {
          this.logger.error(
            `Method: testTokenizedUrl, data: ${JSON.stringify({ tokenizedUrl })}, error status: ${
              error.response ? error.response.status : error
            } | ${error.response ? error.response.statusText : error}`
          )
          throw new InternalServerErrorException()
        })
      return response === undefined ? null : tokenizedUrl
    } catch (error) {
      this.logger.error(`Method: testTokenizedUrl`, error)
      throw new InternalServerErrorException()
    }
  }

  private async storeLiveVideoStream() {
    try {
      const record = {
        clientId: this.liveStreamParams.clientId,
        applicationId: this.liveStreamParams.applicationId,
        token: this.edgeAuthParams.token,
        path: this.liveStreamParams.liveStreamPath,
        tokenizedPath: this.tokenizedUrl,
        expiresAt: this.expiresAt()
      }
      await this.repo.store(record)
    } catch (error) {
      this.logger.error(
        `Method: storeLiveVideoStream, data: ${JSON.stringify({
          clientId: this.liveStreamParams.clientId,
          applicationId: this.liveStreamParams.applicationId,
          token: this.edgeAuthParams.token,
          path: this.liveStreamParams.liveStreamPath,
          tokenizedPath: this.tokenizedUrl,
          expiresAt: this.expiresAt()
        })}, error code: ${error.code}`,
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
