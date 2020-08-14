import {
  Injectable,
  HttpService,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class VocabService {
  private logger = new Logger('ContentMetadataService');
  constructor(private httpService: HttpService) {}

  async getVocab(): Promise<any> {
    try {
      const response = await this.httpService
        .get('https://freighter.wwe.com/v2/vocabs')
        .toPromise();
      return response.data.data;
    } catch (error) {
      this.logger.error(
        `Method: getVocab, ${error.message}, status: ${error.status}`,
        error.stack,
      );
      if (error.response && error.response.status === 404) {
        throw new NotFoundException(error.response.data.message);
      }
      throw new InternalServerErrorException();
    }
  }

  async getVocabType(vocabulary_type: string): Promise<any> {
    try {
      const response = await this.httpService
        .get(`https://freighter.wwe.com/v2/vocabs/${vocabulary_type}`)
        .toPromise();
      return response.data.data;
    } catch (error) {
      this.logger.error(
        `Method: getVocabType, ${error.message}, status: ${error.status}`,
        error.stack,
      );
      if (error.response && error.response.status === 404) {
        throw new NotFoundException(error.response.data.message);
      }
      throw new InternalServerErrorException();
    }
  }
}
