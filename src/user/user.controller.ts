import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Logger } from 'nestjs-pino';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}
}
