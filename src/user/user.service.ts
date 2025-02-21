import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import User from '../entities/User';
import { v4 as uuidv4 } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';
import EXCEPTION_MESSAGES from '../messages/exceptionMessages';
import { CEFRLevel, UserRoles } from '@prisma/client';
import HTTP_MESSAGES from '../messages/httpMessages';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async createUser(user: User): Promise<{ message: string; data: User }> {
    const validatedUser: User = await this.prismaService.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (validatedUser) {
      throw new ConflictException({
        message: HTTP_MESSAGES.user.create.status_409,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }

    const id: string = uuidv4();
    const saltRounds: number = parseInt(process.env.SALT_ROUNDS);

    if (isNaN(saltRounds)) {
      throw new InternalServerErrorException({
        message: EXCEPTION_MESSAGES.user.missingSaltRounds,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }

    const hash: string = await bcrypt.hash(user.password, saltRounds);

    try {
      const newUser: User = await this.prismaService.user.create({
        data: {
          id,
          name: user.name,
          role: UserRoles.USER,
          birthdate: dayjs(user.birthdate).toISOString(),
          email: user.email,
          country: user.country,
          state: user.state,
          city: user.city,
          password: hash,
          currentLevel: CEFRLevel.A1,
        },
      });

      return { message: HTTP_MESSAGES.user.create.status_200, data: newUser };
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
        message: HTTP_MESSAGES.user.create.status_500,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }
  }

  async fetchUsers(): Promise<{ message: string; data: User[] }> {
    try {
      const users: User[] = await this.prismaService.user.findMany();

      if (users.length === 0) {
        throw new NotFoundException({
          message: HTTP_MESSAGES.user.fetchAll.status_404,
          pid: process.pid,
          timestamp: dayjs().format('DD/MM/YYYY'),
        });
      }

      return { message: HTTP_MESSAGES.user.fetchAll.status_200, data: users };
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
        message: HTTP_MESSAGES.user.fetchAll.status_500,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }
  }

  async fetchUser(id: string): Promise<{ message: string; data: User }> {
    try {
      const user: User = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new NotFoundException({
          message: HTTP_MESSAGES.user.fetchOne.status_404,
          pid: process.pid,
          timestamp: dayjs().format('DD/MM/YYYY'),
        });
      }

      return { message: HTTP_MESSAGES.user.fetchOne.status_200, data: user };
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
        message: HTTP_MESSAGES.user.fetchOne.status_500,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }
  }

  async updateUser(
    userData: Partial<User>,
  ): Promise<{ message: string; data: User }> {
    try {
      const user: User = await this.prismaService.user.update({
        where: {
          id: userData.id,
        },
        data: {
          name: userData.name,
          birthdate: userData.birthdate,
          country: userData.country,
          state: userData.state,
          city: userData.city,
        },
      });

      return { message: HTTP_MESSAGES.user.update.status_200, data: user };
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
          message: HTTP_MESSAGES.user.update.status_404,
          pid: process.pid,
          timestamp: dayjs().format('DD/MM/YYYY'),
        });
      } else if (error.code === 'P2002') {
        this.logger.error({
          message: EXCEPTION_MESSAGES.general.prisma_P2002,
          code: error.code,
          error: error.message,
          stack: error.stack,
          pid: process.pid,
          timestamp: dayjs().format('DD/MM/YYYY'),
        });

        throw new InternalServerErrorException({
          message: HTTP_MESSAGES.user.update.status_500,
          pid: process.pid,
          timestamp: dayjs().format('DD/MM/YYYY'),
        });
      } else {
        this.logger.error({
          message: HTTP_MESSAGES.internal.status_500,
          code: error.code,
          error: error.message,
          stack: error.stack,
          pid: process.pid,
          timestamp: dayjs().format('DD/MM/YYYY'),
        });

        throw new InternalServerErrorException({
          message: HTTP_MESSAGES.user.update.status_500,
          pid: process.pid,
          timestamp: dayjs().format('DD/MM/YYYY'),
        });
      }
    }
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const user: User = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException({
        message: HTTP_MESSAGES.user.delete.status_404,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }

    try {
      await this.prismaService.user.delete({
        where: {
          id: user.id,
        },
      });
      return { message: HTTP_MESSAGES.user.delete.status_200 };
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
        message: HTTP_MESSAGES.user.delete.status_500,
        pid: process.pid,
        timestamp: dayjs().format('DD/MM/YYYY'),
      });
    }
  }
}
