import { Test, TestingModule } from '@nestjs/testing';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { Logger } from 'nestjs-pino';
import CreateChapterDTO from './DTOs/createChapterDTO';
import generateMockChapter from '../utils/mockChapter';
import HTTP_MESSAGES from '../messages/httpMessages';
import { PrismaService } from '../prisma/prisma.service';
import Chapter from '../entities/Chapter';
import { faker } from '@faker-js/faker/.';
import { BadRequestException } from '@nestjs/common';

describe('ChapterController', () => {
  let chapterController: ChapterController;
  let chapterService: ChapterService;
  let logger: Logger;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChapterService,
        PrismaService,
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
      controllers: [ChapterController],
    }).compile();

    chapterController = module.get<ChapterController>(ChapterController);
    chapterService = module.get<ChapterService>(ChapterService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(chapterController).toBeDefined();
  });

  describe('createChapter()', () => {
    it('should create a new chapter', async () => {
      const chapterData: CreateChapterDTO = generateMockChapter();

      const response = {
        message: HTTP_MESSAGES.chapter.create.status_201,
        data: chapterData,
      };

      //assuming createChapter returns the correct response
      jest.spyOn(chapterService, 'createChapter').mockResolvedValue(response);

      const result = await chapterController.createChapter(chapterData);

      expect(result).toMatchObject(response);
      expect(logger.log).toHaveBeenCalledWith('Creating new chapter');
    });
  });

  describe('fetchChapters()', () => {
    it('should fetch all the chapters in the database', async () => {
      const chapters: Chapter[] = [
        generateMockChapter(),
        generateMockChapter(),
      ];

      const response = {
        message: HTTP_MESSAGES.chapter.fetchAll.status_200,
        data: chapters,
      };

      jest.spyOn(chapterService, 'fetchChapters').mockResolvedValue(response);

      const result = await chapterController.fetchChapters();

      expect(result).toMatchObject(response);
      expect(logger.log).toHaveBeenCalledWith(
        'Fetching chapters from the database',
      );
    });
  });

  describe('fetchChapter()', () => {
    it('should fetch a chapter', async () => {
      const chapter: Chapter = generateMockChapter();

      const response = {
        message: HTTP_MESSAGES.chapter.fetchOne.status_200,
        data: chapter,
      };

      jest.spyOn(chapterService, 'fetchChapter').mockResolvedValue(response);

      const result = await chapterController.fetchChapter(chapter.id);

      expect(result).toMatchObject(response);
      expect(logger.log).toHaveBeenCalledWith(
        'Fetching chapter from the database',
      );
    });
  });

  describe('updateChapter()', () => {
    it('should update a chapter', async () => {
      const chapter: Chapter = generateMockChapter();
      const updatedData: Partial<Chapter> = {
        title: faker.book.title(),
      };

      const response = {
        message: HTTP_MESSAGES.chapter.update.status_200,
        data: { ...chapter, updatedData },
      };

      jest.spyOn(chapterService, 'updateChapter').mockResolvedValue(response);

      const result = await chapterController.updateChapter(
        chapter.id,
        updatedData,
      );

      expect(result).toMatchObject(response);
      expect(logger.log).toHaveBeenCalledWith('A chapter is being updated');
    });

    it('should throw an error if the updatedData is empty', async () => {
      const id: number = faker.number.int();
      const updatedData: {} = {};

      await expect(
        chapterController.updateChapter(id, updatedData),
      ).rejects.toThrow(BadRequestException);

      expect(logger.log).toHaveBeenCalledWith(
        'Request to update a chapter with an empty body.',
      );
    });
  });

  describe('deleteChapter()', () => {
    it('should delete a chapter', async () => {
      const id: number = faker.number.int();

      const response = {
        message: HTTP_MESSAGES.chapter.delete.status_200,
      };

      jest.spyOn(chapterService, 'deleteChapter').mockResolvedValue(response);

      const result = await chapterController.deleteChapter(id);

      expect(result).toMatchObject(response);
      expect(logger.log).toHaveBeenCalledWith('A chapter is being deleted');
    });
  });
});
