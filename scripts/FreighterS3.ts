import { Injectable, Logger, NotFoundException } from "@nestjs/common"
import { S3 } from "aws-sdk"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class FreighterS3 {
  private logger = new Logger("FreighterS3 Class in ./scripts")
  private s3Client
  constructor(private configService: ConfigService) {
    this.s3Client = new S3({
      accessKeyId: this.configService.get<string>("app.freighter.s3.access"),
      secretAccessKey: this.configService.get<string>("app.freighter.s3.secret")
    })
  }

  async get(location: string) {
    try {
      const params = {
        Bucket: this.configService.get<string>("app.freighter.s3.bucket"),
        Key: location
      }
      return await this.s3Client.getObject(params).promise()
    } catch (err) {
      this.logger.error(`Method: get, File not on S3: ${location}`, err)
      throw new NotFoundException(`File not on S3: ${location}`)
    }
  }
}
