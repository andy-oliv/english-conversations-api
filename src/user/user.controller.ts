import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Logger } from 'nestjs-pino';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from './DTOs/createUserDTO';
import HTTP_MESSAGES from '../messages/httpMessages';
import FetchUserDTO from './DTOs/fetchUserDTO';
import UpdateUserDTO from './DTOs/updateUserDTO';
import { Throttle } from '@nestjs/throttler';

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
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.user.create.status_200,
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
  createUser(@Body() newUser: CreateUserDTO) {
    this.logger.log('Creating new user');
    return this.userService.createUser(newUser);
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
  fetchUsers() {
    this.logger.log('Fetching users from the database');
    return this.userService.fetchUsers();
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
  fetchUser(@Param() { id }: FetchUserDTO) {
    this.logger.log('Fetching user from the database');
    return this.userService.fetchUser(id);
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
    status: 404,
    description: 'Not Found',
    example: HTTP_MESSAGES.user.update.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.user.update.status_500,
  })
  updateUser(
    @Param() { id }: FetchUserDTO,
    @Body() { name, birthdate, country, state, city }: UpdateUserDTO,
  ) {
    this.logger.log('A user is being updated');
    return this.userService.updateUser({
      id,
      name,
      birthdate,
      country,
      city,
      state,
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
  deleteUser(@Param() { id }: FetchUserDTO) {
    this.logger.log('A user is being deleted');
    return this.userService.deleteUser(id);
  }
}
