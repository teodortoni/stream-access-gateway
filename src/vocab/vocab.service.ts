import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class VocabService {
  constructor(private httpService: HttpService) {}

  async getVocab(): Promise<any> {
    const response = await this.httpService.get('https://freighter.wwe.com/v2/vocabs').toPromise();
    return response.data.data;
  }

  async getVocabClassifications(): Promise<any> {
    const response = await this.httpService.get('https://freighter.wwe.com/v2/vocabs/classifications').toPromise();
    return response.data.data;
  }
}
