import { Test, TestingModule } from '@nestjs/testing';
import { ContentmetadataService } from '../contentmetadata.service';
import { async } from 'rxjs/internal/scheduler/async';

class ContentmetadataServiceMock {
  getVideoById(id: string) {
    return {
      "video_type": "full_episode",
      "content-package": {},
      "release_date": "",
      "sunset_date": "",
      "ads_enabled": false,
      "availability": 3,
      "closed_caption": [],
      "frame_preview": [],
      "cue_points": [],
      "cue_points_json": [],
      "episode": {},
      "event": {},
      "tag": {},
      "series": {},
      "season": {},
      "companion": {}
    }
  }

  getSeriesById(id: string) {
    return {
      "id": 48,
      "name": [],
      "type": {},
      "class": {},
      "genre": {},
      "image": [],
      "wweid": "wweid",
      "rating": {},
      "version": "1.0.0",
      "category": {},
      "revision": "1",
      "synopsis": [],
      "franchise": {}
    }
  }

  getSeasonById(id: string) {
    return {
      "name": [],
      "year": 2020,
      "image": [],
      "wweid": "wweid",
      "number": 2,
      "series": {},
      "version": "1.0.0",
      "revision": "1",
      "sequence": 2,
      "synopsis": [],
      "programming_block": 30
    }
  }
}

describe('ContentmetadataService', () => {
    let contentmetadataService;

    beforeEach(async () => {
      const ContentmetadataServiceProvider = {
        provide: ContentmetadataService,
        useClass: ContentmetadataServiceMock
      }
      const module = await Test.createTestingModule({
        providers: [ContentmetadataService, ContentmetadataServiceProvider],
      }).compile();

      contentmetadataService = await module.get<ContentmetadataService>(ContentmetadataService);
    });

    describe('getVideoById', () => {
      it('Returns content data', async () => {
        const wweid = 'wweid';
        const content = await contentmetadataService.getVideoById(wweid)
        expect(content).toHaveProperty('video_type');
        expect(content).toHaveProperty('content-package');
        expect(content).toHaveProperty('release_date');
        expect(content).toHaveProperty('sunset_date');
        expect(content).toHaveProperty('ads_enabled');
        expect(content).toHaveProperty('availability');
        expect(content).toHaveProperty('closed_caption');
        expect(content).toHaveProperty('frame_preview');
        expect(content).toHaveProperty('cue_points');
        expect(content).toHaveProperty('cue_points_json');
        expect(content).toHaveProperty('episode');
        expect(content).toHaveProperty('event');
        expect(content).toHaveProperty('tag');
        expect(content).toHaveProperty('series');
        expect(content).toHaveProperty('season');
        expect(content).toHaveProperty('companion');
      });
    });
    describe('getSeriesById', () => {
      it('Returns series data', async () => {
        const wweid = 'wweid';
        const series = await contentmetadataService.getSeriesById(wweid)
        expect(series).toHaveProperty('id');
        expect(series).toHaveProperty('name');
        expect(series).toHaveProperty('type');
        expect(series).toHaveProperty('class');
        expect(series).toHaveProperty('genre');
        expect(series).toHaveProperty('image');
        expect(series).toHaveProperty('wweid');
        expect(series).toHaveProperty('rating');
        expect(series).toHaveProperty('version');
        expect(series).toHaveProperty('category');
        expect(series).toHaveProperty('revision');
        expect(series).toHaveProperty('synopsis');
        expect(series).toHaveProperty('franchise');
      });
    });
    describe('getSeasonById', () => {
      it('Returns season data', async () => {
        const wweid = 'wweid';
        const season = await contentmetadataService.getSeasonById(wweid)
        expect(season).toHaveProperty('name');
        expect(season).toHaveProperty('year');
        expect(season).toHaveProperty('image');
        expect(season).toHaveProperty('wweid');
        expect(season).toHaveProperty('number');
        expect(season).toHaveProperty('series');
        expect(season).toHaveProperty('version');
        expect(season).toHaveProperty('revision');
        expect(season).toHaveProperty('sequence');
        expect(season).toHaveProperty('synopsis');
        expect(season).toHaveProperty('programming_block');
      });
    });
});
