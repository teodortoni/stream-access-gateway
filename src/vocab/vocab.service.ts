import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class VocabService {
  constructor(private httpService: HttpService) {}

  async getVocab(): Promise<any> {
    const response = await this.httpService.get('https://freighter.wwe.com/v2/vocabs').toPromise();
    return response.data.data;
  }

  async getVocabType(vocabulary_type: string): Promise<any> {
    const response = await this.httpService.get(`https://freighter.wwe.com/v2/vocabs/${vocabulary_type}`).toPromise();
    return response.data.data;
  }
}
