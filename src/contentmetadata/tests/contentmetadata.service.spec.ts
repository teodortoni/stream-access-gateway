import { Test, TestingModule } from '@nestjs/testing';
import { ContentmetadataService } from './contentmetadata.service';

describe('ContentmetadataService', () => {
  let service: ContentmetadataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentmetadataService],
    }).compile();

    service = module.get<ContentmetadataService>(ContentmetadataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
