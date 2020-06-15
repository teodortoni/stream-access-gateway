import { Injectable, HttpService } from '@nestjs/common';
import { AxiosResponse } from 'axios';

@Injectable()
export class ContentmetadataService {
  constructor(private httpService: HttpService) {}

  async getVideoById(id: string): Promise<AxiosResponse<any>> {
    const response = await this.httpService.get(`https://freighter.wwe.com/v2/json/content/${id}`).toPromise();
    return response.data;
  }

  // async getSeriesById(id: string): Promise<AxiosResponse<any>> {
  //   const response = await this.httpService.get(`https://freighter.wwe.com/v2/json/series/${id}`).toPromise();
  //   return response.data; 
  // }

  // async getSeasonById(id: string): Promise<AxiosResponse<any>> {
  //   const response = await this.httpService.get(`https://freighter.wwe.com/v2/json/season/${id}`).toPromise();
  //   return response.data;
  // }
}
