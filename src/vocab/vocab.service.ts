import {
  Injectable,
  HttpService,
  Logger,
  NotFoundException,
  InternalServerErrorException
} from "@nestjs/common"
import { FreighterService } from "src/freighter/freighter.service"

@Injectable()
export class VocabService {
  private logger = new Logger("ContentMetadataService")
  constructor(private httpService: HttpService, private freighterService: FreighterService) {}

  async getVocab(): Promise<any> {
    try {
      return await this.freighterService.getVocab()
    } catch (error) {
      this.logger.error(`Method: getVocab, ${error.message}, status: ${error.status}`, error.stack)
      if (error.response && error.response.status === 404) {
        throw new NotFoundException(error.response.data.message)
      }
      throw new InternalServerErrorException()
    }
  }

  async getVocabType(type: string): Promise<any> {
    try {
      // const response = await this.httpService
      //   .get(`https://freighter.wwe.com/v2/vocabs/${type}`)
      //   .toPromise()
      // return response.data.data
      return await this.freighterService.getVocabTypeDetails(type)
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
