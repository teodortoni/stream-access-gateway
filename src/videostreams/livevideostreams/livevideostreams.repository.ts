import { EntityRepository, Repository } from "typeorm"
import { LiveVideoStreams } from "../../entities/live-video-streams.entity"
import { Logger, BadRequestException } from "@nestjs/common"
import { VideoStreamRecord } from "../dto/video-stream-record.dto"
import { PartnerLiveStreamParams } from "../dto/partner-live-stream-params.dto"

@EntityRepository(LiveVideoStreams)
export class LiveVideoStreamsRepository extends Repository<LiveVideoStreams> {
  private logger = new Logger("LiveVideoStreamsRepository")

  async store(record): Promise<LiveVideoStreams> {
    try {
      const { clientId, applicationId, token, path, tokenizedPath, expiresAt } = record
      await this.deactivateActiveStream(record)
      const liveVideoStream = this.create()
      liveVideoStream.clientId = clientId
      liveVideoStream.applicationId = applicationId
      liveVideoStream.token = token
      liveVideoStream.path = path
      liveVideoStream.tokenizedPath = tokenizedPath
      liveVideoStream.isActive = true
      liveVideoStream.expiresAt = expiresAt
      await liveVideoStream.save()
      return liveVideoStream
    } catch (error) {
      this.logger.error(`Method: store, data: ${JSON.stringify(record)}, ${error}`, error)
      throw new BadRequestException()
    }
  }

  private async deactivateActiveStream(record: VideoStreamRecord): Promise<void> {
    try {
      const { clientId, applicationId } = record
      const activeStream = await this.getActiveLiveStreamForPartner({ clientId, applicationId })
      if (activeStream) {
        activeStream.isActive = false
        await activeStream.save()
      }
    } catch (error) {
      this.logger.error(
        `Method: deactivateActiveStream, data: ${JSON.stringify(record)}, ${error}`,
        error.stack
      )
      throw new BadRequestException()
    }
  }

  async updateStream(record): Promise<LiveVideoStreams> {
    try {
      const { id, token, tokenizedPath, contentVersionWweid, expiresAt } = record
      const liveVideoStream = await this.findOne(id)
      liveVideoStream.token = token
      liveVideoStream.tokenizedPath = tokenizedPath
      liveVideoStream.contentVersionWweid = contentVersionWweid
      liveVideoStream.expiresAt = expiresAt
      return await liveVideoStream.save()
    } catch (error) {
      this.logger.error(`Method: store, data: ${JSON.stringify(record)}`, error)
      throw new BadRequestException()
    }
  }

  async getLiveStreamsForPartner(
    partnerLiveStreamParams: PartnerLiveStreamParams
  ): Promise<LiveVideoStreams[]> {
    try {
      const { clientId, applicationId } = partnerLiveStreamParams
      return await this.find({ where: { clientId, applicationId } })
    } catch (error) {
      this.logger.error(
        `Method: getLiveStreamsForPartner, data: ${JSON.stringify(partnerLiveStreamParams)}`,
        error
      )
      throw new BadRequestException()
    }
  }

  async getActiveLiveStreamForPartner(
    partnerLiveStreamParams: PartnerLiveStreamParams
  ): Promise<LiveVideoStreams> {
    try {
      const { clientId, applicationId } = partnerLiveStreamParams
      return await this.findOne({ where: { clientId, applicationId, isActive: true } })
    } catch (error) {
      this.logger.error(
        `Method: getLiveStreamsForPartner, data: ${JSON.stringify(partnerLiveStreamParams)}`,
        error
      )
      throw new BadRequestException()
    }
  }
}
