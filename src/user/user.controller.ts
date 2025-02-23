import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Logger } from 'nestjs-pino';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from './DTOs/createUserDTO';
import HTTP_MESSAGES from '../messages/httpMessages';
import UpdateUserDTO from './DTOs/updateUserDTO';
import { Throttle } from '@nestjs/throttler';
import * as dayjs from 'dayjs';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  @Post()
  @Throttle({
    default: {
      ttl: 60000,
      limit: 3,
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: HTTP_MESSAGES.user.create.status_201,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    example: HTTP_MESSAGES.user.create.status_409,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.user.create.status_500,
  })
  async createUser(@Body() newUser: CreateUserDTO) {
    this.logger.log('Creating new user');
    return await this.userService.createUser(newUser);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.user.fetchAll.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.user.fetchAll.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.user.fetchAll.status_500,
  })
  async fetchUsers() {
    this.logger.log('Fetching users from the database');
    return await this.userService.fetchUsers();
  }

  @Get(':id')
  @Throttle({
    default: {
      ttl: 60000,
      limit: 3,
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.user.fetchOne.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.user.fetchOne.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.user.fetchOne.status_500,
  })
  async fetchUser(@Param('id', new ParseUUIDPipe()) id: string) {
    this.logger.log('Fetching user from the database');
    return await this.userService.fetchUser(id);
  }

  @Patch(':id')
  @Throttle({
    default: {
      ttl: 60000,
      limit: 3,
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.user.update.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    example: HTTP_MESSAGES.user.update.status_400,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: HTTP_MESSAGES.user.update.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.user.update.status_500,
  })
  async updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatedData: UpdateUserDTO,
  ) {
    if (updatedData === undefined) {
      this.logger.log('Request to update a chapter with an empty body.');
      throw new BadRequestException({
        message: HTTP_MESSAGES.user.update.status_400,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }

    this.logger.log('A user is being updated');
    return await this.userService.updateUser({
      id,
      ...updatedData,
    });
  }

  @Delete(':id')
  @Throttle({
    default: {
      ttl: 60000,
      limit: 3,
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.user.delete.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: HTTP_MESSAGES.user.delete.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.user.delete.status_500,
  })
  async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    this.logger.log('A user is being deleted');
    return await this.userService.deleteUser(id);
  }
}
