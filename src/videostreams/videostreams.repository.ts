import { EntityRepository, Repository } from "typeorm"
import { VideoStreams } from "../entities/video-streams.entity"
import { Logger, InternalServerErrorException } from "@nestjs/common"
import { VideoStreamRecord } from "./dto/video-stream-record.dto"

@EntityRepository(VideoStreams)
export class VideoStreamsRepository extends Repository<VideoStreams> {
  private logger = new Logger("PartnersRepository")

  async store(record: VideoStreamRecord): Promise<VideoStreams> {
    try {
      const { clientId, applicationId, token, path, tokenizedPath, expiresAt } = record
      const videoStream = this.create()
      videoStream.clientId = clientId
      videoStream.applicationId = applicationId
      videoStream.token = token
      videoStream.path = path
      videoStream.tokenizedPath = tokenizedPath
      videoStream.expiresAt = expiresAt
      await videoStream.save()
      return videoStream
    } catch (error) {
      this.logger.error(`Method: store, data: ${JSON.stringify(record)}, ${error}`, error.stack)
      throw new InternalServerErrorException()
    }
  }
}
