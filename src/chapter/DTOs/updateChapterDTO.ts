import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import VALIDATION_MESSAGES from '../../messages/validationMessages';

export default class UpdateChapterDTO {
  @ApiProperty({
    title: 'Title',
    description: 'Chapter title',
    required: false,
    example: 'Chapter I',
  })
  @IsOptional()
  @IsString({
    message: VALIDATION_MESSAGES.chapterDTO.title.isString,
  })
  title?: string;

  @ApiProperty({
    title: 'Description',
    description: 'Chapter description',
    required: false,
    example: 'Welcome to the next chapter of our studies!',
  })
  @IsOptional()
  @IsString({
    message: VALIDATION_MESSAGES.chapterDTO.description.isString,
  })
  description?: string;

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
    required: false,
    example: '120',
  })
  @IsOptional()
  @IsString({
    message: VALIDATION_MESSAGES.chapterDTO.duration.isString,
  })
  duration?: string;

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
