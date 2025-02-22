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
  createChapter(@Body() chapterData: CreateChapterDTO) {
    this.logger.log('Creating new chapter');
    return this.chapterService.createChapter(chapterData);
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
  fetchChapters() {
    this.logger.log('Fetching chapters from the database');
    return this.chapterService.fetchChapters();
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
  fetchChapter(@Param('id', new ParseIntPipe()) id: number) {
    this.logger.log('Fetching chapter from the database');
    return this.chapterService.fetchChapter(id);
  }

  @Patch(':id')
  updateChapter(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updatedData: UpdateChapterDTO,
  ) {
    if (updatedData === undefined) {
      this.logger.log('Request to update a chapter with an empty body.');
      throw new BadRequestException({
        message: HTTP_MESSAGES.chapter.update.status_400,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }
    this.logger.log('A chapter is being updated');
    return this.chapterService.updateChapter(id, updatedData);
  }

  @Delete(':id')
  deleteChapter(@Param('id', new ParseIntPipe()) id: number) {
    this.logger.log('A chapter is being deleted');
    return this.chapterService.deleteChapter(id);
  }
}
