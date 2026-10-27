import {
  Injectable,
  HttpService,
  Logger,
  NotFoundException,
  InternalServerErrorException
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class VocabService {
  private logger = new Logger("VocabService")
  constructor(private httpService: HttpService, private configService: ConfigService) {}

  private getContentApiBaseUrl(): string {
    return this.configService.get<string>("api.contentBaseUrl")
  }

  async getVocab(): Promise<any> {
    try {
      const response = await this.httpService
        .get(`${this.getContentApiBaseUrl()}/vocabs`)
        .toPromise()
      return response.data.data
    } catch (error) {
      this.logger.error(`Method: getVocab, ${error.message}, status: ${error.status}`, error.stack)
      if (error.response && error.response.status === 404) {
        throw new NotFoundException(error.response.data.message)
      }
      throw new InternalServerErrorException()
    }
  }

  async getVocabType(vocabularyType: string): Promise<any> {
    try {
      const response = await this.httpService
        .get(`${this.getContentApiBaseUrl()}/vocabs/${vocabularyType}`)
        .toPromise()
      return response.data.data
    } catch (error) {
      this.logger.error(
        `Method: getVocabType, ${error.message}, status: ${error.status}`,
        error.stack
      )
      if (error.response && error.response.status === 404) {
        throw new NotFoundException(error.response.data.message)
      }
      throw new InternalServerErrorException()
    }
  }
}
