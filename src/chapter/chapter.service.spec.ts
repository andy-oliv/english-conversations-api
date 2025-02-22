import { Test, TestingModule } from '@nestjs/testing';
import { ChapterService } from './chapter.service';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import generateMockChapter from '../utils/mockChapter';
import Chapter from '../entities/Chapter';
import HTTP_MESSAGES from '../messages/httpMessages';
import { NotFoundException } from '@nestjs/common';

describe('ChapterService', () => {
  let chapterService: ChapterService;
  let prismaService: PrismaService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChapterService,
        {
          provide: PrismaService,
          useValue: {
            chapter: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              delete: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    chapterService = module.get<ChapterService>(ChapterService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(chapterService).toBeDefined();
  });

  describe('createChapter()', () => {
    it('should create a new chapter', async () => {
      const chapter: Chapter = generateMockChapter();

      //mocking database call
      (prismaService.chapter.create as jest.Mock).mockResolvedValue(chapter);

      const result = await chapterService.createChapter(chapter);

      expect(prismaService.chapter.create).toHaveBeenCalledWith({
        data: chapter,
      });

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.chapter.create.status_201,
        data: chapter,
      });
    });
  });

  describe('fetchChapters()', () => {
    it('should fetch all the chapters available', async () => {
      const chapters: Chapter[] = [
        generateMockChapter(),
        generateMockChapter(),
      ];

      //mocking database call
      (prismaService.chapter.findMany as jest.Mock).mockResolvedValue(chapters);

      const result = await chapterService.fetchChapters();

      expect(prismaService.chapter.findMany).toHaveBeenCalled();

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.chapter.fetchAll.status_200,
        data: chapters,
      });
    });

    it('should return an error if there are no chapters to show', async () => {
      (prismaService.chapter.findMany as jest.Mock).mockResolvedValue([]);

      await expect(chapterService.fetchChapters()).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('fetchChapter()', () => {
    it('should fetch a chapter', async () => {
      const chapter: Chapter = generateMockChapter();

      (prismaService.chapter.findUnique as jest.Mock).mockResolvedValue(
        chapter,
      );

      const result = await chapterService.fetchChapter(chapter.id);

      expect(prismaService.chapter.findUnique).toHaveBeenCalledWith({
        where: {
          id: chapter.id,
        },
        include: {
          nextChapters: true,
        },
      });

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.chapter.fetchOne.status_200,
        data: chapter,
      });
    });

    it('should throw an error if the chapter was not found', async () => {
      const mockId: number = 1;

      (prismaService.chapter.findUnique as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(chapterService.fetchChapter(mockId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateChapter()', () => {
    it('should update a chapter', async () => {
      const chapter: Chapter = generateMockChapter();
      const updatedData: Partial<Chapter> = generateMockChapter();
      chapter.description = updatedData.description;

      (prismaService.chapter.update as jest.Mock).mockResolvedValue(chapter);

      const result = await chapterService.updateChapter(
        chapter.id,
        updatedData,
      );

      expect(prismaService.chapter.update).toHaveBeenCalled();

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.chapter.update.status_200,
        data: chapter,
      });
    });

    it('should throw an error if the chapter was not found', async () => {
      (prismaService.chapter.findUnique as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(chapterService.updateChapter).rejects.toThrow();
    });
  });

  describe('deleteChapter()', () => {
    it('should delete a chapter', async () => {
      const chapter: Chapter = generateMockChapter();

      (prismaService.chapter.findUnique as jest.Mock).mockResolvedValue(
        chapter,
      );
      (prismaService.chapter.delete as jest.Mock).mockResolvedValue(chapter);

      const result = await chapterService.deleteChapter(chapter.id);

      expect(prismaService.chapter.delete).toHaveBeenCalled();

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.chapter.delete.status_200,
      });
    });

    it('should throw an error if the chapter was not found', async () => {
      const mockId: number = 1;
      (prismaService.chapter.findUnique as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(chapterService.deleteChapter(mockId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
