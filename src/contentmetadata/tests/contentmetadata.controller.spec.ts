import { Test, TestingModule } from '@nestjs/testing';
import { ContentmetadataController } from './contentmetadata.controller';

describe('Contentmetadata Controller', () => {
  let controller: ContentmetadataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentmetadataController],
    }).compile();

    controller = module.get<ContentmetadataController>(ContentmetadataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
