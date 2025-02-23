import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { ChapterService } from './chapter.service';
import CreateChapterDTO from './DTOs/createChapterDTO';
import HTTP_MESSAGES from '../messages/httpMessages';
import UpdateChapterDTO from './DTOs/updateChapterDTO';
import * as dayjs from 'dayjs';

@ApiTags('Chapter')
@Controller('chapter')
export class ChapterController {
  constructor(
    private readonly logger: Logger,
    private readonly chapterService: ChapterService,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Created',
    example: HTTP_MESSAGES.chapter.create.status_201,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.chapter.create.status_500,
  })
  async createChapter(@Body() chapterData: CreateChapterDTO) {
    this.logger.log('Creating new chapter');
    return await this.chapterService.createChapter(chapterData);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.chapter.fetchAll.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.chapter.fetchAll.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.chapter.fetchAll.status_500,
  })
  async fetchChapters() {
    this.logger.log('Fetching chapters from the database');
    return await this.chapterService.fetchChapters();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.chapter.fetchOne.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.chapter.fetchOne.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.chapter.fetchOne.status_500,
  })
  async fetchChapter(@Param('id', new ParseIntPipe()) id: number) {
    this.logger.log('Fetching chapter from the database');
    return await this.chapterService.fetchChapter(id);
  }

  @Patch(':id')
  async updateChapter(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updatedData: UpdateChapterDTO,
  ) {
    if (!updatedData || Object.keys(updatedData).length === 0) {
      this.logger.log('Request to update a chapter with an empty body.');
      throw new BadRequestException({
        message: HTTP_MESSAGES.chapter.update.status_400,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }
    this.logger.log('A chapter is being updated');
    return await this.chapterService.updateChapter(id, updatedData);
  }

  @Delete(':id')
  async deleteChapter(@Param('id', new ParseIntPipe()) id: number) {
    this.logger.log('A chapter is being deleted');
    return await this.chapterService.deleteChapter(id);
  }
}
