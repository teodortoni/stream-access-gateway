import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class FormatValidationPipe implements PipeTransform {
  constructor(private configService: ConfigService) {}

  transform(value: any) {
    const videoStreamsFormats = JSON.parse(this.configService.get<string>("videoStreams.formats"))
    if (!videoStreamsFormats.some((format: string) => format === value)) {
      throw new BadRequestException(`Format must be one of the following: ${videoStreamsFormats}`)
    }

    return value
  }
}
