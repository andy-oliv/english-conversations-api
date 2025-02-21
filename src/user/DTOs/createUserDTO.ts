import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import VALIDATION_MESSAGES from '../../messages/validationMessages';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({
    required: true,
    description: 'User full name',
    example: 'John Doe',
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.userDTO.name.isNotEmpty })
  @IsString({ message: VALIDATION_MESSAGES.userDTO.name.isString })
  name: string;

  @ApiProperty({
    required: true,
    description: 'Birthdate in ISO 8601 format',
    example: '1995-10-09',
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.userDTO.birthdate.isNotEmpty })
  @IsDateString(
    {},
    { message: VALIDATION_MESSAGES.userDTO.birthdate.invalidDate },
  )
  birthdate: Date;

  @ApiProperty({
    required: true,
    description: 'Valid email format',
    example: 'john.doe@mail.com',
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.userDTO.email.isNotEmpty })
  @IsEmail({}, { message: VALIDATION_MESSAGES.userDTO.email.isValidEmail })
  email: string;

  @ApiProperty({
    required: true,
    example: 'United States',
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.userDTO.country.isNotEmpty })
  @IsString({ message: VALIDATION_MESSAGES.userDTO.country.isString })
  country: string;

  @ApiProperty({
    required: true,
    example: 'Arizona',
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.userDTO.state.isNotEmpty })
  @IsString({ message: VALIDATION_MESSAGES.userDTO.state.isString })
  state: string;

  @ApiProperty({
    required: true,
    example: 'Phoenix',
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.userDTO.city.isNotEmpty })
  @IsString({ message: VALIDATION_MESSAGES.userDTO.city.isString })
  city: string;

  @ApiProperty({
    required: true,
    description:
      'Strong password with at least 8 characters, 1 symbol, 1 number, 1 lowercase letter and 1 uppercase letter',
    example: '1010$Lskpç$$dhfak2',
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.userDTO.password.isNotEmpty })
  @IsStrongPassword(
    { minLength: 8 },
    { message: VALIDATION_MESSAGES.userDTO.password.isStrongPassword },
  )
  password: string;
}
