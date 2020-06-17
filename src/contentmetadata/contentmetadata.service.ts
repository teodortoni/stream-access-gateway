import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class ContentmetadataService {
  constructor(private httpService: HttpService) {}

  async getVideoById(id: string): Promise<any> {
    const response = await this.httpService.get(`https://freighter.wwe.com/v2/json/content/${id}`).toPromise();
    const data = response.data.data;
    const video = {}
    video['video_type'] = data['video_type']
    video['content-package'] = data['content-package']
    video['release_date'] = data['release_date']
    video['sunset_date'] = data['sunset_date']
    video['ads_enabled'] = data['ads_enabled']
    video['availability'] = data['availability']
    video['duration'] = data['durations']
    video['audio_languages'] = data['audio_languages']
    video['closed_caption'] = data['closed_caption']
    video['frame_preview'] = data['frame_preview']
    video['cue_points'] = data['cue_points']
    video['cue_points_json'] = data['cue_points_json']
    video['episode'] = data['episode']
    video['event'] = data['event']
    video['tag'] = data['tag']
    video['series'] = data['series']
    video['season'] = data['season']
    video['companion'] = data['companion']
    return video;
  }

  async getSeriesById(id: string): Promise<any> {
    const response = await this.httpService.get(`https://freighter.wwe.com/v2/json/series/${id}`).toPromise();
    const series = response.data.data.series;
    return series; 
  }

  async getSeasonById(id: string): Promise<any> {
    const response = await this.httpService.get(`https://freighter.wwe.com/v2/json/season/${id}`).toPromise();
    const data = response.data.data;
    const season = {}
    season['tag'] = data['tag']
    season['season'] = data['season']
    return season;
  }
}
