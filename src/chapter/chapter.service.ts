import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Chapter from '../entities/Chapter';
import HTTP_MESSAGES from '../messages/httpMessages';
import * as dayjs from 'dayjs';
import EXCEPTION_MESSAGES from '../messages/exceptionMessages';

@Injectable()
export class ChapterService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async createChapter(
    chapterData: Chapter,
  ): Promise<{ message: string; data: Chapter }> {
    try {
      const newChapter: Chapter = await this.prismaService.chapter.create({
        data: chapterData,
      });

      return {
        message: HTTP_MESSAGES.chapter.create.status_201,
        data: newChapter,
      };
    } catch (error) {
      this.logger.error({
        message: HTTP_MESSAGES.internal.status_500,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.chapter.create.status_500,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }
  }

  async fetchChapters(): Promise<{ message: string; data: Chapter[] }> {
    try {
      const chapters: Chapter[] = await this.prismaService.chapter.findMany();

      if (chapters.length === 0) {
        throw new NotFoundException({
          message: HTTP_MESSAGES.chapter.fetchAll.status_404,
          pid: process.pid,
          timestamp: dayjs().format('DD/MM/YYYY'),
        });
      }

      return {
        message: HTTP_MESSAGES.chapter.fetchAll.status_200,
        data: chapters,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error({
        message: HTTP_MESSAGES.internal.status_500,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.chapter.fetchAll.status_500,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }
  }

  async fetchChapter(id: number): Promise<{ message: string; data: Chapter }> {
    try {
      const chapter: Chapter = await this.prismaService.chapter.findUnique({
        where: {
          id,
        },
        include: {
          nextChapters: true,
        },
      });

      if (!chapter) {
        throw new NotFoundException({
          message: HTTP_MESSAGES.chapter.fetchOne.status_404,
          pid: process.pid,
          timestamp: dayjs().format('DD/MM/YYYY'),
        });
      }

      return {
        message: HTTP_MESSAGES.chapter.fetchOne.status_200,
        data: chapter,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error({
        message: HTTP_MESSAGES.internal.status_500,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.chapter.fetchOne.status_500,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }
  }

  async updateChapter(
    id: number,
    updatedData: Partial<Chapter>,
  ): Promise<{ message: string; data: Chapter }> {
    try {
      const updatedChapter: Chapter = await this.prismaService.chapter.update({
        where: {
          id,
        },
        data: {
          title: updatedData.title,
          description: updatedData.description,
          mediaUrl: updatedData.mediaUrl,
          duration: updatedData.duration,
          requiredChapterId: updatedData.requiredChapterId,
        },
      });

      return {
        message: HTTP_MESSAGES.chapter.update.status_200,
        data: updatedChapter,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.error({
          message: EXCEPTION_MESSAGES.general.prisma_P2025,
          code: error.code,
          error: error.message,
          stack: error.stack,
          pid: process.pid,
          timestamp: dayjs().format('DD/MM/YYYY'),
        });

        throw new NotFoundException({
          message: HTTP_MESSAGES.chapter.update.status_404,
          pid: process.pid,
          timestamp: dayjs().format('DD/MM/YYYY'),
        });
      }

      this.logger.error({
        message: HTTP_MESSAGES.internal.status_500,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.chapter.update.status_500,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }
  }

  async deleteChapter(id: number): Promise<{ message: string }> {
    const chapterFound: Chapter = await this.prismaService.chapter.findUnique({
      where: {
        id,
      },
    });

    if (!chapterFound) {
      throw new NotFoundException({
        message: HTTP_MESSAGES.chapter.delete.status_404,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }
    try {
      await this.prismaService.chapter.delete({
        where: {
          id,
        },
      });

      return { message: HTTP_MESSAGES.chapter.delete.status_200 };
    } catch (error) {
      this.logger.error({
        message: HTTP_MESSAGES.internal.status_500,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.chapter.delete.status_500,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }
  }
}
