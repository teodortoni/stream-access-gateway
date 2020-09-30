import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common"
import { S3 } from "aws-sdk"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class FreighterS3 {
  private logger = new Logger("FreighterS3 Class in ./scripts")
  private s3Client
  constructor(private configService: ConfigService) {
    this.s3Client = new S3({
      accessKeyId: this.configService.get<string>("app.freighter.s3.access"),
      secretAccessKey: this.configService.get<string>("app.freighter.s3.accessSecret")
    })
  }

  async get(location: string) {
    const params = {
      Bucket: this.configService.get<string>("app.freighter.s3.bucket"),
      Key: location
    }

    try {
      if (this.s3Client === undefined) {
        this.logger.error("Method: get, Could not get S3 client...")
        throw new InternalServerErrorException()
      }

      return await this.s3Client.getObject(params).promise()
    } catch (err) {
      this.logger.error(`Method: get, File not on S3: ${location}`)
      throw new NotFoundException(`File not on S3: ${location}`)
    }
  }
}
