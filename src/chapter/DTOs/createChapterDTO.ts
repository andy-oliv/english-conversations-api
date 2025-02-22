import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import VALIDATION_MESSAGES from '../../messages/validationMessages';

export default class CreateChapterDTO {
  @ApiProperty({
    title: 'Title',
    description: 'Chapter title',
    required: true,
    example: 'Chapter I',
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.chapterDTO.title.isNotEmpty,
  })
  @IsString({
    message: VALIDATION_MESSAGES.chapterDTO.title.isString,
  })
  title: string;

  @ApiProperty({
    title: 'Description',
    description: 'Chapter description',
    required: true,
    example: 'Welcome to the next chapter of our studies!',
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.chapterDTO.description.isNotEmpty,
  })
  @IsString({
    message: VALIDATION_MESSAGES.chapterDTO.description.isString,
  })
  description: string;

  @ApiProperty({
    title: 'Media URL',
    description: 'Media URL',
    required: false,
    example: 'http://drive.google.com/101jdflaaflhISl1',
  })
  @IsOptional()
  @IsString({
    message: VALIDATION_MESSAGES.chapterDTO.mediaUrl.isString,
  })
  mediaUrl?: string;

  @ApiProperty({
    title: 'Duration',
    description: 'A string containing the duration in minutes',
    required: true,
    example: '120',
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.chapterDTO.duration.isNotEmpty,
  })
  @IsString({
    message: VALIDATION_MESSAGES.chapterDTO.duration.isString,
  })
  duration: string;

  @ApiProperty({
    title: 'Required Chapter ID',
    description:
      "Integer that represents the ID of the previous chapter that is needed to get to the current one. If null, it doesn't require any other chapters",
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsInt({
    message: VALIDATION_MESSAGES.chapterDTO.requiredChapterId.isInt,
  })
  requiredChapterId?: number;
}
