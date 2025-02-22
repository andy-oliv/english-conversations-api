import { Test, TestingModule } from '@nestjs/testing';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { Logger } from 'nestjs-pino';

describe('ChapterController', () => {
  let chapterController: ChapterController;
  let chapterService: ChapterService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ChapterService,
          useValue: {},
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
      controllers: [ChapterController],
    }).compile();

    chapterController = module.get<ChapterController>(ChapterController);
    chapterService = module.get<ChapterService>(ChapterService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(chapterController).toBeDefined();
  });
});
