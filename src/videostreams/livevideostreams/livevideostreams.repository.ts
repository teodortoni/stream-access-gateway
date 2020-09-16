import { EntityRepository, Repository } from "typeorm"
import { LiveVideoStreams } from "../../entities/live-video-streams.entity"
import { Logger, InternalServerErrorException } from "@nestjs/common"
import { VideoStreamRecord } from "../dto/video-stream-record.dto"

@EntityRepository(LiveVideoStreams)
export class LiveVideoStreamsRepository extends Repository<LiveVideoStreams> {
  private logger = new Logger("LiveVideoStreamsRepository")

  async store(record: VideoStreamRecord): Promise<LiveVideoStreams> {
    try {
      const { clientId, applicationId, token, path, tokenizedPath, expiresAt } = record
      const liveVideoStream = this.create()
      liveVideoStream.clientId = clientId
      liveVideoStream.applicationId = applicationId
      liveVideoStream.token = token
      liveVideoStream.path = path
      liveVideoStream.tokenizedPath = tokenizedPath
      liveVideoStream.expiresAt = expiresAt
      await liveVideoStream.save()
      return liveVideoStream
    } catch (error) {
      this.logger.error(`Method: store, data: ${JSON.stringify(record)}, ${error}`, error.stack)
      throw new InternalServerErrorException()
    }
  }
}
