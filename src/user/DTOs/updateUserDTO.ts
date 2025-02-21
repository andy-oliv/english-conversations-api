import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import VALIDATION_MESSAGES from '../../messages/validationMessages';

export default class UpdateUserDTO {
  @ApiProperty({
    required: false,
    description: 'User full name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.userDTO.name.isString })
  name: string;

  @ApiProperty({
    required: false,
    description: 'Birthdate in ISO 8601 format',
    example: '1995-10-09',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: VALIDATION_MESSAGES.userDTO.birthdate.invalidDate },
  )
  birthdate: Date;

  @ApiProperty({
    required: false,
    example: 'United States',
  })
  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.userDTO.country.isString })
  country: string;

  @ApiProperty({
    required: false,
    example: 'Arizona',
  })
  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.userDTO.state.isString })
  state: string;

  @ApiProperty({
    required: false,
    example: 'Phoenix',
  })
  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.userDTO.city.isString })
  city: string;
}
